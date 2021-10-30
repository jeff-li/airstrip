#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as inquirer from "inquirer";
import chalk from "chalk";

export interface CliOptions {
  projectName: string;
  templateName: string;
  templatePath: string;
  targetPath: string;
}
const SKIP_FILES = ['node_modules'];

console.log(`
                    ___
                  / L|5 \\
                 /       \\
                /    |    \\
               /           \\
              /   __ |  _   \\
             /   __/     \\   \\
            /  /__   |   _\\_  \\
           /___________________\\
          /   /   /  |  \\   \\   \\
         /   /   /   |   \\   \\   \\
        ___________[_|_]___________`);

console.log(
  chalk.cyan(`
         _             _          _        
        (_)           | |        (_)       
   __ _  _  _ __  ___ | |_  _ __  _  _ __  
  / _\` || || '__|/ __|| __|| '__|| || '_ \\ 
 | (_| || || |   \\__ \\| |_ | |   | || |_) |
  \\__,_||_||_|   |___/ \\__||_|   |_|| .__/ 
                                    | |    
                                    |_|   
`)
);
const CHOICES = fs.readdirSync(path.join(__dirname, "runways"));

const validateProjectName = (input: string) => {
  if (!input) {
    return "";
  }
  if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
  else
    return "Project name may only include letters, numbers, underscores and hashes.";
};

const hasValidProjectPath = (projectPath: string) => {
  if (fs.existsSync(projectPath)) {
    console.log(
      chalk.red(`Folder ${projectPath} exists. Delete or use another name.`)
    );
    return false;
  }
  return true
};

const createDirectoryContents = (templatePath: string, projectName: string) => {
  // read all files/folders from template folder
  const filesToCreate = fs.readdirSync(templatePath);
  // go through each file/folder
  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    // skip files that should not be copied e.g. node_modules
    if (SKIP_FILES.indexOf(file) > -1) return;

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      const writePath = `${CURR_DIR}/${projectName}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");
      console.log(chalk.white(writePath));
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${projectName}/${file}`);

      // recursive call
      createDirectoryContents(
        `${templatePath}/${file}`,
        `${projectName}/${file}`
      );
    }
  });
};

const QUESTIONS = [
  {
    name: "runway",
    type: "list",
    message: "What runway would you like to use?",
    choices: CHOICES,
  },
  {
    name: "name",
    type: "input",
    message: "New project name?",
    validate: validateProjectName,
  },
];

const CURR_DIR = process.cwd();
inquirer
  .prompt(QUESTIONS)
  .then((answers) => {
    const runwayName = answers["runway"];
    const projectName = answers["name"];
    const templatePath = path.join(__dirname, "runways", runwayName);
    const targetPath = path.join(CURR_DIR, projectName);
    console.log(answers)
    console.log(chalk.green(`checking path...`))
    // make sure the new project folder does not already exist
    if (!hasValidProjectPath(targetPath)) return;
    // create the new directory
    fs.mkdirSync(targetPath);
    console.log(chalk.green(`${targetPath} has been created!`))
    // create all directories inside the new project folder
    console.log(chalk.green('Copying all files...'))
    createDirectoryContents(templatePath, projectName);
    console.log(chalk.green('Done!'))
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
