INSERT INTO department (name)
VALUES ("Management"),
        ("Sales"),
        ("Accounting"),
        ("Service");

INSERT INTO role (title, salary, department_id)
VALUES ("Regional Manager", 60000, 1),
        ("Asst. to the Regional Manager", 50000, 1),
        ("Salesperson", 45000, 2),
        ("Accountant", 40000, 3),
        ("Reception", 30000, 4),
        ("Customer Service", 35000, 4),
        ("Human Resources", 40000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 1, null),
        ("Dwight", "Schrute", 2, 1),
        ("Jim", "Halpert", 3, 1),
        ("Andy", "Bernard", 3, 1),
        ("Phyllis", "Vance", 3, 1),
        ("Stanley", "Hudson", 3, 1),
        ("Angela", "Martin", 4, 2),
        ("Oscar", "Martinez", 4, 7),
        ("Kevin", "Malone", 4, 7),
        ("Pam", "Beesly", 5, 1),
        ("Erin", "Hannon", 5, 10),
        ("Kelly", "Kapoor", 6, null),
        ("Toby", "Flenderson", 7, null);
