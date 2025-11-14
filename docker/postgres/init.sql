-- Create tables:

CREATE TABLE IF NOT EXISTS user_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    type_id INT REFERENCES user_types(id),
    name VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS telemetry_data (
    id SERIAL PRIMARY KEY,
    version INTEGER NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    online BOOLEAN NOT NULL,
    uptime_sec INTEGER NOT NULL,
    temperature_c REAL NOT NULL,
    ph REAL NOT NULL,
    do_mg_per_l REAL NOT NULL,
    turbidity_sensor_v REAL NOT NULL,
    turbidity_index REAL NOT NULL,
    avg_color_hex VARCHAR(7) NOT NULL
);

-- Seed data:

INSERT INTO user_types (name)
VALUES ('user')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (type_id, name, email)
VALUES ((SELECT id FROM user_types WHERE name = 'user'), 'user', 'user@user.com')
ON CONFLICT (email) DO NOTHING;
