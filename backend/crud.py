from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from models import Task
from schemas import TaskCreate, TaskUpdate


def get_task(db: Session, task_id: int) -> Optional[Task]:
    """Fetch a single task by ID. Returns None if not found."""
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> tuple[list[Task], int]:
    """Fetch all tasks ordered by creation date (newest first)."""
    query = db.query(Task).order_by(desc(Task.create_date))
    total = query.count()
    tasks = query.offset(skip).limit(limit).all()
    return tasks, total


def create_task(db: Session, task_data: TaskCreate) -> Task:
    """Create a new task and persist to database."""
    task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status.value,
        due_date=task_data.due_date,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task_id: int, task_data: TaskUpdate) -> Optional[Task]:
    """Update an existing task. Returns None if not found."""
    task = get_task(db, task_id)
    if not task:
        return None

    # Only update fields that were explicitly provided
    update_fields = task_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        # Convert enum to its value for storage
        if hasattr(value, "value"):
            value = value.value
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: int) -> bool:
    """Delete a task by ID. Returns True if deleted, False if not found."""
    task = get_task(db, task_id)
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True
