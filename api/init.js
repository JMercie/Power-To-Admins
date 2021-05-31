import os from 'os';
import { spawn, execSync } from 'child_process';
import * as path from 'path';

/**
 * @description -> This object is used to wrap response data to identify whether or not the function succeed.
 * defaults to unsuccessful operation.
 */
const RESPONSE = {
  code: -1,
  status: 'Error',
  error: true
};

/**
 * @description -> This function is use to create a directory in the users home and initialize a
 * git repository on it plus create a sfdx project from scratch.
 * @param {String} name -> Name of the directory the user is creating.
 * @param {String} result ->  success message.
 * @returns {Response} res -> instance of response object with info about outcome of this function.
 */
export const initNewRepo = async (projectName, directory) => {
  const res = RESPONSE;
  directory ??= os.homedir();

  const createSFDX = spawn(
    `sfdx force:project:create -t standard -x -n ${projectName}`,
    {
      cwd: directory,
      shell: true,
      stdio: 'inherit'
    }
  );
  const gitInit = spawn('git init', {
    cwd: `${directory}/${projectName}`,
    shell: true,
    stdio: 'inherit'
  });

  if (createSFDX.stderr && gitInit.stderr) {
    console.error(createSFDX.stderr);
    return res;
  }

  res.code = 0;
  res.status = 'Success';
  res.error = false;
  return res;
};

initNewRepo('test', '/Users/jmercie/dev/github/')
  .then((res) => {
    console.log({ res });
  })
  .catch((err) => {
    console.error({ err });
  });

/**
 * @description This method look recursively around a given path (default is user home directory) and return a list with
 * the paths that meet the criteria.
 * @param {String} name -> name of the directory where you want to find git repositories.
 * @returns {Response} res -> instance of response object with info about outcome of this function.
 */
export const openExistingSFDXProject = async (name) => {
  name ??= os.homedir();
  let output = [];

  // here we look for folders that contains a file with name: sfdx-project.json. Because is mandatory for every local sfdx project.
  const matches = execSync(
    `find ${dirName} -name "sfdx-project.json"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`spawn error: ${error}`);
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
 * @description cloneRepo handle the successful clone of a git remote repository. Currently just work for public repositories.
 * @returns {Response} res -> instance of response object with info about outcome of this function.
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
        console.error(`spawn error: ${error}`);
        return false;
      }
    }
  );

  return true;
};

//TODO make a response handler to be more DRY.
