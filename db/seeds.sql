USE company_db;

INSERT INTO departments
    (department_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Sales Lead', 120000, 1),
    ('Salesperson', 75000, 1),
    ('Lead Engineer', 175000, 2),
    ('Software Engineer', 110000, 2),
    ('Account Manager', 180000, 3),
    ('Accountant', 100000, 3),
    ('Legal Team Lead', 200000, 4),
    ('Lawyer', 170000, 4);

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Tyler', 'Miller', 1, NULL),
    ('Rebecca', 'Williams', 2, 1),
    ('Morgan', 'Davis', 3, NULL),
    ('James', 'Hixon', 4, 3),
    ('Sarah', 'Moore', 5, NULL),
    ('Kyle', 'Willamson', 6, 5),
    ('Ron', 'Allen', 7, NULL),
    ('David', 'Rodriguez', 8, 7);