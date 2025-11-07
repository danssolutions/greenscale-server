import json, threading
import paho.mqtt.client as mqtt
import os
from .db import get_session_local
from .models import TelemetryData
from dotenv import load_dotenv

load_dotenv('../.env')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

BROKER = "127.0.0.1"
PORT = 8883
TOPIC = "fishwise/telemetry"

USERNAME = os.getenv('MQTT_USERNAME')
PASSWORD = os.getenv('MQTT_PASSWORD')

CA_CERT = os.path.join(BASE_DIR, "docker", "mosquitto", "certs", "ca.crt")

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT Broker with code {rc}")
    try:
        client.subscribe(TOPIC)
        print(f"Subscribed to topic: {TOPIC}")
    except:
        print(f"Error: {e}")

def on_message(client, userdata, msg):
    print("got message")
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

    client.tls_set(ca_certs=CA_CERT)
    client.username_pw_set(USERNAME, PASSWORD)

    client.tls_insecure_set(True) # bad

    try:
        client.connect(BROKER, PORT, 60)

        thread = threading.Thread(target=client.loop_forever, daemon=True)
        thread.start()

        print("MQTT listener started")

    except Exception as e:
        print("Connection failed:", e)
