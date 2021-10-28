DROP TABLE IF EXISTS cart;

CREATE TABLE cart (
  product TEXT,
  manufacturer TEXT,
  count INT DEFAULT 0,
  price FLOAT,
  out_of_stock INT DEFAULT 0,
  is_deleted INT DEFAULT 0
);