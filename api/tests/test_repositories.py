from datetime import datetime, timedelta, timezone

import pytest
from sqlmodel import Session

from app.models import TelemetryData
from app.repositories import telemetry_data_repository


def build_telemetry(device_id: str, timestamp: datetime) -> TelemetryData:
    return TelemetryData(
        version=1,
        device_id=device_id,
        timestamp=timestamp,
        online=True,
        uptime_sec=100,
        temperature_c=20.0,
        ph=7.0,
        do_mg_per_l=8.0,
        turbidity_sensor_v=0.5,
        turbidity_index=0.3,
        avg_color_hex="#ffffff",
    )


def test_add_telemetry_requires_existing_device(session: Session):
    telemetry = build_telemetry("missing-device", datetime.now(timezone.utc))

    with pytest.raises(ValueError):
        telemetry_data_repository.add(session, telemetry)


def test_get_period_defaults_end_and_orders_results(session: Session, seeded_device):
    now = datetime(2024, 5, 1, tzinfo=timezone.utc)
    older = build_telemetry(seeded_device.id, now - timedelta(hours=2))
    newer = build_telemetry(seeded_device.id, now - timedelta(hours=1))

    telemetry_data_repository.add(session, older)
    telemetry_data_repository.add(session, newer)

    results = telemetry_data_repository.get_period_by_device_id(
        session, seeded_device.id, start=now - timedelta(days=1), end=None
    )

    assert [entry.id for entry in results] == [older.id, newer.id]
    assert results[-1].timestamp == newer.timestamp
