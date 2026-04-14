-- ========================================================
-- 1. LIMPIEZA (Opcional: borra las tablas en orden inverso para evitar errores de FK)
-- ========================================================
DROP TABLE IF EXISTS project_volunteer;
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS users;

-- ========================================================
-- 2. TABLE CREATION: users
-- ========================================================
CREATE TABLE IF NOT EXISTS users (
    account_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    account_lastname VARCHAR(100) NOT NULL DEFAULT 'None',
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_name VARCHAR(50) NOT NULL DEFAULT 'Client'
);

-- ========================================================
-- 3. TABLE CREATION: organization
-- ========================================================
CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================================
-- 4. TABLE: project
-- ========================================================
CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    date DATE,
    location VARCHAR(255),
    organization_id INT REFERENCES organization(organization_id) ON DELETE CASCADE
);

INSERT INTO project (title, description, date, location, organization_id) VALUES 
('After School Tutoring', 'Helping kids with math and reading.', '2026-05-10', 'Downtown Community Center', 1),
('River Cleanup', 'Removing plastic from the local river.', '2026-06-15', 'Riverside Park', 2);

-- ========================================================
-- 5. TABLE: category
-- ========================================================
CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

INSERT INTO category (category_name) VALUES 
('Education'), ('Environment'), ('Community Service');

-- ========================================================
-- 6. TABLE: project_category (Many-to-Many Relationship)
-- ========================================================
CREATE TABLE IF NOT EXISTS project_category (
    project_id INT REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO project_category (project_id, category_id) VALUES 
(1, 1), -- Tutoring -> Education
(1, 3), -- Tutoring -> Community Service
(2, 2); -- River Cleanup -> Environment

-- ========================================================
-- 7. TABLE: project_volunteer (Volunteer Sign-Up)
-- ========================================================
CREATE TABLE IF NOT EXISTS project_volunteer (
    project_id INT REFERENCES project(project_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(account_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);