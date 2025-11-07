#!/bin/sh
set -e

CERT_DIR="/mosquitto/certs"
CONF_DIR="/mosquitto/config"
CLIENT_CERT_DIR="/mosquitto/client-certs"

# Ensure cert directories exist
mkdir -p $CERT_DIR
mkdir -p $CLIENT_CERT_DIR

# Generate certificates if missing
if [ ! -f "$CERT_DIR/server.crt" ]; then
    echo "No certificates found — generating self-signed ones..."
    openssl genrsa -out $CERT_DIR/ca.key 2048
    openssl req -x509 -new -nodes -key $CERT_DIR/ca.key -sha256 -days 1024 -out $CERT_DIR/ca.crt -subj "/CN=LocalMosquittoCA"

    openssl genrsa -out $CERT_DIR/server.key 2048
    openssl req -new -key $CERT_DIR/server.key -out $CERT_DIR/server.csr -subj "/CN=mosquitto"
    openssl x509 -req -in $CERT_DIR/server.csr -CA $CERT_DIR/ca.crt -CAkey $CERT_DIR/ca.key -CAcreateserial -out $CERT_DIR/server.crt -days 365 -sha256

    chown mosquitto:mosquitto $CERT_DIR/server.key $CERT_DIR/server.crt $CERT_DIR/ca.crt
    chmod 600 $CERT_DIR/server.key
    chmod 644 $CERT_DIR/server.crt $CERT_DIR/ca.crt

    echo "Certificates generated in $CERT_DIR"
fi

# Copy only CA cert for clients
cp $CERT_DIR/ca.crt $CLIENT_CERT_DIR/
chown mosquitto:mosquitto $CLIENT_CERT_DIR/ca.crt
chmod 644 $CLIENT_CERT_DIR/ca.crt
echo "CA certificate ready for clients at $CLIENT_CERT_DIR/ca.crt"

# Create password file if credentials exist
if [ ! -z "$MQTT_USERNAME" ] && [ ! -z "$MQTT_PASSWORD" ]; then
    echo "Creating Mosquitto password file..."
    mosquitto_passwd -b -c $CONF_DIR/passwords $MQTT_USERNAME $MQTT_PASSWORD

    chown mosquitto:mosquitto /mosquitto/config/passwords
    chmod 640 /mosquitto/config/passwords
fi

echo "Starting Mosquitto..."
exec mosquitto -c $CONF_DIR/mosquitto.conf
