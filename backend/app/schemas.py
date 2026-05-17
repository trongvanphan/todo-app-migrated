from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


# --- Auth schemas ---

class OAuthLogin(BaseModel):
    provider: str
    provider_id: str
    email: str | None = None
    name: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    user_id: int
    token_type: str = "bearer"


# --- Task schemas ---

class TaskCreate(BaseModel):
    title: str

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("title must not be empty")
        return v


class TaskUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None


class TaskOut(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
