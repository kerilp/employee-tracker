const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '',
        database: 'employees_db',
        multipleStatements: true
    },
    console.log(`Connected to the employees_db database.\nWelcome to Employee Tracker!`)
);

function addDepartment() {
    inquirer
        .prompt(
            {
                name: 'department',
                type: 'input',
                message: 'What is the name of the department?',
                validate: (input) => !!input
            }
        )
        .then((data) => {
            db.query(`INSERT INTO department (name) VALUES (?)`, data.department, function (err) {
                if (err) return console.log(err);
                console.log(`Added ${data.department} to Departments`);
                menu();
            });
        });
};

function addRole() {
    db.query(`SELECT * FROM department`, function (err, results) {
        if (err) return console.log(err);
        inquirer
            .prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'What is the title for this role?',
                    validate: (input) => !!input
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary for this role?',
                    validate: (input) => !!input
                },
                {
                    name: 'dept',
                    type: 'list',
                    message: 'What department does this role fall under?',
                    choices: results.map(department => 
                        ({
                            name: department.name,
                            value: department.id
                        })
                    ),
                    validate: (input) => !!input
                }
            ])
            .then((data) => {
                db.query(`
                INSERT INTO role (title, salary, department_id)
                VALUES (?,?,?)`, [data.title, data.salary, data.dept], 
                function (err) {
                    if (err) return console.log(err);
                    console.log(`Added ${data.title} to Roles`);
                    menu();
                });
            });

    });
};

function addEmployee() {
    db.query(`SELECT * FROM role; SELECT * FROM employee`, function (err, results) {
        if (err) return console.log(err);
        inquirer
            .prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'What is their first name?',
                    validate: (input) => !!input
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'What is their last name?',
                    validate: (input) => !!input
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is their role?',
                    choices: results[0].map(role => 
                        ({
                            name: role.title,
                            value: role.id
                        })
                    ),
                    validate: (input) => !!input
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Who is their manager?',
                    choices: () => {
                        let map = results[1].map(employee => ({
                                name: employee.first_name + ' ' + employee.last_name,
                                value: employee.id
                            }));
                        map.unshift({name: 'None', value: null});
                        return map;
                    },
                    validate: (input) => !!input
                }
            ])
            .then((data) => {
                db.query(`
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?,?,?,?)`, [data.firstName, data.lastName, data.role, data.manager], 
                function (err) {
                    if (err) return console.log(err);
                    console.log(`Added ${data.firstName} ${data.lastName} to Employees`);
                    menu();
                });
            });

    });
};

function updateRole() {
    db.query(`SELECT * FROM employee; SELECT * FROM role`, function (err, results) {
        if (err) return console.log(err);
        inquirer
            .prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Which employee do you want to update?',
                    choices: results[0].map(employee => 
                        ({
                            name: employee.first_name + ' ' + employee.last_name,
                            value: employee.id
                        })
                    ),
                    validate: (input) => !!input
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is their new role?',
                    choices: results[1].map(role => 
                        ({
                            name: role.title,
                            value: role.id
                        })
                    ),
                    validate: (input) => !!input
                }
            ])
            .then((data) => {
                db.query(`
                UPDATE employee
                SET role_id = ?
                WHERE id = ?`, [data.role, data.employee], 
                function (err) {
                    if (err) return console.log(err);
                    console.log(`Updated Employee's Role`);
                    menu();
                });
            });

    });
};

function menu() {
    inquirer
        .prompt({
            name: 'menu',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee\'s Role',
                'Quit'
            ],
        })
        .then((data) => {
            switch (data.menu) {
                case 'View All Departments':
                    db.query(`SELECT * FROM department`, function (err, results) {
                        console.table(results);
                        menu();
                    });
                    break;
                case 'View All Roles':
                    db.query(`SELECT
                    role.id, role.title, role.salary, department.name AS department
                    FROM role
                    JOIN department
                    ON role.department_id = department.id
                    ;`, function (err, results) {
                        console.table(results);
                        menu();
                    });
                    break;
                case 'View All Employees':
                    db.query(`SELECT 
                    employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name,
                    role.title AS title, department.name AS department, role.salary,
                    CONCAT(manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT OUTER JOIN employee AS manager
                    ON employee.manager_id = manager.id
                    JOIN role
                    ON employee.role_id = role.id
                    JOIN department
                    ON role.department_id = department.id
                    ;
                    `, function (err, results) {
                        console.table(results);
                        menu();
                    });
                    break;
                case 'Add a Department':
                    addDepartment();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmployee();
                    break;
                case 'Update an Employee\'s Role':
                    updateRole();
                    break;
                case 'Quit':
                    console.log('Use CTRL+C to end the program. Goodbye!');
                    break;
            }
            return;
        });
}
menu();