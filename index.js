const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");
const express = require('express');
const { json } = require("express");

// My SQL connections being made here
var connection = mysql.createConnection({
  host: "localhost",

  port: 3307,

  user: "root",

  password: "root",
  database: "employees"
});

// connection.connect(function (err) {
//   if (err) throw err;
//   connection.query('SELECT artist_name FROM Table1', function (error, results) {
//     console.log(results);

//   });
//   connection.end();
// })


// Prompt Portion
// Initial Question 
let questions = [
  {
    type: 'list',
    name: 'firstChoice',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'View All Employees by Department',
      'View All Employees by Manager',
      'Add Employee',
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

    if (value == 'View All Employees') {
      viewAll();
    } else if (value == 'View All Employees by Department') {
      viewByDepartment();
      console.log('test works!!!!')
    }
    else if (value == 'View All Employees by Manager') {
      viewByManager();
    } else if (value == 'Add Employee') {
      addEmployee();
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
        'START',
        'END'
      ],
    },
  ]

  inquirer.prompt(restart).then((answers) => {
    value = answers.restartOptions;
    if (value == 'START') {
      programStart()
    } else {
      console.log('Thanks hope to see you soon again!')
    }
  })
}

// Our functions when user makes his choice of what he wants to do in the program

// View Employees
function viewAll() {
  console.log('this works!');
  programRestarter();
}
// View by Department
function viewByDepartment() {
  console.log('this department thing works!');
  programRestarter();
}
// View by Manager
function viewByManager() {
  console.log('this manager thing works!');
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
        name: 'first_name',
        message: "What's your first name?",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "What's your last name?",
      },
      {
        type: 'input',
        name: 'role_id',
        message: "What's your id role?",
      },
      {
        type: 'input',
        name: 'manager_id',
        message: "What's your manager id?",
      },
    ]

    inquirer.prompt(employeeAddQuestions).then((answers) => {
      value = answers.restartOptions;
      if (value == 'START') {
        programStart()
      } else {
        console.log('Employee Added')
      }
      programRestarter();
    })
  }
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

