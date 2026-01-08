-- Active: 1766902630164@@localhost@3306@foundit_db
-- RESET
DROP DATABASE IF EXISTS FoundIt_DB;
CREATE DATABASE FoundIt_DB;
USE FoundIt_DB;

-- TABLE 1: Found Items
-- Step 1: Create the Categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- Step 2: Populate the categories (Important: IDs must match your HTML values)
INSERT INTO categories (category_id, category_name) VALUES 
(1, 'Electronics'), 
(2, 'Personal Belongings'), 
(3, 'Keys'),
(4, 'Books & Papers'),
(5, 'Clothes'),
(6, 'Accessories'),
(7, 'Others');

-- Step 3: Create the Items table
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    cat_id INT, 
    item_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    item_description TEXT,
    photo_src VARCHAR(255),
    status ENUM('active', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cat_id) REFERENCES categories(category_id)
);

-- Step 4: Create the Claims table
CREATE TABLE claims (
    claim_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT UNIQUE, 
    student_name VARCHAR(255),
    student_id VARCHAR(50),
    student_course VARCHAR(100),
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);


-- Remove the old constraint
ALTER TABLE claims DROP FOREIGN KEY claims_ibfk_1;

-- Add the new constraint with CASCADE
ALTER TABLE claims 
ADD CONSTRAINT claims_ibfk_1 
FOREIGN KEY (item_id) REFERENCES items(item_id) 
ON DELETE CASCADE;