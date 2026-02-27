# TaskMan — Task Management System

A full-stack task management web application built as a practical assignment for the CHQI Software Developer position. Demonstrates clean architecture, production-grade patterns, and a polished user experience.

---

## Tech Stack

| Layer     | Technology                          | Why                                              |
|-----------|-------------------------------------|--------------------------------------------------|
| Backend   | **FastAPI** (Python 3.12)           | Modern async framework, auto-generates Swagger docs, excellent DX |
| ORM       | **SQLAlchemy 2** + **Alembic**      | Robust ORM with proper migration management      |
| Database  | **PostgreSQL 16**                   | Production-grade relational DB                   |
| Frontend  | **React 18** + **Vite** + **TypeScript** | Fast, type-safe, matches job spec             |
| Styling   | **Tailwind CSS v3**                 | Utility-first, clean minimal design              |
| Container | **Docker** + **Docker Compose**     | One-command setup, production-ready              |

---

## Project Structure

```
taskman/
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── config.py         # Settings via pydantic-settings
│   ├── database.py       # SQLAlchemy engine & session
│   ├── models.py         # Task ORM model
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── crud.py           # Database operations layer
│   ├── routes.py         # API route handlers
│   ├── migrations/       # Alembic migrations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios API client
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks (useTasks)
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Root component
│   │   └── main.tsx      # Entry point
│   ├── nginx.conf        # Production nginx config
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Running with Docker (Recommended)

**Prerequisites:** Docker Desktop installed and running.

```bash
# 1. Clone / navigate into the project
cd taskman

# 2. Start all services (DB + backend + frontend)
docker compose up --build

# 3. Open your browser
#    Frontend:  http://localhost
#    API docs:  http://localhost:8000/docs   ← interactive Swagger UI
```

> First run pulls images and builds containers (~2 minutes). Subsequent starts are fast.

To stop: `docker compose down`  
To reset the database: `docker compose down -v`

---

## Running Locally (Without Docker)

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL running locally (or use the Docker DB only: `docker compose up db`)

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL to your local PostgreSQL connection string

# Run migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload --port 8000
```

API is now available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server (proxies /api → localhost:8000)
npm run dev
```

Frontend is now available at `http://localhost:3000`

---

## API Endpoints

| Method   | Endpoint            | Description          |
|----------|---------------------|----------------------|
| `POST`   | `/api/tasks`        | Create a task        |
| `GET`    | `/api/tasks`        | List all tasks       |
| `GET`    | `/api/tasks/{id}`   | Get a single task    |
| `PUT`    | `/api/tasks/{id}`   | Update a task        |
| `DELETE` | `/api/tasks/{id}`   | Delete a task        |
| `GET`    | `/health`           | Health check         |

### Task Status Values
- `pending` — not yet started
- `in_progress` — actively being worked on
- `completed` — done

### Example: Create a Task
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review patient dashboard",
    "description": "Check data accuracy on the analytics module",
    "status": "in_progress",
    "due_date": "2025-06-30T00:00:00Z"
  }'
```

---

## Database Schema

```sql
CREATE TABLE tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(50)  NOT NULL DEFAULT 'pending',
    create_date TIMESTAMPTZ  NOT NULL DEFAULT now(),
    due_date    TIMESTAMPTZ
);

-- Indexes for efficient filtering
CREATE INDEX ix_tasks_status   ON tasks(status);
CREATE INDEX ix_tasks_due_date ON tasks(due_date);
```

Migrations are managed with **Alembic**. To create a new migration after model changes:
```bash
alembic revision --autogenerate -m "describe your change"
alembic upgrade head
```

---

## Design Decisions

- **Layered architecture** — routes → crud → models, keeping concerns separated and testable
- **Pydantic validation** — all input validated at the schema layer before touching the DB
- **Partial updates** — `PUT` uses `exclude_unset=True` so only provided fields are updated
- **Error handling** — 404s, validation errors, and unexpected exceptions all return structured JSON
- **CORS** — configured via environment variable, not hardcoded
- **Docker health checks** — backend waits for PostgreSQL to be ready before starting

---




