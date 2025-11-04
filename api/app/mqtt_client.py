import json, threading
import paho.mqtt.client as mqtt
from .db import get_session_local
from .models import TelemetryData

BROKER = "127.0.0.1"
PORT = 1883
TOPIC = "fishwise/telemetry"

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT Broker with code {rc}")
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    print(f"{msg.topic} -> {payload}")
    try:
        data = json.loads(payload)
        telemetry_entry = TelemetryData.from_json(data)

        with get_session_local() as session:
            session.add(telemetry_entry)
            session.commit()

    except Exception as e:
        print(f"Error: {e}")

def start_mqtt_listener():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER, PORT, 60)
    thread = threading.Thread(target=client.loop_forever, daemon=True)
    thread.start()
    print("MQTT listener started")
