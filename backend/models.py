from sqlalchemy import Column, Integer, String, Text, DateTime, Index
from sqlalchemy.sql import func
from database import Base


class Task(Base):
    """Task model representing a single task in the system."""

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="pending")
    create_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)

    # Index on status for fast filtering by status
    __table_args__ = (
        Index("ix_tasks_status", "status"),
        Index("ix_tasks_due_date", "due_date"),
    )

    def __repr__(self):
        return f"<Task id={self.id} title='{self.title}' status='{self.status}'>"
