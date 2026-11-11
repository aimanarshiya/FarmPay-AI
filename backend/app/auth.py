import os
import hmac
import hashlib
import logging
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional, List

import jwt
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field

from app.database import get_connection

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

logger = logging.getLogger(__name__)


def _configured_jwt_secret(environment=None) -> str:
    config = os.environ if environment is None else environment
    secret = config.get("JWT_SECRET", "").strip()
    if not secret:
        raise RuntimeError(
            "JWT_SECRET is required. Configure a unique secret in backend/.env before starting FarmPay AI."
        )
    if len(secret) < 32 or secret.lower().startswith("replace_with_"):
        raise RuntimeError(
            "JWT_SECRET must be a unique secret containing at least 32 characters."
        )
    return secret


JWT_SECRET = _configured_jwt_secret()
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))


# --------------------------------------------------
# CRYPTO HELPERS (PBKDF2-HMAC-SHA256)
# --------------------------------------------------

def hash_password(password: str) -> tuple[str, str]:
    """Hashes a password with a fresh random salt using PBKDF2-HMAC-SHA256."""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        150000,
    ).hex()
    return pwd_hash, salt


def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    """Verifies a password against the stored PBKDF2 hash using constant-time comparison."""
    computed_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        150000,
    ).hex()
    return hmac.compare_digest(computed_hash, stored_hash)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Encodes a signed JWT with expiration timestamp."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decodes and validates a signed JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )


# --------------------------------------------------
# PYDANTIC SCHEMAS
# --------------------------------------------------

class FarmerRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    password: str = Field(min_length=6, max_length=100)
    village_city: str = Field(min_length=2, max_length=100)
    district: str = Field(min_length=2, max_length=100)
    state: str = Field(default="Andhra Pradesh", max_length=100)
    land_acres: Optional[float] = Field(default=None, ge=0)
    primary_crop: Optional[str] = Field(default=None, max_length=100)
    preferred_language: str = Field(default="en", max_length=10)


class BuyerRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    business_name: str = Field(min_length=2, max_length=150)
    business_type: str = Field(default="Mandi Trader", max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    password: str = Field(min_length=6, max_length=100)
    city: str = Field(min_length=2, max_length=100)
    district: str = Field(min_length=2, max_length=100)
    state: str = Field(default="Andhra Pradesh", max_length=100)
    preferred_language: str = Field(default="en", max_length=10)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# --------------------------------------------------
# DEPENDENCIES
# --------------------------------------------------

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    """Dependency that extracts and validates the logged-in user from the Bearer token."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
        )

    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed authentication token.",
        )

    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT user_id, email, role, name, preferred_language, is_active
                FROM users
                WHERE user_id = %s
                """,
                (user_id,),
            )
            user = cursor.fetchone()

        if not user or not user["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is inactive or not found.",
            )

        return user
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Could not validate authenticated user against the database")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is temporarily unavailable.",
        ) from exc
    finally:
        if connection is not None:
            connection.close()


def require_role(allowed_roles: List[str]):
    """Returns a dependency checking that the user's role is in allowed_roles."""
    def role_checker(user: dict = Depends(get_current_user)) -> dict:
        if user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of these roles: {', '.join(allowed_roles)}",
            )
        return user
    return role_checker


# --------------------------------------------------
# AUTH ENDPOINTS
# --------------------------------------------------

