DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("eggs", "Dairy", .25, 100), ("cheese", "Dairy", .50, 100),
("yogurt", "Dairy", 1.50, 100),("milk", "Dairy", 2, 100),
("salt", "Condiments", 1.25, 50),("pepper", "Condiments", 1, 50),
("spices", "Condiments", .50, 50), ("honey", "Condiments",3, 50),
("sugar", "Condiments", 1, 50),("vinegar", "Condiments", .50, 50);

select * from products;