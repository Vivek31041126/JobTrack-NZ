def register_user(client, email="vivek@example.com", full_name="Vivek Tollawala"):
    response = client.post(
        "/auth/register",
        json={
            "full_name": full_name,
            "email": email,
            "password": "StrongPass123",
        },
    )
    assert response.status_code == 201
    return response.json()


def login_user(client, email="vivek@example.com"):
    response = client.post(
        "/auth/token",
        data={
            "username": email,
            "password": "StrongPass123",
        },
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_register_login_and_current_user(client):
    user = register_user(client)
    headers = login_user(client)

    response = client.get("/auth/me", headers=headers)

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == user["id"]
    assert body["full_name"] == "Vivek Tollawala"
    assert body["email"] == "vivek@example.com"


def test_duplicate_registration_is_rejected(client):
    register_user(client)

    response = client.post(
        "/auth/register",
        json={
            "full_name": "Another Vivek",
            "email": "vivek@example.com",
            "password": "StrongPass123",
        },
    )

    assert response.status_code == 409


def test_protected_endpoint_requires_token(client):
    response = client.get("/applications")
    assert response.status_code == 401


def test_application_crud_and_analytics(client):
    register_user(client)
    headers = login_user(client)

    create_response = client.post(
        "/applications",
        headers=headers,
        json={
            "company": "Xero",
            "role": "Graduate Software Developer",
            "location": "Auckland, New Zealand",
            "status": "Applied",
            "source": "LinkedIn",
            "applied_date": "2026-09-03",
            "contact_name": None,
            "contact_email": None,
            "job_url": "https://example.com/job",
            "notes": "Portfolio integration test",
        },
    )

    assert create_response.status_code == 201
    application = create_response.json()
    application_id = application["id"]

    list_response = client.get("/applications", headers=headers)
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
    assert list_response.json()[0]["company"] == "Xero"

    update_response = client.patch(
        f"/applications/{application_id}",
        headers=headers,
        json={"status": "Interview"},
    )

    assert update_response.status_code == 200
    assert update_response.json()["status"] == "Interview"

    analytics_response = client.get("/analytics", headers=headers)
    assert analytics_response.status_code == 200

    analytics = analytics_response.json()
    assert analytics["total"] == 1
    assert analytics["interview"] == 1
    assert analytics["interview_rate"] == 100.0

    delete_response = client.delete(
        f"/applications/{application_id}",
        headers=headers,
    )
    assert delete_response.status_code == 204

    final_list = client.get("/applications", headers=headers)
    assert final_list.json() == []


def test_users_cannot_see_each_others_applications(client):
    register_user(client, "user1@example.com", "User One")
    user1_headers = login_user(client, "user1@example.com")

    client.post(
        "/applications",
        headers=user1_headers,
        json={
            "company": "Datacom",
            "role": "Junior Data Analyst",
            "location": "Auckland",
            "status": "Applied",
            "source": "SEEK",
            "applied_date": "2026-09-03",
            "notes": "Only User One should see this",
        },
    )

    register_user(client, "user2@example.com", "User Two")
    user2_headers = login_user(client, "user2@example.com")

    response = client.get("/applications", headers=user2_headers)

    assert response.status_code == 200
    assert response.json() == []


def test_recruiter_contact_crud(client):
    register_user(client)
    headers = login_user(client)

    create_response = client.post(
        "/contacts",
        headers=headers,
        json={
            "name": "Kaylee",
            "company": "Consult Recruitment",
            "email": "kaylee@example.com",
            "phone": "0210000000",
            "linkedin_url": "https://linkedin.com",
            "relationship_stage": "CV Sent",
            "next_follow_up": "2026-09-10",
            "notes": "Discussed graduate technology roles.",
        },
    )

    assert create_response.status_code == 201
    contact_id = create_response.json()["id"]

    list_response = client.get("/contacts", headers=headers)
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
    assert list_response.json()[0]["company"] == "Consult Recruitment"

    update_response = client.patch(
        f"/contacts/{contact_id}",
        headers=headers,
        json={"relationship_stage": "Following Up"},
    )

    assert update_response.status_code == 200
    assert update_response.json()["relationship_stage"] == "Following Up"

    delete_response = client.delete(
        f"/contacts/{contact_id}",
        headers=headers,
    )
    assert delete_response.status_code == 204

    final_list = client.get("/contacts", headers=headers)
    assert final_list.json() == []
