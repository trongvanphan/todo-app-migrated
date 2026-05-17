import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.firebase import init_firebase
from app.core.auth import get_current_user, User
from app.db import Base, engine
from app.domains.tasks.router import router as tasks_router


def create_app() -> FastAPI:
    init_firebase()
    Base.metadata.create_all(bind=engine)

    app = FastAPI(title="todo-app-migrated", version="0.1.0")

    origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    @app.get("/api/me", response_model=User)
    def me(user: User = Depends(get_current_user)):
        return user

    app.include_router(tasks_router, prefix="/api")
    return app


app = create_app()
