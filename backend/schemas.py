from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import datetime
from typing import Optional
from enum import Enum


# --------- Auth schemas --------------

class UserRegister(BaseModel):
    """Schema for registering a new user."""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)
    password: str = Field(..., min_length=8, description="Minimum 8 characters")

    @field_validator("full_name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Full name must not be blank")
        return v.strip()


class UserLogin(BaseModel):
    """Schema for logging in."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Public user data returned by the API — never includes password."""
    id: int
    email: str
    full_name: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    """JWT token returned after successful login or registration."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --------------- Task schemas --------------------------------

class TaskStatus(str, Enum):
    """Allowed task status values."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TaskBase(BaseModel):
    """Shared fields between create and update schemas."""
    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(None, description="Optional task description")
    status: TaskStatus = Field(TaskStatus.PENDING, description="Current task status")
    due_date: Optional[datetime] = Field(None, description="Optional due date (ISO 8601)")

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title must not be blank or whitespace only")
        return v.strip()


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    pass


class TaskUpdate(BaseModel):
    """Schema for updating a task — all fields optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Title must not be blank or whitespace only")
        return v.strip() if v else v


class TaskResponse(TaskBase):
    """Schema for returning a task from the API."""
    id: int
    create_date: datetime

    model_config = {"from_attributes": True}


class TaskListResponse(BaseModel):
    """Schema for returning a list of tasks."""
    tasks: list[TaskResponse]
    total: int