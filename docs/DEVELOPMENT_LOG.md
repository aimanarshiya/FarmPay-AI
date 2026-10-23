# FARMPAY AI — DEVELOPMENT LOG
## Day 1 and Day 2: Environment Setup, Project Initialization, React, FastAPI and API Integration

Project Name: FarmPay AI

Tagline: Smarter Farming. Better Selling. Simpler Payments.

GitHub Repository: https://github.com/aimanarshiya/FarmPay-AI

Local Project Location: C:\Users\DELL-PC\FarmPay-AI

Development Environment: Windows 10/11, PowerShell, Visual Studio Code

Project Type: AI-powered, voice-first agricultural selling assistant

---

# 1. PROJECT OVERVIEW

FarmPay AI is a planned web application that will help Indian farmers discover better crop-selling opportunities.

The planned application will allow farmers to:

- Enter crop details using voice or text.
- Specify crop quantity and location.
- Compare available buyer offers.
- Calculate estimated earnings after selling costs.
- Confirm an order.
- Follow the order and payment status.
- Use a multilingual, mobile-friendly interface.

Buyer offers will initially use clearly labelled demonstration data. PayPal Sandbox will be used to demonstrate the payment workflow, not real-money transactions.

The long-term goal is to build a working full-stack application using React, FastAPI, a database, an AI agent and a payment integration.

Important: On Days 1 and 2, we built the initial development environment and connected the frontend to the backend. We have not yet implemented the complete AI agent, database, buyer marketplace or payment workflow.

---

# 2. DAY 1 — PROJECT INITIALIZATION AND ENVIRONMENT SETUP

## Step 1: Understand the required technology stack

Before writing the application, we identified the main technologies required.

1. Frontend: React
   - Builds the user interface.
   - Displays information and collects farmer inputs.
   - Runs in the web browser.

2. Frontend development server: Vite
   - Creates and runs the React application during development.
   - Provides fast startup and automatic browser refresh when source files change.

3. Backend: Python and FastAPI
   - Handles HTTP requests from the frontend.
   - Will later contain business logic, AI tools, buyer comparisons and order management.

4. Backend development server: Uvicorn
   - Runs the FastAPI application locally.
   - Supports automatic reloading during development.

5. Database: MySQL
   - Planned for future storage of users, crop requests, offers and orders.
   - Not installed or connected during Days 1 and 2.

6. Version control: Git and GitHub
   - Git tracks changes to source code.
   - GitHub stores the remote repository and provides an online backup.

7. Future technologies
   - Tailwind CSS for styling.
   - An LLM API and controlled agent tool calling.
   - PayPal Sandbox for payment-flow demonstration.
   - Voice input and multilingual support.

These future technologies are planned, not all installed.

## Step 2: Check the installed software

We opened a terminal and checked the development tools.

Commands:

python --version

node --version

npm --version

git --version

Initial versions:

- Python: 3.13.12
- Node.js: 25.2.1
- npm: 11.16.0
- Git: 2.52.0.windows.1

Why did we check these?

- Python is needed for the backend.
- Node.js runs JavaScript development tools.
- npm installs frontend packages.
- Git tracks project changes.

Checking versions before development helps identify missing dependencies and compatibility issues.

## Step 3: Switch Node.js to an LTS release

Initially, Node.js 25.2.1 was installed.

We decided to use an LTS release for a more stable development environment.

Actions performed:

1. Opened Windows Settings.
2. Navigated to Apps and Installed Apps.
3. Uninstalled the existing Node.js installation.
4. Opened the official website:
   https://nodejs.org/en/download
5. Downloaded and installed the Windows x64 installer for the LTS release.
6. Opened a new terminal.
7. Checked the installed versions again.

Verification commands:

node --version

npm --version

Final verified versions:

- Node.js: v24.22.1
- npm: 11.16.0

The version check confirmed that Windows was using Node.js 24.22.1 after installation.

Note: The npm version remained 11.16.0. npm is a separate package manager distributed with Node.js.

## Step 4: Create the GitHub repository

Repository URL:

https://github.com/aimanarshiya/FarmPay-AI

The repository is named FarmPay-AI.

The local project folder is:

C:\Users\DELL-PC\FarmPay-AI

We use this folder as the root directory for the project.

Why is the root directory important?

It contains the frontend, backend, documentation, screenshots and project-level files.

## Step 5: Open the project in Visual Studio Code

Command:

code .

Explanation:

