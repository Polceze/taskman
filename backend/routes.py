from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from schemas import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
import crud

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task with the provided details."""
    task = crud.create_task(db, task_data)
    return task


@router.get(
    "",
    response_model=TaskListResponse,
    summary="List all tasks",
)
def list_tasks(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Maximum records to return"),
    db: Session = Depends(get_db),
):
    """Retrieve all tasks, ordered by creation date (newest first)."""
    tasks, total = crud.get_tasks(db, skip=skip, limit=limit)
    return TaskListResponse(tasks=tasks, total=total)


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Get a single task",
)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Retrieve a single task by its ID."""
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    return task


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update a task",
)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    """Update one or more fields of an existing task."""
    task = crud.update_task(db, task_id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    return task


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Permanently delete a task by its ID."""
    deleted = crud.delete_task(db, task_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
