from typing import Literal, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from .models import Task
from .schemas import TaskUpdate


Filter = Literal["all", "active", "completed"]


def list_for_user(db: Session, uid: str, filter: Filter = "all") -> list[Task]:
    stmt = select(Task).where(Task.uid == uid)
    if filter == "active":
        stmt = stmt.where(Task.completed.is_(False))
    elif filter == "completed":
        stmt = stmt.where(Task.completed.is_(True))
    stmt = stmt.order_by(Task.created_at.asc())
    return list(db.scalars(stmt))


def create(db: Session, uid: str, title: str) -> Task:
    task = Task(uid=uid, title=title)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get(db: Session, uid: str, task_id: str) -> Optional[Task]:
    return db.scalar(select(Task).where(Task.id == task_id, Task.uid == uid))


def update(db: Session, uid: str, task_id: str, patch: TaskUpdate) -> Optional[Task]:
    task = get(db, uid, task_id)
    if task is None:
        return None
    data = patch.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(task, k, v)
    db.commit()
    db.refresh(task)
    return task


def delete(db: Session, uid: str, task_id: str) -> bool:
    task = get(db, uid, task_id)
    if task is None:
        return False
    db.delete(task)
    db.commit()
    return True
