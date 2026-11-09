CREATE TABLE IF NOT EXISTS employee (
    "id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" TEXT NOT NULL,
    "department" TEXT,
    "title" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false
);

DELETE FROM employee;

INSERT INTO employee (name, department, title, active) VALUES
    ('Ava Patel', 'Engineering', 'Senior Engineer', true),
    ('Liam Chen', 'Design', 'Product Designer', true),
    ('Noah Kim', 'Engineering', 'Engineering Manager', true),
    ('Mia Garcia', 'Sales', 'Account Executive', false),
    ('Ethan Brown', 'Support', 'Support Specialist', false);
