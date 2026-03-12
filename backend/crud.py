from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from models import Task, User
from schemas import TaskCreate, TaskUpdate, UserRegister
from auth import hash_password


# ----------- User CRUD ------------------

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Look up a user by email address."""
    return db.query(User).filter(User.email == email.lower()).first()


def create_user(db: Session, data: UserRegister) -> User:
    """Create a new user with a hashed password."""
    user = User(
        email=data.email.lower(),
        full_name=data.full_name,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# --------------- Task CRUD (all tasks are owned by the user) ----------------------------

def get_task(db: Session, task_id: int, user_id: int) -> Optional[Task]:
    """Fetch a single task by ID, only if it belongs to the given user."""
    return (
        db.query(Task)
        .filter(Task.id == task_id, Task.user_id == user_id)
        .first()
    )


def get_tasks(
    db: Session, user_id: int, skip: int = 0, limit: int = 100
) -> tuple[list[Task], int]:
    """Fetch all tasks for a specific user, newest first."""
    query = (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .order_by(desc(Task.create_date))
    )
    total = query.count()
    tasks = query.offset(skip).limit(limit).all()
    return tasks, total


def create_task(db: Session, task_data: TaskCreate, user_id: int) -> Task:
    """Create a new task assigned to the given user."""
    task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status.value,
        due_date=task_data.due_date,
        user_id=user_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(
    db: Session, task_id: int, task_data: TaskUpdate, user_id: int
) -> Optional[Task]:
    """Update a task. Returns None if not found or not owned by user."""
    task = get_task(db, task_id, user_id)
    if not task:
        return None

    update_fields = task_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        if hasattr(value, "value"):
            value = value.value
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: int, user_id: int) -> bool:
    """Delete a task. Returns False if not found or not owned by user."""
    task = get_task(db, task_id, user_id)
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True