- `code` launches Visual Studio Code.
- `.` means the current directory.
- The command opens the entire project folder so that we can edit multiple files in one workspace.

## Step 6: Create the project folder structure

We created these folders:

FarmPay-AI/
    frontend/
    backend/
    docs/
    screenshots/

Commands used in PowerShell:

New-Item -ItemType Directory -Force frontend, backend, docs, screenshots

We also created placeholder files:

New-Item -ItemType File -Force frontend/.gitkeep, backend/.gitkeep, docs/.gitkeep, screenshots/.gitkeep

Why did we create these folders?

- `frontend/`: React application.
- `backend/`: Python API and business logic.
- `docs/`: project documentation and technical notes.
- `screenshots/`: application screenshots for documentation and submission.

Why use `.gitkeep`?

Git does not normally track empty directories. A `.gitkeep` file is a convention used to keep an otherwise empty directory visible in the repository.

We later removed `frontend/.gitkeep` when creating the React application inside the frontend directory.

## Step 7: Configure .gitignore

File:

`.gitignore`

Purpose:

It prevents unnecessary, generated or sensitive files from being committed to Git.

The relevant entries added or maintained included:

# Python
__pycache__/
*.py[cod]
.venv/
venv/
.env
.env.*
!.env.example
.pytest_cache/
.mypy_cache/

# Frontend dependencies and builds
node_modules/
dist/
coverage/

# IDE and operating system
.vscode/
.idea/
.DS_Store
Thumbs.db

# Local databases and logs
*.log

Important explanations:

- `__pycache__/`: ignores Python-generated cache directories.
- `*.py[cod]`: ignores compiled Python files.
- `.venv/`: ignores the local Python virtual environment.
- `.env`: ignores local environment-variable files containing configuration or secrets.
- `node_modules/`: ignores installed JavaScript dependencies.
- `dist/`: ignores the frontend's generated production build.
- `*.log`: ignores log files.

Why is this important?

We should not upload API keys, credentials, virtual environments or generated dependency folders to GitHub.

## Step 8: Prepare README.md

File:

`README.md`

The README describes the purpose and current status of the project.

The project documentation includes:

- Project name and tagline.
- Project overview.
- Planned features.
- Technology stack.
- Development status.
- Explanation of demo data and Sandbox payments.
- License information.

We described FarmPay AI as a voice-first agricultural selling assistant that aims to help farmers compare crop buyer offers and calculate estimated net earnings.

We also made it clear that buyer offers are demonstration data and that Sandbox payments are tests.

Why is README.md important?

It is the first document a visitor usually reads on GitHub. It explains what the application is supposed to do, how it is built and which features are planned.

## Step 9: Initialize and synchronize Git

We checked the repository state using:

git status

We staged the project files:

git add .

We created the initial project commit:

git commit -m "chore: initialize FarmPay AI project"

The commit was created successfully.

We initially attempted:

git push origin main

The push was rejected because the remote GitHub branch contained changes that were not yet present in our local branch.

Instead of force-pushing, we integrated the remote changes:

git pull --rebase origin main

The rebase completed successfully.

We then proceeded with:

git push origin main

We also used:

git status

to inspect the final repository state.

Why did we use Git?

- To maintain a history of changes.
- To back up our code on GitHub.
- To recover from mistakes.
- To collaborate and submit the project.
- To preserve working milestones as development progresses.

A Git commit saves a snapshot locally. A successful Git push uploads committed changes to the remote repository.

DAY 1 RESULT:

- Development tools checked.
- Node.js switched to the LTS release.
- Project directory created.
- GitHub repository connected.
- Initial folders and project documentation prepared.
- .gitignore configured.
- Initial commit created and remote changes integrated.

---

# 3. DAY 2 — CREATE THE FRONTEND

## Step 1: Open the project root

We used PowerShell.

Command:

cd C:\Users\DELL-PC\FarmPay-AI

`cd` means change directory.

We ran the frontend setup from the project root because the React application belongs inside the `frontend` directory.

## Step 2: Remove the frontend placeholder

Command:

Remove-Item frontend\.gitkeep

Why?

The frontend directory originally contained a placeholder file created on Day 1.

We removed the placeholder before scaffolding the React application.

We did not remove the whole project directory.

## Step 3: Create a React application using Vite

Command:

npm create vite@latest frontend -- --template react

Explanation:

- `npm create vite@latest`: runs the Vite project scaffolding tool.
- `frontend`: specifies the target directory.
- `--`: separates npm's arguments from the arguments passed to Vite.
- `--template react`: selects the React template.

