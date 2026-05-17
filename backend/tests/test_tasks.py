import os
os.environ["DATABASE_URL"] = "sqlite:///./test_todo.db"

import pytest
from fastapi.testclient import TestClient
from app.core.auth import get_current_user, User
from app.db import Base, engine


@pytest.fixture(autouse=True)
def _fresh_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setattr("app.core.firebase.init_firebase", lambda: None)
    from app.main import create_app
    app = create_app()
    app.dependency_overrides[get_current_user] = lambda: User(uid="u1", email="u1@x.com")
    return TestClient(app)


def test_list_empty(client):
    r = client.get("/api/tasks")
    assert r.status_code == 200
    assert r.json() == []


def test_create_and_list(client):
    r = client.post("/api/tasks", json={"title": "buy milk"})
    assert r.status_code == 201
    task = r.json()
    assert task["title"] == "buy milk"
    assert task["completed"] is False
    r = client.get("/api/tasks")
    assert len(r.json()) == 1


def test_filter_active_completed(client):
    a = client.post("/api/tasks", json={"title": "a"}).json()
    b = client.post("/api/tasks", json={"title": "b"}).json()
    client.patch(f"/api/tasks/{a['id']}", json={"completed": True})
    active = client.get("/api/tasks?filter=active").json()
    done = client.get("/api/tasks?filter=completed").json()
    assert {t["id"] for t in active} == {b["id"]}
    assert {t["id"] for t in done} == {a["id"]}


def test_update_404(client):
    r = client.patch("/api/tasks/nope", json={"completed": True})
    assert r.status_code == 404


def test_delete(client):
    t = client.post("/api/tasks", json={"title": "x"}).json()
    r = client.delete(f"/api/tasks/{t['id']}")
    assert r.status_code == 204
    assert client.get("/api/tasks").json() == []


def test_user_isolation(client):
    t = client.post("/api/tasks", json={"title": "secret"}).json()
    from app.main import create_app
    app2 = create_app()
    app2.dependency_overrides[get_current_user] = lambda: User(uid="u2")
    c2 = TestClient(app2)
    assert c2.get("/api/tasks").json() == []
    assert c2.delete(f"/api/tasks/{t['id']}").status_code == 404


def test_missing_auth_returns_401():
    from app.main import create_app
    app = create_app()
    # No dependency override → real get_current_user runs; HTTPBearer sees no header.
    c = TestClient(app)
    r = c.get("/api/tasks")
    assert r.status_code == 401
    assert r.headers.get("www-authenticate", "").lower().startswith("bearer")
