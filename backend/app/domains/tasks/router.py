from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.auth import get_current_user, User
from app.db import get_db
from . import repo
from .schemas import TaskCreate, TaskUpdate, TaskOut


router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskOut])
def list_tasks(
    filter: Literal["all", "active", "completed"] = "all",
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return repo.list_for_user(db, user.uid, filter)


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    body: TaskCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return repo.create(db, user.uid, body.title)


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: str,
    body: TaskUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = repo.update(db, user.uid, task_id, body)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not repo.delete(db, user.uid, task_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