Vite generated the starter React project.

The resulting frontend directory contains the initial application files, including:

- `package.json`: project metadata, dependencies and npm scripts.
- `src/`: React source code.
- `src/App.jsx`: main application component.
- `src/main.jsx`: application entry point.
- `index.html`: HTML page loaded by the browser.
- `vite.config.js`: Vite configuration.

The exact set of files can vary slightly with the Vite version.

## Step 4: Install the frontend dependencies

We entered the frontend directory:

cd frontend

We installed the packages:

npm install

What does `npm install` do?

It reads the frontend's `package.json` and installs the required packages into `node_modules`.

The installed dependencies include React, React DOM and Vite, along with the template's required development dependencies.

`node_modules` is generated locally and is excluded from Git.

## Step 5: Run the frontend development server

Command:

npm run dev

Vite starts a local development server.

The website was available at:

http://localhost:5173/

We opened this URL in a browser and confirmed that the React starter page was displayed.

Why is this step important?

It verifies that Node.js, npm, Vite and React are working before we add our own interface.

DAY 2 FRONTEND RESULT:

The React application runs locally in the browser.

---

# 4. DAY 2 — CREATE THE FASTAPI BACKEND

## Step 1: Open a separate terminal

We kept the frontend terminal running.

We opened a second terminal in Visual Studio Code and entered:

cd C:\Users\DELL-PC\FarmPay-AI\backend

Why use two terminals?

The frontend and backend are two independent development servers.

- Frontend server: port 5173.
- Backend server: port 8000.

Both need to run while we test the complete application.

## Step 2: Create a Python virtual environment

Command:

python -m venv .venv

Explanation:

- `python`: runs Python.
- `-m venv`: runs Python's built-in virtual-environment module.
- `.venv`: names the environment directory.

Why use a virtual environment?

It isolates project dependencies from other Python projects and reduces package conflicts.

The `.venv` directory is local to the backend and excluded from Git.

## Step 3: Activate the virtual environment

Command in PowerShell:

.\.venv\Scripts\Activate.ps1

After activation, the terminal prompt showed:

(.venv) PS C:\Users\DELL-PC\FarmPay-AI\backend>

The `(.venv)` prefix indicates that the virtual environment is active.

## Step 4: Install FastAPI

First, we upgraded pip:

python -m pip install --upgrade pip

Then installed FastAPI with its standard extras:

python -m pip install "fastapi[standard]"

What was installed?

- FastAPI: Python web framework for defining API endpoints.
- Uvicorn: ASGI server used to run the application.
- Standard optional dependencies included by the FastAPI standard extra.

Why FastAPI?

FastAPI will act as the backend for farmer requests, buyer-offer comparisons, AI-agent tools, order creation and payment verification.

Why Uvicorn?

FastAPI defines the application, while Uvicorn runs it and accepts HTTP requests.

---

# 5. CREATE THE BACKEND SOURCE FILE

## Step 1: Create the app directory

From the backend directory, we ran:

New-Item -ItemType Directory -Force app

New-Item -ItemType File -Force app\main.py

The resulting structure is:

backend/
    .venv/
    app/
        main.py

The `app` directory contains our Python application code.

The `main.py` file contains the FastAPI application and its endpoints.

## Step 2: Write the initial FastAPI code

File:

`backend/app/main.py`

Initial code:

from fastapi import FastAPI

app = FastAPI(title="FarmPay AI API")


