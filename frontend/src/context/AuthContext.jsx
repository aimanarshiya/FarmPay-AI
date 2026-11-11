import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { fetchMe } from "../api/auth";
import { AUTH_INVALID_EVENT } from "../api/apiClient";
import { getTranslation } from "../utils/i18n";

const AUTH_TOKEN_KEY = "farmpay_auth_token";
const AUTH_USER_KEY = "farmpay_auth_user";
const LANGUAGE_KEY = "farmpay_lang";
const VALID_ROLES = new Set(["FARMER", "BUYER", "ADMIN"]);

function getStoredToken() {
  try {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (token && !readTokenClaims(token)) {
      clearStoredSession();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

function getStoredLanguage() {
  try {
    const language = window.localStorage.getItem(LANGUAGE_KEY);
    return ["en", "te", "hi"].includes(language) ? language : "en";
  } catch {
    return "en";
  }
}

function readTokenClaims(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (
      typeof decoded.sub !== "string" ||
      !VALID_ROLES.has(decoded.role) ||
      !Number.isFinite(decoded.exp) ||
      decoded.exp * 1000 <= Date.now()
    ) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function persistSession(token, user) {
  try {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    return false;
  }
  return true;
}

function clearStoredSession() {
  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // In-memory authentication state is still cleared if storage is unavailable.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken);
  const [language, setLanguage] = useState(getStoredLanguage);
  const [authLoading, setAuthLoading] = useState(Boolean(getStoredToken()));
  const [authValidationError, setAuthValidationError] = useState("");
  const [validationAttempt, setValidationAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const claims = token ? readTokenClaims(token) : null;

    if (!token) {
      clearStoredSession();
      return undefined;
    }

    if (!claims) {
      window.dispatchEvent(new Event(AUTH_INVALID_EVENT));
      return undefined;
    }

    fetchMe()
      .then((response) => {
        const currentUser = response.user;
        if (
          !active ||
          !currentUser ||
          currentUser.user_id !== claims.sub ||
          currentUser.role !== claims.role ||
          !VALID_ROLES.has(currentUser.role)
        ) {
          if (active) {
            clearStoredSession();
            setToken(null);
            setUser(null);
            setAuthValidationError("");
            setAuthLoading(false);
          }
          return;
        }

        setUser(currentUser);
        setAuthValidationError("");
        setAuthLoading(false);
        persistSession(token, currentUser);
        if (currentUser.preferred_language && ["en", "te", "hi"].includes(currentUser.preferred_language)) {
          setLanguage(currentUser.preferred_language);
          try {
            window.localStorage.setItem(LANGUAGE_KEY, currentUser.preferred_language);
          } catch {
            // Language remains available for the current page session.
          }
        }
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401) {
          clearStoredSession();
          setToken(null);
          setUser(null);
          setAuthValidationError("");
        } else {
          setUser(null);
          setAuthValidationError("Your session could not be verified. Check your connection and try again.");
        }
        setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, validationAttempt]);

  useEffect(() => {
    function handleInvalidSession() {
      clearStoredSession();
      setToken(null);
      setUser(null);
      setAuthLoading(false);
      setAuthValidationError("");
    }

    function handleStorageChange(event) {
      if (event.key === AUTH_TOKEN_KEY && !event.newValue) {
        handleInvalidSession();
      } else if (event.key === AUTH_TOKEN_KEY && event.newValue !== token) {
        if (!readTokenClaims(event.newValue)) {
          handleInvalidSession();
          return;
        }
        setToken(event.newValue);
        setUser(null);
        setAuthLoading(true);
      }
    }

    window.addEventListener(AUTH_INVALID_EVENT, handleInvalidSession);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener(AUTH_INVALID_EVENT, handleInvalidSession);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  function login(newToken, newUser) {
    const claims = readTokenClaims(newToken);
    if (
      !claims ||
      !newUser ||
      newUser.user_id !== claims.sub ||
      newUser.role !== claims.role
    ) {
      throw new Error("The server returned an invalid sign-in session. Please try again.");
    }

    if (!persistSession(newToken, newUser)) {
      throw new Error("Could not save your sign-in session in this browser. Check storage settings and try again.");
    }
    setToken(newToken);
    setUser(newUser);
    setAuthLoading(false);
    setAuthValidationError("");
    if (["en", "te", "hi"].includes(newUser.preferred_language)) {
      setLanguage(newUser.preferred_language);
      try {
        window.localStorage.setItem(LANGUAGE_KEY, newUser.preferred_language);
      } catch {
        // Language remains available for the current page session.
      }
    }
  }

  function logout() {
    clearStoredSession();
    setToken(null);
    setUser(null);
    setAuthLoading(false);
    setAuthValidationError("");
  }

  function toggleLanguage(lang) {
    if (!["en", "te", "hi"].includes(lang)) return;
    setLanguage(lang);
    try {
      window.localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
      // Language remains available for the current page session.
    }
  }

  const retrySessionValidation = useCallback(() => {
    setAuthValidationError("");
    setAuthLoading(true);
    setValidationAttempt((attempt) => attempt + 1);
  }, []);

  function t(key) {
    return getTranslation(language, key);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        language,
        isAuthenticated: Boolean(token && user),
        role: user?.role || null,
        authLoading,
        authValidationError,
        login,
        logout,
        toggleLanguage,
        retrySessionValidation,
        t,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
