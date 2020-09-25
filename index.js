const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const express = require('express');
const { json, response } = require("express");
const { allowedNodeEnvironmentFlags } = require("process");

// My SQL connections being made here
var connection = mysql.createConnection({
  host: "localhost",

  port: 3307,

  user: "root",

  password: "root",
  database: "employee"
});

let questions = [
  {
    type: 'list',
    name: 'firstChoice',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'View All Departments',
      'View All Managers',
      'Add Employee',
      'Add Departments',
      'Add Roles',
      'Remove Employee',
      'Update Employee Role',
      'Update Employee Manager',
    ],
  },
];
let value;
function programStart() {
  inquirer.prompt(questions).then((answers) => {
    console.log(JSON.stringify(answers, null, '  '));
    value = answers.firstChoice
    // Checking each value and sending them in to their correct functionality
    if (value == 'View All Employees') {
      viewAll();
    } else if (value == 'View All Departments') {
      viewByDepartment();
    } else if (value == 'View All Managers') {
      viewByManager();
    } else if (value == 'Add Employee') {
      addEmployee();
    } else if (value == 'Add Departments') {
      addDepartments();
    } else if (value == 'Add Roles') {
      addRoles();
    } else if (value == 'Remove Employee') {
      removeEmployee();
    } else if ('Update Employee Role') {
      updateRole();
    } else if (value == 'Update Employee Manager') {
      updateManager();
    }
  })
};

//Program Re-starter allowing the user to either start over or end the program
function programRestarter() {

  let restart = [
    {
      type: 'list',
      name: 'restartOptions',
      message: 'Would you like to restart or quit the program?',
      choices: [
        'RE-START',
        'QUIT PROGRAM'
      ],
    },
  ]

  inquirer.prompt(restart).then((answers) => {
    value = answers.restartOptions;
    if (value == 'RE-START') {
      programStart()
    } else {
      console.log('Thanks hope to see you soon again!')
    }
  })
}

// Our functions when user makes his choice of what he wants to do in the program

// User chooses to View Employees
function viewAll() {
  // if(err) throw err;
  connection.query('SELECT * FROM employee.employee', function (error, results) {
    if (error) {
      console.log(error)
    } else {
      console.log() // Creating a new line to show the results properly.
      console.table(results)
    }
  })
  programRestarter();
}
// View by Department
function viewByDepartment() {
  connection.query('SELECT EMPLOYEE.FIRST_NAME,EMPLOYEE.LAST_NAME,ROLE.ROLE_TITLE FROM EMPLOYEE INNER JOIN ROLE ON ROLE.ID=EMPLOYEE.ROLE_ID;', function (error, results) {
    if (error) {
      console.log(error)
    } else {
      console.log() // Creating a new line to show the results properly.
      console.table(results)
    }
  })
  programRestarter();
}
// View by Manager
function viewByManager() {
  console.log('this manager thing works!');
  connection.query('SELECT * FROM employee.employee WHERE manager_id is not null;', function (error, results) {
    if (error) {
      console.log(error)
    } else {
      console.log() // Creating a new line to show the results properly.
      console.table(results)
    }
  })
  programRestarter();
}


// Add employee
function addEmployee() {
  console.log('employee adder');
  employeeAdder();
  function employeeAdder() {
    let employeeAddQuestions = [
      {
        type: 'input',
        name: 'firstName',
        message: "What's your first name?",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What's your last name?",
      },
      {
        type: "list",
        message:
          "Please choose your role correctly 1 --> Manager 2 --> Engineer 3 --> Janitor 4 --> Intern",
        choices: [
          1, 2, 3, 4,
        ],
        name: "role",
      },
    ]

    inquirer.prompt(employeeAddQuestions).then((answers) => {
      console.log(`${answers.firstName}, ${answers.lastName}, ${answers.role}`)
      let managerArray = [
        answers.firstName,
        answers.lastName,
        answers.role,
      ]
      if (answers.role == 1) {
        let managerIdQuestion = [
          {
            type: 'input',
            name: 'managerId',
            message: "What's your manager ID?",
          }
        ]
        inquirer.prompt(managerIdQuestion).then((answers) => {
          connection.connect(function (err) {
            if (err){
              console.log(err)
            }
            managerArray.splice(2, 0, parseInt(answers.managerId));
            connection.query("INSERT INTO employee (FIRST_NAME, LAST_NAME, MANAGER_ID, ROLE_ID) VALUES(?, ?, ?, ?);", managerArray,
              function (error, results) {
                if (error) {
                  console.log(`Sorry we we're not able to create the employee due to ${error}`);
                } else {
                  console.log(`Success you have been added on to the database, Thanks ${managerArray[0]}!`)
                }
              });
            connection.end();
          })
        })

      } else {
        connection.connect(function (err) {
          if (err) throw err;
          connection.query("INSERT INTO employee (FIRST_NAME, LAST_NAME, MANAGER_ID, ROLE_ID) VALUES(?, ?, ?, ?);",
            [
              answers.firstName,
              answers.lastName,
              answers.manager_id = null,
              answers.role
            ],
            function (error, results) {
              if (error) {
                console.log(`Sorry we we're not able to create the employee due to ${error}`);
              } else {
                console.log(`Success you have added ${answers.firstName} on to the database!`)
              }
            });
          connection.end();
        })
      }
      // programRestarter();
    })
  }
}

// Adding a Department
function addDepartments() {

}

//Adding a Role
function addRoles() {
  inquirer
  .prompt([
    {
      type: "input",
      message: "What is the name of the role you wish to add?",
      name: "roleTitle",
    },
    {
      type: "input",
      message: "What is the salary for this department? (Only the ammount)",
      name: "roleSalary",
    },
  ]) //Here is what I am going to do with the response.
  .then((response1) => {
    connection.query("ALTER TABLE = ? FROM DEPARTMENT;", function (error, result) {
      if (error) {
        console.log("Where not able to get the departments ", error);
      }
      console.log("Department's");
      console.table(result);
    });
    setTimeout(function () {
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the department ID for this role?",
            name: "departmentID",
          },
        ])
        .then((response) => {
          let role = response1.roleTitle;
          role = role.toUpperCase();
          let salary = response1.roleSalary;
          let departmentID = response.departmentID;
          //This is the query that i am passing to my database, I use '?' to prevent my query from being injected
          connection.query(
            "INSERT INTO ROLE (ROLE_TITLE, ROLE_SALARY, DEPARTMENT_ID) VALUES (?, ?, ?);",
            [role,salary,departmentID],
            function (error, result) {
              if (error) {
                console.log(
                  "We where not able to create the employee, try again",
                  error
                );
              } else {
                connection.query(
                  "SELECT * FROM ROLE WHERE ID=?;",
                  [result.insertId],
                  function (error, result) {
                    if (error) {
                      console.log(
                        "There was an error looking for the role after it being created: ",
                        error
                      );
                    }
                    console.log("The role has been created");
                    console.table(result);
                  }
                );
              }

            }
          );
        });
    }, 200);
  });
}

// Remove an employee
function removeEmployee() {
  console.log('removed an employee');
  programRestarter();
}
// Update employee's role
function updateRole() {
  console.log('updated role!')
  programRestarter();

}
// Update manager
function updateManager() {
  console.log('update Manager!');
  programRestarter();
}









programStart();