@app.get("/")
def home():
    return {"message": "Welcome to FarmPay AI"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

Explanation of every part:

1. `from fastapi import FastAPI`

   Imports the FastAPI class so we can create a web API.

2. `app = FastAPI(title="FarmPay AI API")`

   Creates the FastAPI application instance.

   The variable `app` is the application object that Uvicorn runs.

3. `@app.get("/")`

   Registers a GET endpoint at the root URL.

4. `def home():`

   Defines the Python function that runs when a GET request reaches `/`.

5. `return {"message": "Welcome to FarmPay AI"}`

   Returns a Python dictionary. FastAPI converts it into a JSON response.

6. `@app.get("/health")`

   Registers a separate GET endpoint at `/health`.

7. `def health_check():`

   Defines the health-check function.

8. `return {"status": "healthy"}`

   Returns a JSON response indicating that the health endpoint is responding.

Why create a health endpoint?

It provides a simple way to verify that the backend is reachable before integrating more complex features.

---

# 6. RUN AND TEST THE BACKEND

## Step 1: Start Uvicorn

We ran this command from the backend directory, with the virtual environment active:

python -m uvicorn app.main:app --reload

Meaning of each part:

- `python -m uvicorn`: runs Uvicorn through the active Python environment.
- `app.main`: identifies the Python module `app/main.py`.
- `:app`: selects the FastAPI application object named `app` inside that module.
- `--reload`: restarts the development server when source files change.

The server started at:

http://127.0.0.1:8000

The terminal showed:

Application startup complete.

This indicated that the application had started successfully.

## Step 2: Test the root endpoint

URL:

http://127.0.0.1:8000/

The terminal showed:

GET / HTTP/1.1 200 OK

`200 OK` is an HTTP success status. It confirmed that the root endpoint responded successfully.

## Step 3: Test the health endpoint

URL:

http://127.0.0.1:8000/health

Expected response:

{"status":"healthy"}

This confirms that the health endpoint is responding.

## Step 4: Open the automatic API documentation

URL:

http://127.0.0.1:8000/docs

FastAPI generates interactive API documentation automatically.

The `/docs` page lets us inspect and test the endpoints without building a separate API-testing interface.

BACKEND RESULT:

- FastAPI application created.
- Uvicorn development server running.
- Root endpoint responding.
- Health endpoint available.
- Automatic API documentation available.

---

# 7. CONNECT REACT AND FASTAPI

This was the most important integration task on Day 2.

Initially, React and FastAPI were running independently.

We then configured FastAPI to accept frontend requests and changed React to fetch a message from the backend.

## Step 1: Add CORS middleware

File:

`backend/app/main.py`

We replaced the initial code with:

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FarmPay AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to FarmPay AI"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/message")
def get_message():
    return {
        "message": "Welcome to FarmPay AI!",
        "description": "Smarter Farming. Better Selling. Simpler Payments.",
        "backend": "FastAPI connected successfully",
    }

### Explanation of the new code

1. `from fastapi.middleware.cors import CORSMiddleware`

   Imports the middleware used to configure Cross-Origin Resource Sharing.

2. `app.add_middleware(...)`

   Adds CORS rules to the FastAPI application.

3. `allow_origins`

   Specifies the browser origins allowed to make cross-origin requests.

   We allowed:

   - `http://localhost:5173`
   - `http://127.0.0.1:5173`

   A browser treats different origins as distinct. For example, `localhost` and `127.0.0.1` are different hostnames even when they refer to the local computer.

4. `allow_credentials=True`

   Allows credentialed cross-origin requests where applicable.

5. `allow_methods=["*"]`

   Allows HTTP methods across the configured origins.

6. `allow_headers=["*"]`

   Allows request headers across the configured origins.

These development settings are intended for local testing. Production deployment should use a deliberate list of trusted origins and only the permissions the application needs.

### Why did we need CORS?

React runs at port 5173, while FastAPI runs at port 8000.

The browser sees these as different origins because their ports differ.

CORS tells the browser which frontend origins are permitted to access the backend.

CORS is a browser security mechanism. It is not authentication and does not replace backend authorization.

## Step 2: Add the message endpoint

The new endpoint is:

`GET /api/message`

Its function:

def get_message():
    return {
        "message": "Welcome to FarmPay AI!",
        "description": "Smarter Farming. Better Selling. Simpler Payments.",
        "backend": "FastAPI connected successfully",
    }

It returns three fields:

- `message`: a welcome message.
- `description`: the FarmPay AI tagline.
- `backend`: a message confirming the intended connection.

The endpoint provides simple data for React to request.

## Step 3: Test the new endpoint directly

We opened:

http://127.0.0.1:8000/api/message

Expected JSON response:

{
    "message": "Welcome to FarmPay AI!",
    "description": "Smarter Farming. Better Selling. Simpler Payments.",
    "backend": "FastAPI connected successfully"
}

This tests the backend endpoint independently of the frontend.

If the JSON appears, the endpoint is returning the expected data.

---

# 8. WRITE THE REACT FRONTEND INTEGRATION

File:

`frontend/src/App.jsx`

We replaced the default Vite starter component with the following code:

import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/message")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then(setData)
      .catch(() => {
        setError("Could not connect to the backend. Please check FastAPI.");
      });
  }, []);

  return (
    <main style={{
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "60px 20px",
      background: "#f0fdf4",
      minHeight: "100vh",
      boxSizing: "border-box"
    }}>
      <h1 style={{ color: "#166534" }}>🌱 FarmPay AI</h1>

      {data ? (
        <>
          <h2>{data.message}</h2>
          <p>{data.description}</p>
          <p style={{ color: "#166534" }}>{data.backend}</p>
        </>
      ) : (
        <p>{error || "Connecting to FarmPay AI backend..."}</p>
      )}
    </main>
  );
}

