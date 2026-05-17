from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends
from jose import jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User
from app.schemas import OAuthLogin, TokenResponse

router = APIRouter()


def create_access_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=settings.access_token_expire_days)
    payload = {**data, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


@router.post("/oauth", response_model=TokenResponse)
def oauth_login(body: OAuthLogin, db: Session = Depends(get_db)) -> TokenResponse:
    user = (
        db.query(User)
        .filter(User.provider == body.provider, User.provider_id == body.provider_id)
        .first()
    )
    if user is None:
        user = User(
            provider=body.provider,
            provider_id=body.provider_id,
            email=body.email,
            name=body.name,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update optional fields if provided
        if body.email is not None:
            user.email = body.email
        if body.name is not None:
            user.name = body.name
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user_id=user.id)


@router.post("/anonymous", response_model=TokenResponse)
def anonymous_login(db: Session = Depends(get_db)) -> TokenResponse:
    user = User(
        provider="anonymous",
        provider_id=str(uuid4()),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user_id=user.id)
