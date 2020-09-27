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
  database: "EMPLOYEE_TRACKER"
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
      'View All Roles',
      'Add Employee',
      'Add Departments',
      'Add Roles',
      'Update Employee',
      'Remove Employee Role',
      'Update Employee Manager',
    ],
  },
];
let value;
const programStart = () => {
  inquirer.prompt(questions).then((answers) => {

    value = answers.firstChoice
    // Checking each value and sending them in to their correct functionality
    if (value == 'View All Employees') {
      viewAll();
    } else if (value == 'View All Departments') {
      viewByDepartment();
    } else if (value == 'View All Managers') {
      viewByManager();
    } else if (value == 'View All Roles') {
      viewRoles();
    } else if (value == 'Add Employee') {
      addEmployee();
    } else if (value == 'Add Departments') {
      addDepartments();
    } else if (value == 'Add Roles') {
      addRoles();
    } else if (value == 'Remove Employee') {
      removeEmployee();
    } else if (value == 'Update Employee') {
      updateEmployee();
    } else if (value == 'Update Employee Manager') {
      updateManager();
    }
  })
};

//Program Re-starter allowing the user to either start over or end the program
const programRestarter = () => {

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
      connection.end();
      console.log('Thanks hope to see you soon again!')
    }
  })
}

// Our functions when user makes his choice of what he wants to do in the program

// User chooses to View Employees
const viewAll = () => {
  // if(err) throw err;
  connection.query('SELECT * FROM employee_tracker.employee', function (error, results) {
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
const viewByDepartment = () => {
  connection.query('SELECT * FROM DEPARTMENT;', function (error, results) {
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
const viewByManager = () => {

  connection.query('SELECT * FROM employee_tracker.employee WHERE manager_id is not null;', function (error, results) {
    if (error) {
      console.log(error)
    } else {
      console.log() // Creating a new line to show the results properly.
      console.table(results)
    }
  })
  programRestarter();
}
const viewRoles = () => {
  connection.query('SELECT * FROM employee_tracker.role;', function (error, results) {
    if (error) {
      console.log(error);
    } else {
      console.log() // Creating a new line to show the results properly.
      console.table(results);
    }
  })
  programRestarter();
}


// Add employee

const addEmployee = () => {
  console.log('Welcome to Employee adder');
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
          managerArray.splice(2, 0, parseInt(answers.managerId));
          connection.query("INSERT INTO employee_tracker.employee (FIRST_NAME, LAST_NAME, MANAGER_ID, ROLE_ID) VALUES(?, ?, ?, ?);", managerArray,
            function (error, results) {
              if (error) {
                console.log(`Sorry we we're not able to create the employee due to ${error}`);
              } else {
                console.log(`Success you have been added on to the database, Thanks!`)
              }    
              programRestarter();  
            });
      })
    } else {
      connection.connect(function (err) {
        if (err) throw err;
        connection.query("INSERT employee_tracker.employee (FIRST_NAME, LAST_NAME, MANAGER_ID, ROLE_ID) VALUES(?, ?, ?, ?);",
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
              console.log(); // Creating this to give space to programRestarter and message for a cleaner look
              console.log(`Success you have added ${answers.firstName} on to the database!`)
             
            }
          });

        programRestarter();
      })
    }

  })
}


// Adding a Department

const addDepartments = () =>
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: "What's the name of the department you would like to add?",
    },
  ]).then(answer => {
    connection.query(
      'INSERT INTO department (department_name) VALUES (?)',
      answer.departmentName,
      function (err, res) {
        if (err) throw err;
        console.log(
          `You have entered ${answer.departmentName} to the database.`
        );
        programRestarter()
      }
    );
  });


//Adding a Role
const addRoles = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What role would you like to add?",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "Salary for this deparment?",
        name: "roleSalary",
      },
      {
        type: "input",
        message: "What is the department ID for this role?",
        name: "departmentID",
      },
    ]).then((response) => {
      let role = response.roleTitle.toUpperCase();
      let salary = response.roleSalary;
      let departmentID = response.departmentID;
      connection.query('INSERT INTO DEPARTMENT (DEPARTMENT_NAME) VALUES (?)', departmentID, function (error, result) {
        if (error) {
          console.log('Failure in the deparment ID you chose', error)
        } 
      }
      )
      connection.query(
        "INSERT INTO ROLE (ROLE_TITLE, ROLE_SALARY, DEPARTMENT_ID) VALUES (?, ?, ?);",
        [role, salary, departmentID],
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
                programRestarter()
              }
            );
          }

        }
      );
    });
}


// Remove an employee
function removeEmployee() {
  console.log('removed an employee');
  programRestarter();
}
// Update employee's role
const updateEmployee = () => {

  setTimeout(function () {
    let updateChoices = [
      "Fist name",
      "Last name",
      "Role ID",
      "Manager ID(1 or null)",
    ];
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the ID of the employee you wish to update?",
          name: "IDUpdate",
        },
        {
          type: "list",
          message: "What would you like to update?",
          choices: updateChoices,
          name: "updateChoice",
        },
        {
          type: "input",
          message: "Write your change",
          name: "updateChange",
        },
      ])
      .then((response) => {
        let updateColumn;
        switch (response.updateChoice) {
          case "Fist name":
            updateColumn = "UPDATE EMPLOYEE SET FIRST_NAME=? WHERE ID=?;";
            break;
          case "Last name":
            updateColumn = "UPDATE EMPLOYEE SET LAST_NAME=? WHERE ID=?;";
            break;
          case "Role ID":
            updateColumn = "UPDATE EMPLOYEE SET ROLE_ID=? WHERE ID=?;";
            break;
          case "Manager ID":
            updateColumn = "UPDATE EMPLOYEE SET MANAGER_ID=? WHERE ID=?;";
            break;
          default:
            break;
        }
        connection.query(
          updateColumn,
          [response.updateChange, response.IDUpdate],
          function (error, result) {
            if (error) {
              console.log(
                "There has been a mistake updating the employee: ",
                error
              );
            } else {
              console.log(
                "The employee with the ID of",
                response.IDUpdate,
                "has been successfully updated!!!!!"
              );
              connection.query(
                "SELECT * FROM EMPLOYEE WHERE ID=?;",
                [response.IDUpdate],
                function (error, result) {
                  console.table(result);
                }
              );
            }
            setTimeout(function () {
              programRestarter();
            }, 200);
          }
        );
      });
  }, 700);
}

// Update manager
function updateManager() {
  console.log('update Manager!');
  programRestarter();
}









programStart();

