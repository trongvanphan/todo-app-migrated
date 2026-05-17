import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine_test = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def anon_token(client):
    response = client.post("/auth/anonymous")
    return response.json()["access_token"]


@pytest.fixture
def anon_token2(client):
    response = client.post("/auth/anonymous")
    return response.json()["access_token"]


@pytest.fixture
def auth_headers(anon_token):
    return {"Authorization": f"Bearer {anon_token}"}


@pytest.fixture
def auth_headers2(anon_token2):
    return {"Authorization": f"Bearer {anon_token2}"}
