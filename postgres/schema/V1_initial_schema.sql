CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR,
  email VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR,
  password VARCHAR,
  address VARCHAR,
  public_address VARCHAR,
  nonce BIGINT,
  private_key VARCHAR
);
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
CREATE INDEX IF NOT EXISTS users_username_idx ON users (username);
CREATE INDEX IF NOT EXISTS users_address_idx ON users (address);
CREATE INDEX IF NOT EXISTS users_public_address_idx ON users (public_address);
GRANT SELECT, INSERT ON users TO slw_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO auth_user;

CREATE TABLE IF NOT EXISTS stars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edr3_id BIGINT,
  ra VARCHAR,
  dec VARCHAR,
  pm_ra DOUBLE PRECISION,
  pm_dec DOUBLE PRECISION,
  parallax DOUBLE PRECISION,
  x DOUBLE PRECISION,
  y DOUBLE PRECISION,
  z DOUBLE PRECISION,
  mass DOUBLE PRECISION,
  radius DOUBLE PRECISION,
  temperature BIGINT,
  magnitude DOUBLE PRECISION,
  luminosity DOUBLE PRECISION,
  evolutionary_stage VARCHAR,
  spectral_type VARCHAR,
  age DOUBLE PRECISION,
  name VARCHAR,
  token_id BIGINT,
  owner_id UUID,
  ship_count INT
);
ALTER TABLE stars OWNER TO slw_user;

CREATE TABLE IF NOT EXISTS star_designations (
  id UUID PRIMARY KEY,
  star_id UUID,
  designation VARCHAR
);
CREATE INDEX IF NOT EXISTS star_designations_star_id_idx ON star_designations (star_id);
ALTER TABLE star_designations OWNER TO slw_user;

CREATE TABLE IF NOT EXISTS ships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID,
  star_id UUID,
  target_star_id UUID,
  star_name VARCHAR,
  target_star_name VARCHAR,
  health DOUBLE PRECISION,
  arrival_time TIMESTAMP,
  status INT,
  last_harvested TIMESTAMP,
  speed BIGINT,
  fuel BIGINT,
  name VARCHAR,
  token_id BIGINT
);
CREATE INDEX IF NOT EXISTS  ships_owner_id_idx ON ships (owner_id);
CREATE INDEX IF NOT EXISTS ships_star_id_idx ON ships (star_id);
CREATE INDEX IF NOT EXISTS ships_status_idx ON ships (status);
ALTER TABLE ships OWNER TO slw_user;

CREATE TABLE IF NOT EXISTS nearest_stars (
  star_id UUID,
  distance DOUBLE PRECISION,
  nearest_star_id UUID,
  PRIMARY KEY (star_id, nearest_star_id)
);
CREATE INDEX IF NOT EXISTS nearest_stars_star_id_idx ON nearest_stars (star_id);
ALTER TABLE nearest_stars OWNER TO slw_user;

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  type INT,
  text VARCHAR,
  seen BOOLEAN,
  closed BOOLEAN
);
CREATE INDEX IF NOT EXISTS user_id_idx ON events (user_id);
CREATE INDEX IF NOT EXISTS seen_idx ON events (seen);
CREATE INDEX IF NOT EXISTS closed_idx ON events (closed);
ALTER TABLE events OWNER TO slw_user;

CREATE TABLE IF NOT EXISTS tax_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id UUID,
  ship_name VARCHAR,
  star_id UUID,
  amount BIGINT,
  timestamp TIMESTAMP
);
CREATE INDEX IF NOT EXISTS tax_payments_star_id_idx ON tax_payments (star_id);
ALTER TABLE tax_payments OWNER TO slw_user;