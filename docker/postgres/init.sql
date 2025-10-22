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

-- Seed data:

INSERT INTO user_types (name)
VALUES ('user')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (type_id, name, email)
VALUES ((SELECT id FROM user_types WHERE name = 'user'), 'user', 'user@user.com')
ON CONFLICT (email) DO NOTHING;
