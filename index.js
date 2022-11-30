const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { exit } = require('process');

const departmentArray = [];
const roleArray = [];
const employeeArray = [];
const noneArray = [];

const db = mysql.createConnection(
  { 
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);
  
function init () {
  function options() {
    console.log(`Welcome to the Employee Tracker! What would you like to do?`);
    inquirer.prompt([
      {
        type: 'list',
        name: 'options',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles',
        'Add Role', 'View All Departments', 'Add Department', 'Exit']
      }
    ])
    .then((answer) => {
      switch (answer.options) {
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployee();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Quit':
          quit();
          break;
        default:
          break;
      }
    })

    function viewAllEmployees() {
      const sql = `SELECT employees.id, employees.first_name AS First, employees.last_name AS Last, roles.title AS Title, departments.department_name AS Department, 
                  roles.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager 
                  FROM employees
                  JOIN roles on employees.role_id = roles.id
                  JOIN departments on roles.department_id = departments.id
                  LEFT JOIN employees manager ON employees.manager_id = manager.id
                  ORDER BY employees.id;`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.error(err);
          return;
        }
        console.table(rows);
        options();
      })
    };

    function addEmployee() {
      inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: `What is the employee's first name?`,
          validate: (answer) => {
            const pass = answer.match(/[a-zA-Z][^0-9]/);
            if(answer !== '' && pass) {
              return true;
            }
            return "Please enter a valid first name without using numbers."
          }
        },
        {
          type: 'input',
          name: 'last_name',
          message: `What is the employee's last name?`,
          validate: (answer) => {
            const pass = answer.match(/[a-zA-Z][^0-9]/);
            if(answer !== '' && pass) {
              return true;
            }
            return "Please enter a valid last name without using numbers."
          }
        },
        {
          type: 'list',
          name: 'role',
          message: `What is the employee's role?`,
          choices: roleArray
        },
        {
          type: 'list',
          name: 'manager',
          message: `Who is the employee's manager?`,
          choices: [...employeeArray, ...noneArray]
        }
      ])
      .then((answer) => {
        let name = `${answer.first_name} ${answer.last_name}`
        employeeArray.push(name);

        let role = parseInt(roleArray.indexOf(answer.role)) + parseInt(1);

        managerID = () => {
          if(answer.manager !== 'None') {
            return parseInt(employeeArray.indexOf(answer.manager)) + parseInt(1);
          }
          return null;
          }

        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

        const params = [answer.first_name, answer.last_name, role, managerID()];
        db.query(sql, params, (err, data) => {
          if(err){
            console.error(err);
            return;
          }
          console.log(`${answer.first_name} ${answer.last_name} has been added to the database.`);
          options();
        })
      })
    }

    function updateEmployee() {
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: `Which employee would you like to update?`,
          choices: employeeArray
        },
        {
          type: 'list',
          name: 'newRole',
          message: `What is the employee's new role?`,
          choices: roleArray
        }
      ])
      .then((answer) => {
        const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;

        let employeeID = parseInt(employeeArray.indexOf(answer.employee)) + parseInt(1);
        let newRole = parseInt(roleArray.indexOf(answer.newRole)) + parseInt(1);
        const params = [newRole, employeeID];

        db.query(sql, params, (err, data) => {
          if(err){
            console.error(err);
            return;
          }
          console.log(`${answer.employee} has been updated.`);
          options();
        })
      })
    }

    function viewAllDepartments() {
      const sql = `SELECT id, department_name AS Department
                   FROM departments
                   ORDER BY departments.id`
      db.query(sql, (err, rows) => {
        if(err){
          console.error(err);
          return;
        }
        console.table(rows);
        options();
      })
    }

    function addDepartment() {
      inquirer.prompt([
        {
          type: "input",
          name: "department_name",
          message: "What department would you like to add?",
          validate: (answer) => {
            const pass = answer.match(/[a-zA-Z][^0-9]/);
            if(answer !== '' && pass) {
              return true;
            }
            return "Please enter a valid department name without using numbers."
          }
        }
      ])
      .then((answer) => {
        departmentArray.push(answer.department_name);
        let sql = `INSERT INTO departments (department_name) VALUES (?)`;
        db.query(sql, answer.department_name, (err, rows) => {
          if(err){
            console.error(err);
            return;
          }
          console.log(`${answer.department_name} has been added to the database.`);
          options();
        })
      })
    }

    function viewAllRoles() {
      const sql = `SELECT roles.id, title AS Title, departments.department_name AS Department, salary AS Salary 
                   FROM roles
                   JOIN departments ON roles.department_id = departments.id
                   ORDER BY roles.id;`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.error(err);
          return;
        }
        console.table(rows);
        options();
      })
    }

    function addRole() {
      inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: `What is the title of the role?`,
          validate: (answer) => {
            const pass = answer.match(/[a-zA-Z][^0-9]/);
            if(answer !== '' && pass) {
              return true;
            }
            return "Please enter a valid title without using numbers."
          }
        },
        {
          type: 'input',
          name: 'salary',
          message: `What is the salary of the role?`,
          validate: (answer) => {
            const fail = answer.match(/[^0-9]/);
            if(answer !== '' && !fail) {
              return true;
            }
            return "Please enter a valid salary without using letters."
          }
        },
        {
          type: 'list',
          name: 'department',
          message: `What department does the role belong to?`,
          choices: departmentArray
        }
      ])
      .then((answer) => {
        roleArray.push(answer.title);

        let department = parseInt(departmentArray.indexOf(answer.department)) + parseInt(1);
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        const params = [answer.title, answer.salary, department];
        db.query(sql, params, (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`${answer.title} has been added to the database.`);
          options();
        })
      })
    }
    function quit() {
      console.log(`Goodbye!`);
      process.exit(0);
    }
  }
  function generateDepartmentArray() {
    const sql = `SELECT department_name FROM departments
                 ORDER BY id`;
    db.query(sql, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let values = data.map(obj => obj.department_name);
      values.map(obj => departmentArray.push(obj));
    })
  }
  function generateRoleArray() {
    const sql = `SELECT title FROM roles
                 ORDER BY id`;
    db.query(sql, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let values = data.map(obj => obj.title);
      values.map(obj => roleArray.push(obj));
    })
  }
  function generateEmployeeArray() {
    const sql = `SELECT CONCAT(first_name, '', last_name) AS name FROM employees
                 ORDER BY id`;
    db.query(sql, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let values = data.map(obj => obj.name);
      values.map(obj => employeeArray.push(obj));
    })
  }
  generateEmployeeArray(); 
  generateRoleArray(); 
  generateDepartmentArray(); 
  options();
};

module.exports = init();