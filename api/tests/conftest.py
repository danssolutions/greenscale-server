import os
import sys
from typing import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool

# Ensure the application package is importable when running tests from repository root
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

# Provide placeholder environment variables so production engine configuration does not fail at import time
os.environ.setdefault("POSTGRES_USER", "test")
os.environ.setdefault("POSTGRES_PASSWORD", "test")
os.environ.setdefault("POSTGRES_HOST", "localhost")
os.environ.setdefault("POSTGRES_PORT", "5432")
os.environ.setdefault("POSTGRES_DB", "testdb")

from app.db import get_session  # noqa: E402
from app.models import Device, Farm  # noqa: E402
import main  # noqa: E402


@pytest.fixture()
def engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture()
def session(engine) -> Iterator[Session]:
    with Session(engine) as session:
        yield session


@pytest.fixture()
def app_client(engine, monkeypatch) -> Iterator[TestClient]:
    def override_get_session():
        with Session(engine) as session:
            yield session

    monkeypatch.setattr(main, "start_mqtt_listener", lambda: None)
    main.app.dependency_overrides[get_session] = override_get_session

    client = TestClient(main.app)
    with client:
        yield client

    main.app.dependency_overrides.clear()


@pytest.fixture()
def seeded_device(session):
    farm = Farm(
        name="Test Farm",
        temperature_min=18.0,
        temperature_max=24.0,
        ph_min=6.5,
        ph_max=7.5,
        do_min=5.0,
        do_max=9.0,
        turbidity_min=0.1,
        turbidity_max=1.0,
    )
    session.add(farm)
    session.commit()
    session.refresh(farm)

    device = Device(id="device-1", farm_id=farm.id)
    session.add(device)
    session.commit()
    session.refresh(device)
    return device
