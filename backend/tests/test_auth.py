def test_anonymous_signin_returns_token(client):
    response = client.post("/auth/anonymous")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "user_id" in data


def test_anonymous_token_is_valid_jwt(client):
    """VF-10: Verify the anonymous JWT is decodable with correct sub and future expiry."""
    from datetime import datetime, timezone
    from jose import jwt
    from app.config import settings

    data = client.post("/auth/anonymous").json()
    payload = jwt.decode(data["access_token"], settings.secret_key, algorithms=[settings.algorithm])
    assert payload["sub"] == str(data["user_id"])
    assert payload["exp"] > datetime.now(timezone.utc).timestamp()


def test_expired_jwt_returns_401(client):
    """VF-2: Verify that an expired JWT is rejected with 401."""
    from datetime import datetime, timedelta, timezone
    from jose import jwt
    from app.config import settings

    expired_token = jwt.encode(
        {"sub": "999", "exp": datetime.now(timezone.utc) - timedelta(days=1)},
        settings.secret_key,
        algorithm=settings.algorithm,
    )
    response = client.get("/tasks", headers={"Authorization": f"Bearer {expired_token}"})
    assert response.status_code == 401


def test_anonymous_signin_creates_unique_users(client):
    r1 = client.post("/auth/anonymous")
    r2 = client.post("/auth/anonymous")
    assert r1.json()["user_id"] != r2.json()["user_id"]


def test_oauth_signin_upsert_idempotent(client):
    payload = {"provider": "google", "provider_id": "uid-123", "email": "a@b.com", "name": "A"}
    r1 = client.post("/auth/oauth", json=payload)
    r2 = client.post("/auth/oauth", json=payload)
    assert r1.status_code == 200
    assert r2.status_code == 200
    assert r1.json()["user_id"] == r2.json()["user_id"]


def test_invalid_token_returns_401(client):
    response = client.get("/tasks", headers={"Authorization": "Bearer invalid.token.here"})
    assert response.status_code == 401


def test_missing_auth_returns_403(client):
    response = client.get("/tasks")
    assert response.status_code in (401, 403)
