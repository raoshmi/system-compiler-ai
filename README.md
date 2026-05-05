# AppForge AI - Software Compiler

A system that converts natural language instructions into a structured, validated, and executable application configuration.

## Architecture
- **Backend**: FastAPI (Python)
- **Frontend**: Next.js 15 (React)
- **Engine**: Google Gemini 1.5
- **Pipeline**: Intent -> Architect -> Schema -> Validator & Repair

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API Key (Set as `GEMINI_API_KEY` environment variable)

### Installation
1. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the System
Run the `start.bat` file in the root directory or start manually:
- Backend: `python backend/main.py`
- Frontend: `npm run dev` (in `frontend` folder)

## Live Demo
- **Frontend**: [https://system-compiler-ai-1rqk.vercel.app](https://system-compiler-ai-1rqk.vercel.app)
- **Backend**: [https://system-compiler-ai.onrender.com](https://system-compiler-ai.onrender.com)

## Features
- **Multi-Stage Pipeline**: Modular separation of intent, architecture, and schema.
- **Surgical Repair Engine**: Detects cross-layer inconsistencies and repairs ONLY the broken sections using LLM-powered surgical patching.
- **Fail-Safe Mock Mode**: Production resilience layer that ensures the system always returns a valid schema during high-traffic or API downtime.
- **Real-Time Visualization**: Frontend dashboard built with Next.js 15, Framer Motion, and Glassmorphism design.
- **Persistent Logging**: Every validation error is logged to `backend/errors.log` for audit.
- **Evaluation Framework**: Includes a script to run 20 test cases and generate metrics (Latency, Repair Rate, Success).

## Evaluation
Run the evaluation suite:
```bash
python backend/evaluate.py
```

## Deployment
- **Backend**: Hosted on **Render** (via GitHub integration).
- **Frontend**: Hosted on **Vercel** (via GitHub integration).
