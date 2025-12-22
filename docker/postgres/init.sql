-- Create tables:

CREATE TABLE IF NOT EXISTS user_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS farms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    temperature_min  REAL,
    temperature_max  REAL,
    ph_min  REAL,
    ph_max  REAL,
    do_min  REAL,
    do_max  REAL,
    turbidity_min  REAL,
    turbidity_max  REAL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    type_id INT REFERENCES user_types(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    farm_id INT REFERENCES farms(id)
);

CREATE TABLE IF NOT EXISTS devices (
    id VARCHAR(255) PRIMARY KEY,
    farm_id INT REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS telemetry_data (
    id SERIAL PRIMARY KEY,
    version INTEGER NOT NULL,
    device_id VARCHAR(255) NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
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

INSERT INTO farms (name, temperature_min, temperature_max, ph_min, ph_max, do_min, do_max, turbidity_min, turbidity_max)
VALUES ('Farm1', 19, 25, 6, 8, 8, 9, 2, 5);

INSERT INTO devices (id, farm_id)
VALUES ('greenscale-edge', (SELECT id FROM farms WHERE name = 'Farm1'))
ON CONFLICT (id) DO NOTHING;