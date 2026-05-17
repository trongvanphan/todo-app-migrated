def test_create_task(client, auth_headers):
    response = client.post("/tasks", json={"title": "Buy milk"}, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy milk"
    assert data["completed"] is False


def test_create_task_empty_title_rejected(client, auth_headers):
    response = client.post("/tasks", json={"title": "   "}, headers=auth_headers)
    assert response.status_code == 422


def test_list_tasks_user_scoping(client, auth_headers, auth_headers2):
    client.post("/tasks", json={"title": "User A task"}, headers=auth_headers)
    response = client.get("/tasks", headers=auth_headers2)
    assert response.status_code == 200
    assert response.json() == []


def test_list_tasks_filter_completed(client, auth_headers):
    r1 = client.post("/tasks", json={"title": "Task 1"}, headers=auth_headers)
    task_id = r1.json()["id"]
    client.post("/tasks", json={"title": "Task 2"}, headers=auth_headers)
    client.patch(f"/tasks/{task_id}", json={"completed": True}, headers=auth_headers)

    active = client.get("/tasks?completed=false", headers=auth_headers)
    assert len(active.json()) == 1
    assert active.json()[0]["title"] == "Task 2"

    done = client.get("/tasks?completed=true", headers=auth_headers)
    assert len(done.json()) == 1
    assert done.json()[0]["title"] == "Task 1"


def test_update_task_ownership(client, auth_headers, auth_headers2):
    r = client.post("/tasks", json={"title": "Mine"}, headers=auth_headers)
    task_id = r.json()["id"]
    response = client.patch(f"/tasks/{task_id}", json={"title": "Stolen"}, headers=auth_headers2)
    assert response.status_code == 403


def test_delete_task_ownership(client, auth_headers, auth_headers2):
    r = client.post("/tasks", json={"title": "Mine"}, headers=auth_headers)
    task_id = r.json()["id"]
    response = client.delete(f"/tasks/{task_id}", headers=auth_headers2)
    assert response.status_code == 403


def test_delete_task(client, auth_headers):
    r = client.post("/tasks", json={"title": "Temporary"}, headers=auth_headers)
    task_id = r.json()["id"]
    delete_response = client.delete(f"/tasks/{task_id}", headers=auth_headers)
    assert delete_response.status_code == 204
    list_response = client.get("/tasks", headers=auth_headers)
    assert list_response.json() == []


def test_patch_task_title(client, auth_headers):
    r = client.post("/tasks", json={"title": "Old"}, headers=auth_headers)
    task_id = r.json()["id"]
    response = client.patch(f"/tasks/{task_id}", json={"title": "New"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "New"
