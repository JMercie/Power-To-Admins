import * as fs from 'fs/promises';
import * as os from 'os';
import * as childProcess from 'child_process';
import * as path from 'path';

/**
 * @description -> This function is use to create a directory in the users home and initialize a
 * git repository on it.
 * @param {String} name -> Name of the directory the user is creating.
 */
const initNewRepo = async (name) => {
  try {
    const initDir = await fs.mkdir(`${os.homedir()}/${name}`, {
      recursive: true
    });

    await childProcess.exec('git init', {
      cwd: initDir
    });

    console.log(`succesfully create git repository at path: ${initDir}`);
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
const openExistingRepo = async (name) => {
  const dirName = name ? name : os.homedir(); // TODO : sanitize user input to avoid weird system injections or invalid paths
  let gitPaths = [];

  const getGitRepos = childProcess.execSync(
    `find ${dirName} -name ".git"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    }
  );
  gitPaths = getGitRepos.toString().split('\n');

  //TODO : find how to search for every sfdx project.
  gitPaths.forEach((path) => {
    console.log(
      childProcess
        .execSync(`find ${path} -name "force-app"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
        })
        .toString()
    );
  });

  return gitPaths;
};

openExistingRepo();