export default App;

## Explanation of the React code

### 1. Import React hooks

import { useEffect, useState } from "react";

`useState` stores information that changes over time.

`useEffect` runs a side effect, such as fetching data from a backend, after the component renders.

### 2. Store the backend response

const [data, setData] = useState(null);

- `data` holds the response received from FastAPI.
- `setData` updates that response.
- The initial value is `null` because the request has not completed yet.

### 3. Store an error message

const [error, setError] = useState("");

`error` stores a message if the request fails.

This allows the page to display a useful error instead of remaining indefinitely on the loading message.

### 4. Request data from FastAPI

fetch("http://127.0.0.1:8000/api/message")

`fetch()` sends an HTTP request from the browser to the backend.

Because no method is specified, this request uses GET by default.

### 5. Check the HTTP response

if (!response.ok) {
  throw new Error("Backend request failed");
}

This checks whether the HTTP response indicates success.

An HTTP error response does not necessarily cause `fetch()` to reject automatically, so we explicitly check `response.ok`.

### 6. Convert JSON to JavaScript data

return response.json();

The backend returns JSON. This line parses the response body into a JavaScript object.

### 7. Save the received data

.then(setData)

This updates React state with the parsed response.

React then re-renders the component to display the new information.

### 8. Handle request errors

.catch(() => {
  setError("Could not connect to the backend. Please check FastAPI.");
});

If the network request or response processing fails, React displays the error message.

### 9. Run the request once when the component mounts

useEffect(() => {
  fetch("http://127.0.0.1:8000/api/message")
    // response processing
}, []);

The empty dependency array `[]` tells React to run this effect when the component mounts.

Development tools may execute effects more than once in certain development configurations, so it should not be treated as a guaranteed exactly-once request in every development setup.

### 10. Display the information

The JSX displays:

- FarmPay AI heading.
- Welcome message from FastAPI.
- Tagline from FastAPI.
- Backend connection message.

The conditional expression:

`data ? (...) : (...)`

shows the received data when available; otherwise, it shows the loading message or the error message.

### 11. Export the component

export default App;

This allows the React entry point to import and render the component.

## Why did we use inline styles?

We used inline CSS for the initial connection test to keep the implementation simple.

We have not installed or configured Tailwind CSS yet. Styling will be improved when we build the actual farmer dashboard.

---

# 9. HOW THE COMPLETE CONNECTION WORKS

The integration follows this sequence:

1. A farmer opens the React website.
2. Vite serves the frontend from port 5173.
3. React renders the App component.
4. `useEffect` initiates a GET request to the FastAPI endpoint.
5. The browser sends the request to port 8000.
6. FastAPI receives the request at `/api/message`.
7. The `get_message()` function returns a Python dictionary.
8. FastAPI serializes the dictionary into JSON.
9. FastAPI returns the HTTP response.
10. The browser checks the response and parses the JSON.
11. React stores the parsed data using `setData`.
12. React re-renders the page and displays the welcome message, tagline and backend status.

Simplified architecture:

Browser
    |
    v
React + Vite
http://localhost:5173
    |
    | HTTP GET /api/message
    v
FastAPI + Uvicorn
http://127.0.0.1:8000
    |
    v
Python endpoint
get_message()
    |
    v
JSON response
    |
    v
React updates the page

This is a basic frontend-to-backend integration using HTTP and JSON.

We have not created a production API, database connection or AI-agent workflow yet.

---

# 10. HOW TO RUN THE PROJECT AGAIN AFTER SIX MONTHS

When returning to the project, follow these steps.

## Terminal 1: Start the frontend

Open PowerShell and run:

cd C:\Users\DELL-PC\FarmPay-AI\frontend

npm install

npm run dev

Open the local URL printed by Vite, normally:

http://localhost:5173/

Run `npm install` when setting up the project on a new machine or when dependencies need to be restored. It is not necessary to repeat it every time if dependencies are already installed and unchanged.

## Terminal 2: Start the backend

Open a second PowerShell terminal and run:

cd C:\Users\DELL-PC\FarmPay-AI\backend

Activate the existing virtual environment:

.\.venv\Scripts\Activate.ps1

Start the backend:

