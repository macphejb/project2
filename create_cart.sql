-- Remove any existing database and user.
DROP DATABASE IF EXISTS cart;
DROP USER IF EXISTS shopper@localhost;

-- Create Unforget database and user. Ensure Unicode is fully supported.
CREATE DATABASE cart CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER shopper@localhost IDENTIFIED WITH mysql_native_password BY 'CartShop';
GRANT ALL PRIVILEGES ON cart.* TO shopper@localhost;