DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price decimal(10,3) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Basketball", "Sports", 6.50, 25), ("Hockey Stick", "Sports", 15, 35),("TV", "Media", 300, 15),
("Bed Set", "Sleep", 1500, 3), ("PS4", "Gaming", 300, 39);



CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(255) NOT NULL,
    over_head_costs decimal(10,3) NOT NULL,
    PRIMARY KEY(department_id)
)