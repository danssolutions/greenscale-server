from datetime import datetime, timedelta, timezone

from sqlmodel import Session

from app.repositories import telemetry_data_repository
from app.models import Farm, TelemetryData


def test_get_latest_telemetry_data_returns_newest_entry(app_client, engine):
    with Session(engine) as session:
        farm = Farm(
            name="Integration Farm",
            temperature_min=10.0,
            temperature_max=30.0,
            ph_min=6.0,
            ph_max=8.0,
            do_min=4.0,
            do_max=10.0,
            turbidity_min=0.0,
            turbidity_max=1.0,
        )
        session.add(farm)
        session.commit()
        session.refresh(farm)

        device = {"id": "device-99", "farm_id": farm.id}
        app_client.post("/api/devices", json=device)

        older = TelemetryData(
            version=1,
            device_id=device["id"],
            timestamp=datetime.now(timezone.utc) - timedelta(minutes=10),
            online=True,
            uptime_sec=50,
            temperature_c=19.5,
            ph=7.0,
            do_mg_per_l=8.0,
            turbidity_sensor_v=0.5,
            turbidity_index=0.2,
            avg_color_hex="#111111",
        )
        newer = TelemetryData(
            version=1,
            device_id=device["id"],
            timestamp=datetime.now(timezone.utc),
            online=True,
            uptime_sec=80,
            temperature_c=20.5,
            ph=7.1,
            do_mg_per_l=8.1,
            turbidity_sensor_v=0.6,
            turbidity_index=0.3,
            avg_color_hex="#222222",
        )
        telemetry_data_repository.add(session, older)
        telemetry_data_repository.add(session, newer)

    response = app_client.get(f"/api/telemetry-data/{device['id']}/latest")

    assert response.status_code == 200
    body = response.json()
    assert body["turbidity_index"] == newer.turbidity_index
    assert body["uptime_sec"] == newer.uptime_sec


def test_get_farm_returns_404_when_missing(app_client):
    response = app_client.get("/api/farms/999")

    assert response.status_code == 404
