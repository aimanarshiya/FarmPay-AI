
# FarmPay AI

**Smarter Farming. Better Selling. Simpler Payments.**

FarmPay AI is a voice-first, AI-powered agricultural selling assistant designed to help Indian farmers compare crop buyer offers, calculate estimated net earnings, and manage orders and digital payment status.

## Project Status

Active development — Phase 0 (Foundation) complete. Phase 1 (Full Payment Flow) next.

## Planned Features

- Voice and text interaction with multilingual support.
- AI agents that retrieve and compare buyer offers.
- Transparent net-proceeds calculations.
- Farmer-confirmed order creation.
- PayPal Sandbox checkout and verified payment status.
- Mobile-friendly farmer interface.

## Technology Stack

- **Frontend:** React 19, Vite 8 (custom CSS, no Tailwind yet)
- **Backend:** Python 3.13, FastAPI, Uvicorn
- **Database:** MySQL 8.0
- **Payments:** PayPal Orders REST API v2 (Sandbox)
- **Source control:** Git and GitHub

## Prerequisites

- Python 3.11+
- Node.js 20+ LTS
- MySQL 8.0 (running locally)
- Git

## First-Time Setup

### 1. Clone the repository

```
git clone https://github.com/aimanarshiya/FarmPay-AI.git
cd FarmPay-AI
```

### 2. Configure the backend

```
cd backend
copy .env.example .env
```

Edit `backend/.env` and fill in your MySQL credentials and PayPal Sandbox API credentials.

Create the database schema (run once):

```
mysql -u root -p < app/schema.sql
```

Create and activate the Python virtual environment:

```
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell
source .venv/bin/activate       # macOS / Linux
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure the frontend

```
cd ../frontend
copy .env.example .env.local
```

The default value (`VITE_API_URL=http://127.0.0.1:8000`) works for local development without changes.

Install frontend dependencies:

```
npm install
```

## Running the Application

Open **three terminals** from the project root.

### Terminal 1 — MySQL (Administrator PowerShell, Windows only)

```
net start MySQL80
```

### Terminal 2 — Backend

```
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 3 — Frontend

```
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Useful URLs

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | React frontend |
| `http://127.0.0.1:8000` | FastAPI root |
| `http://127.0.0.1:8000/health` | Backend health check |
| `http://127.0.0.1:8000/docs` | Auto-generated API documentation |

## Demo Data and Payments

- Buyer offers are clearly labelled as **DEMO** data with illustrative prices.
- PayPal Sandbox transactions use a **$1.00 USD test charge** and do not represent real payments.
- The $1 test charge does not settle the INR FarmPay order. This is intentional prototype behaviour.

## Security Notes

- **Never commit `backend/.env`** — it contains database credentials and PayPal API keys.
- `.env` is excluded from Git tracking by `.gitignore`.
- Use `backend/.env.example` as a safe template for onboarding.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