@router.post("/register/farmer")
def register_farmer(req: FarmerRegisterRequest):
    user_id = f"USR-FARM-{secrets.token_hex(6).upper()}"
    pwd_hash, salt = hash_password(req.password)
    now = datetime.now(timezone.utc).replace(tzinfo=None)

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Check if email is already taken
            cursor.execute("SELECT user_id FROM users WHERE email = %s", (req.email,))
            if cursor.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="An account with this email already exists.",
                )

            # Insert User
            cursor.execute(
                """
                INSERT INTO users (user_id, email, phone, password_hash, salt, role, name, preferred_language, is_active, created_at)
                VALUES (%s, %s, %s, %s, %s, 'FARMER', %s, %s, TRUE, %s)
                """,
                (user_id, req.email, req.phone, pwd_hash, salt, req.name, req.preferred_language, now),
            )

            # Insert Farmer Profile
            cursor.execute(
                """
                INSERT INTO farmer_profiles (user_id, village_city, district, state, land_acres, primary_crop, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (user_id, req.village_city, req.district, req.state, req.land_acres, req.primary_crop, now),
            )

        connection.commit()

        token = create_access_token({
            "sub": user_id,
            "email": req.email,
            "role": "FARMER",
            "name": req.name,
            "preferred_language": req.preferred_language,
        })

        return {
            "success": True,
            "message": "Farmer registered successfully.",
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "user_id": user_id,
                "email": req.email,
                "name": req.name,
                "role": "FARMER",
                "village_city": req.village_city,
                "district": req.district,
                "state": req.state,
                "preferred_language": req.preferred_language,
            },
        }
    except HTTPException:
        connection.rollback()
        raise
    except Exception as ex:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(ex)}",
        )
    finally:
        connection.close()


@router.post("/register/buyer")
def register_buyer(req: BuyerRegisterRequest):
    user_id = f"USR-BUY-{secrets.token_hex(6).upper()}"
    pwd_hash, salt = hash_password(req.password)
    now = datetime.now(timezone.utc).replace(tzinfo=None)

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT user_id FROM users WHERE email = %s", (req.email,))
            if cursor.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="An account with this email already exists.",
                )

            cursor.execute(
                """
                INSERT INTO users (user_id, email, phone, password_hash, salt, role, name, preferred_language, is_active, created_at)
                VALUES (%s, %s, %s, %s, %s, 'BUYER', %s, %s, TRUE, %s)
                """,
                (user_id, req.email, req.phone, pwd_hash, salt, req.name, req.preferred_language, now),
            )

            cursor.execute(
                """
                INSERT INTO buyer_profiles (user_id, business_name, business_type, city, district, state, verified, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, FALSE, %s)
                """,
                (user_id, req.business_name, req.business_type, req.city, req.district, req.state, now),
            )

        connection.commit()

        token = create_access_token({
            "sub": user_id,
            "email": req.email,
            "role": "BUYER",
            "name": req.name,
            "business_name": req.business_name,
            "preferred_language": req.preferred_language,
        })

        return {
            "success": True,
            "message": "Buyer registered successfully.",
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "user_id": user_id,
                "email": req.email,
                "name": req.name,
                "business_name": req.business_name,
                "role": "BUYER",
                "city": req.city,
                "district": req.district,
                "state": req.state,
                "preferred_language": req.preferred_language,
            },
        }
    except HTTPException:
        connection.rollback()
        raise
    except Exception as ex:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(ex)}",
        )
    finally:
        connection.close()


@router.post("/login")
def login(req: LoginRequest):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT u.user_id, u.email, u.password_hash, u.salt, u.role, u.name, u.preferred_language, u.is_active,
                       f.village_city, f.district as farmer_district,
                       b.business_name, b.city as buyer_city
                FROM users u
                LEFT JOIN farmer_profiles f ON u.user_id = f.user_id
                LEFT JOIN buyer_profiles b ON u.user_id = b.user_id
                WHERE u.email = %s
                """,
                (req.email,),
            )
            user = cursor.fetchone()

        if not user or not verify_password(req.password, user["password_hash"], user["salt"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if not user["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been deactivated. Please contact support.",
            )

        token = create_access_token({
            "sub": user["user_id"],
            "email": user["email"],
            "role": user["role"],
            "name": user["name"],
            "preferred_language": user["preferred_language"],
        })

        location = user.get("village_city") or user.get("buyer_city") or "India"

        return {
            "success": True,
            "message": "Login successful.",
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "user_id": user["user_id"],
                "email": user["email"],
                "role": user["role"],
                "name": user["name"],
                "business_name": user.get("business_name"),
                "location": location,
                "preferred_language": user["preferred_language"],
            },
        }
    finally:
        connection.close()


@router.get("/me")
def get_current_user_profile(user: dict = Depends(get_current_user)):
    """Returns the authenticated profile of the current user."""
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT u.user_id, u.email, u.role, u.name, u.preferred_language,
                       f.village_city, f.district, f.state, f.land_acres, f.primary_crop,
                       b.business_name, b.business_type, b.city, b.verified
                FROM users u
                LEFT JOIN farmer_profiles f ON u.user_id = f.user_id
                LEFT JOIN buyer_profiles b ON u.user_id = b.user_id
                WHERE u.user_id = %s
                """,
                (user["user_id"],),
            )
            profile = cursor.fetchone() or user

        return {"success": True, "user": profile}
    finally:
        connection.close()
