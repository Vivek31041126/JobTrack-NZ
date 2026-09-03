import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Ensure the backend directory is importable when pytest runs from the repo root.
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Use an isolated SQLite database for automated tests.
TEST_DB = BACKEND_DIR / "jobtrack_test.db"
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB.as_posix()}"
os.environ["SECRET_KEY"] = "jobtrack-ci-test-secret-key"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "60"

from app.database import Base, engine
from app.main import app


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_database():
    yield
    if TEST_DB.exists():
        TEST_DB.unlink()
