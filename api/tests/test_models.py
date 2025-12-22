from datetime import datetime, timezone

from app.models import TelemetryData


def test_telemetry_data_from_json_parses_nested_payload():
    payload = {
        "version": 1,
        "device_id": "device-1",
        "timestamp": "2024-01-01T12:00:00Z",
        "status": {"online": True, "uptime_sec": 3600},
        "sensors": {
            "temperature_c": 21.5,
            "ph": 7.1,
            "do_mg_per_l": 8.3,
            "turbidity_sensor_v": 0.6,
        },
        "camera": {"turbidity_index": 0.4, "avg_color_hex": "#abcdef"},
    }

    telemetry = TelemetryData.from_json(payload)

    assert telemetry.device_id == payload["device_id"]
    assert telemetry.version == payload["version"]
    assert telemetry.online is True
    assert telemetry.uptime_sec == 3600
    assert telemetry.temperature_c == 21.5
    assert telemetry.ph == 7.1
    assert telemetry.do_mg_per_l == 8.3
    assert telemetry.turbidity_sensor_v == 0.6
    assert telemetry.turbidity_index == 0.4
    assert telemetry.avg_color_hex == "#abcdef"
    assert telemetry.timestamp == datetime(2024, 1, 1, 12, 0, tzinfo=timezone.utc)
