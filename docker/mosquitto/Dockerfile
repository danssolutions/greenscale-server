FROM eclipse-mosquitto:latest

# Install OpenSSL for certificate generation
RUN apk add --no-cache openssl

# Copy our custom start script
COPY ./config/start.sh /mosquitto/config/start.sh
RUN chmod +x /mosquitto/config/start.sh
