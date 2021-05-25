import os from 'os';
import { exec, execSync } from 'child_process';
import { dirname } from 'path';

/**
 * @description -> This function is use to create a directory in the users home and initialize a
 * git repository on it plus create a sfdx project from scratch.
 * @param {String} name -> Name of the directory the user is creating.
 * @param {String} result ->  success message.
 */
export const initNewRepo = async (projectName, directory) => {
  try {
    const targetDir = directory ? directory : os.homedir();

    const sfProjectDir = exec(
      `sfdx force:project:create -t standard -x -n ${projectName}`,
      {
        cwd: targetDir,
        shell: true
      }
    );

    const initGitDir = exec(
      'git init',
      {
        cwd: `${targetDir}/${projectName}`,
        shell: true
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${stderr}`);
          return;
        }
        return stdout;
      }
    );

    return `successfully create git repository at path: ${directory}/${projectName}`;
  } catch (error) {
    console.error(error);
  }
};

/**
 * @description This method look recursively around a given path (default is user home directory) and return a list with
 * the paths that meet the criteria.
 * @param {String} name -> name of the directory where you want to find git repositories.
 * @returns {String[]} output -> list of paths that fullfil search criteria
 */
export const openExistingSFDXProject = async (name) => {
  name ??= os.homedir();
  let output = [];

  // here we look for folders that contains a file with name: sfdx-project.json. Because is mandatory for every local sfdx project.
  const matches = execSync(
    `find ${dirName} -name "sfdx-project.json"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    }
  )
    .toString()
    .split('\n');
  matches.pop(); // this will remove the last array item, which is a empty string.

  matches.forEach((data) => {
    output.push(path.posix.dirname(data));
  });

  return output.length > 0
    ? output
    : 'there is no SFDX projects in your machine, try create a new one!';
};

/**
 * @description cloneRepo handle the succesfull clone of a git remote repository. Currently just work for public repositories.
 * @return {Boolean} Returns true if operation succeed, false otherwise.
 */
export const cloneRepo = async (repoName, directory) => {
  execSync(
    `git clone ${repoName}`,
    {
      cwd: directory ? directory : os.homedir(),
      shell: true
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return false;
      }
    }
  );

  return true;
};
