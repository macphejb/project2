DROP TABLE IF EXISTS cart;

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  product TEXT,
  manufacturer TEXT,
  count INT DEFAULT 0,
  price FLOAT,
  is_deleted INT DEFAULT 0
);