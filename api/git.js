import os from 'os';
import * as path from 'path';
import { execSync } from 'child_process';
import { handleSuccess } from './git-helper.js';
import simpleGit from 'simple-git';

const options = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6
};
const git = simpleGit(options);

/**
 * @description -> This function is use to create a directory in the users home and initialize a
 * git repository on it plus create a sfdx project from scratch.
 * @param {String} name -> Name of the directory the user is creating.
 * @param {String} result ->  success message.
 * @returns {Response} res -> instance of response object with info about outcome of this function.
 */
export const initNewRepo = async (projectName, directory) => {
  directory ??= os.homedir();

  execSync(
    `sfdx force:project:create -t standard -x -n ${projectName}`,
    {
      cwd: directory,
      shell: true,
      stdio: 'inherit'
    },
    (error, _stdout, stderr) => {
      if (error) {
        console.error(error);
        return;
      }

      if (stderr) {
        console.error(stderr);
      }
    }
  );

  execSync(
    'git init',
    {
      cwd: `${directory}/${projectName}`,
      shell: true,
      stdio: 'inherit'
    },
    (error, _stdout, stderr) => {
      if (error) {
        console.error(error);
        return;
      }

      if (stderr) {
        console.error(stderr);
      }
    }
  );
};

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
    `find ${name} -name "sfdx-project.json"`,
    (error, _stdout, stderr) => {
      if (error || stderr) {
        console.log(`exec error: ${error}`);
        console.log(stderr);
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
    (error, _stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return false;
      }

      if (stderr) console.error(stderr);
    }
  );

  return true;
};

/**
 * @description addToRepo  -> method is used to stage the desire files in order to commit them.
 * @param {String[]} files -> Is an array of files that we want to stage, if empty all tracked changes are being stage
 * @param {String} workingDir -> Working directory where we perform this operation.
 *  This value must be provided by the UI where its controlled in which repository we're working.
 * @returns Data or Error -> String with info about the running process
 */
export const addToRepo = async (files, workingDir) => {
  files ??= './*';
  options.baseDir = workingDir ? workingDir : '';
  if (!options.baseDir) {
    return;
  }

  // We dont return data here because in a succesfull operation the simpleGit.add() method returns undefined.
  const { _data, error } = await handleSuccess(git.add(files));
  if (error) return error;
};

export const commit = async (message, files = ['']) => {};