python -m uvicorn app.main:app --reload

Useful URLs:

Frontend:
http://localhost:5173/

Backend root:
http://127.0.0.1:8000/

Health endpoint:
http://127.0.0.1:8000/health

Message endpoint:
http://127.0.0.1:8000/api/message

API documentation:
http://127.0.0.1:8000/docs

If the virtual environment does not exist on a new machine, create it and reinstall the backend dependencies:

python -m venv .venv

.\.venv\Scripts\Activate.ps1

python -m pip install --upgrade pip

python -m pip install "fastapi[standard]"

For a more reproducible setup, we should create and maintain a backend `requirements.txt` file before the project grows further. We have not created that file yet.

---

# 11. COMMAND REFERENCE

## Check software versions

python --version

node --version

npm --version

git --version

## Navigate to the project

cd C:\Users\DELL-PC\FarmPay-AI

## Run the frontend

cd C:\Users\DELL-PC\FarmPay-AI\frontend

npm install

npm run dev

## Run the backend

cd C:\Users\DELL-PC\FarmPay-AI\backend

.\.venv\Scripts\Activate.ps1

python -m uvicorn app.main:app --reload

## Git workflow

git status

git add .

git commit -m "feat: describe the change"

git push origin main

Before pushing, always review the files that will be committed. Never commit `.env` files, API keys, payment credentials or other secrets.

---

# 12. WHAT WE HAVE COMPLETED

DAY 1:

- Checked Python, Node.js, npm and Git.
- Switched Node.js from v25.2.1 to v24.22.1 LTS.
- Created the FarmPay-AI project structure.
- Opened the project in Visual Studio Code.
- Configured `.gitignore`.
- Prepared the README and repository documentation.
- Created an initial Git commit.
- Integrated remote GitHub changes using rebase.
- Pushed project changes to GitHub.

DAY 2:

- Created the React application using Vite.
- Installed frontend dependencies using npm.
- Ran the React development server.
- Created a Python virtual environment.
- Installed FastAPI and its standard extras, including Uvicorn.
- Created `backend/app/main.py`.
- Implemented the root and health endpoints.
- Ran the backend using Uvicorn.
- Added the `/api/message` endpoint.
- Configured CORS for the local React origins.
- Updated `frontend/src/App.jsx`.
- Fetched JSON data from FastAPI using `fetch()`.
- Displayed the backend response on the React page.
- Tested the application in the browser.

The user confirmed that the frontend and backend integration worked.

---

# 13. WHAT HAS NOT BEEN IMPLEMENTED YET

The following tasks remain for later development sessions:

1. Tailwind CSS installation and responsive farmer dashboard.
2. Farmer crop-entry form.
3. Language selection and voice input.
4. MySQL installation/configuration and database schema.
5. Buyer-offer sample dataset.
6. Net-proceeds calculation logic.
7. Unit tests for calculations and backend endpoints.
8. LLM integration and structured request extraction.
9. Controlled AI-agent tool calling.
10. Frontend integration with the crop-offer API.
11. Order creation and farmer confirmation.
12. PayPal Sandbox configuration.
13. Server-side payment capture and verification.
14. Order status and receipts.
15. Security improvements, validation and error handling.
16. Deployment, README updates and demo preparation.
17. Final hackathon submission.

These are planned tasks; they should only be marked complete after they have been implemented and tested.

---

# 14. IMPORTANT LESSONS LEARNED

- React handles the browser interface; FastAPI handles backend requests.
- Vite is the frontend development server, while Uvicorn runs the FastAPI application.
- npm installs JavaScript dependencies; pip installs Python packages.
- A virtual environment isolates Python dependencies.
- HTTP GET requests allow the frontend to retrieve backend data.
- JSON provides a convenient data format for communication between React and FastAPI.
- CORS must permit the intended frontend origin when browser requests cross origins.
- Git commits save local snapshots; Git push sends commits to GitHub.
- `.gitignore` helps prevent local dependencies and sensitive files from being committed.
- A working connection between React and FastAPI is only the foundation; the business logic and real product workflows still need to be built.
- Payment success must ultimately be determined by verified backend payment-provider responses, not by a frontend message alone.

---

# END OF DAY 1 AND DAY 2 DEVELOPMENT LOG

Current milestone:

React frontend running + FastAPI backend running + successful HTTP/JSON communication.

Next milestone:

Build the real FarmPay AI farmer interface, then incrementally add the backend functionality behind it.

Last updated: 23 October 2026