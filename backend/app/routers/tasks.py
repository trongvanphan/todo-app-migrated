from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Task, User
from app.schemas import TaskCreate, TaskOut, TaskUpdate

router = APIRouter()


@router.get("", response_model=list[TaskOut])
def list_tasks(
    completed: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Task]:
    query = db.query(Task).filter(Task.user_id == current_user.id)
    if completed is not None:
        query = query.filter(Task.completed == (completed.lower() == "true"))
    return query.order_by(Task.created_at).all()


@router.post("", response_model=TaskOut, status_code=201)
def create_task(
    body: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Task:
    task = Task(user_id=current_user.id, title=body.title)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    body: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Task:
    # Single query combines existence + ownership — returns 404 for both
    # "not found" and "not owned" to prevent task ID enumeration [VF-5]
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if body.title is not None:
        task.title = body.title
    if body.completed is not None:
        task.completed = body.completed
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    db.delete(task)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
