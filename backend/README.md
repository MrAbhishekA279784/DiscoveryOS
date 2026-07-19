# DiscoveryOS Backend Core

Product Intelligence Platform FastAPI application service layer.

## Setup Requirements

- Python 3.11+
- Virtual Environment

## Installation

1. Create and source a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure Environment:
   ```bash
   cp .env.example .env
   # Edit .env variables
   ```

4. Database Setup:
   - Run DDL commands inside `migrations/001_initial_schema.sql` against your Supabase PostgreSQL instance.

5. Run local dev server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
