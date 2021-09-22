const inquirer = require('inquirer');

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
        .then(

        );
};

function addRole() {

};

function addEmployee() {

};

function updateRole() {

};

function init() {
    console.log('Employee Tracker')
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
                case 'View All Roles':
                    
                    break;
                case 'View All Departments':
                    
                    break;
                case 'View All Employees':
                   
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
                    
                    break;
            }
            return;
        });
}
init();