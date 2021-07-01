'use strict';
import { execSync } from 'child_process';
import os from 'os';
import * as path from 'path';

/**
 * @author JMercie
 * @date 2021-06-24
 * @description
 * @param {any} projectName
 * @param {any} directory
 * @returns {any}
 * @LastModifiedDate 2021-06-21
 */
export const sf_newProject = async (projectName, directory) => {
  execSync(
    `sfdx force:project:create -t standard -x -n ${projectName}`,
    {
      cwd: directory,
      shell: true,
      stdio: 'inherit'
    },
    (error, _stdout, stderr) => {
      if (error) {
        return error;
      }
      if (stderr) {
        console.error(stderr);
      }
    }
  );
};

/**
 * @author JMercie
 * @date 2021-05-20
 * @description This method look recursively around a given path (default is user home directory) and return a list with
 * the paths that meet the criteria.
 * @param {String} name -> name of the directory where you want to find git repositories.
 * @returns {Response} res -> instance of response object with info about outcome of this function.
 * @LastModifiedDate 2021-06-24
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
