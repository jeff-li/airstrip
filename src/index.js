#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var inquirer = require("inquirer");
var CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));
var QUESTIONS = [
    {
        name: 'template',
        type: 'list',
        message: 'What project template would you like to use?',
        choices: CHOICES
    },
    {
        name: 'name',
        type: 'input',
        message: 'New project name?'
    }
];
inquirer.prompt(QUESTIONS)
    .then(function (answers) {
    console.log(answers);
});
