-- Description: This file contains the SQL commands to create the database and the tables.
CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);