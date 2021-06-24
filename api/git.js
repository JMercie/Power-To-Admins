'use strict';
import os from 'os';
import * as path from 'path';
import simpleGit from 'simple-git';
import { handleError, handleSuccess } from './git-helper.js';
import {sf_newProject} from './sfdx.js'

/**
 * @author JMercie
 * @date 2021-05-20
 * @description this objects is used to configure how the simple-git task will run and perform.
 * @LastModifiedDate 2021-06-24
 */
const options = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  timeout: {
    block: 2000
  }
};

/**
 * @author JMercie
 * @date 2021-06-21
 * @param {Partial<SimpleGitOptions>} options -> Base options for the git binary to run
 * @returns {SimpleGit} -> Create simpleGit instance.
 * @LastModifiedDate 2021-06-21
 */
const git = simpleGit(options);

/**
 * @author JMercie
 * @date 2021-05-20
 * @description -> This function is use to create a directory in the users home and initialize a
 * git repository on it plus create a sfdx project from scratch.
 * @param {String} projectName -> Name of the project the user is creating.
 * @param {String} directory -> Name of the directory the user is creating.
 * @returns {Result || Error}  Stdout or Stderr of any of the child process being executed.
 * @LastModifiedDate 2021-06-24.
 */
export const init = async (projectName = 'awesome sfdx project', directory) => {
  directory ??= os.homedir();
  await sf_newProject(projectName, directory).catch(err =>  err);
  
  options.baseDir = path.join(directory, projectName);
  const {data, error} = await git.checkIsRepo()
    .then( isRepo => {
      if (!isRepo) {
       return git.init(options, handleSuccess)
      }
      return;
    }).catch(handleError);
  
    return data ?? error;
};

/**
 * @author JMercie
 * @date 2021-05-20
 * @description cloneRepo handle the successful clone of a git remote repository. Currently just work for public repositories.
 * @param {String} repoName -> Remote repository name that the user wants to clone.
 * @param {String} directory -> Target directory where we can clone the repository.
 * @returns {Result || GitError}  stdout in case of success or GitError in case of failure.
 * @LastModifiedDate 2021-06-24
 */
export const cloneRepo = async (repoName, directory) => {
  if (!repoName) {
    return;
  }
  options.baseDir = directory || os.homedir();
  const {data, error} =  await git.clone(repoName, options,handleSuccess).catch(handleError);
  return data ?? error;
};

/**
 * @author JMercie
 * @date 2021-06-20
 * @description addToRepo  Is used to stage the desire files in order to commit them.
 * @param {String[]} files  Is an array of files that we want to stage, if empty all tracked changes are being stage
 * @param {String} directory  Working directory where we perform this operation.
 *  This value must be provided by the UI where its controlled in which repository we're working.
 * @returns {Result || GitError}  String with info about the running process.
 * @LastModifiedDate 2021-06-24
 */
export const addToRepo = async (files = './*', directory) => {
  if (!directory) {
    return;
  }
  options.baseDir = directory;
  const { data, error } = await git
    .add(files, handleSuccess)
    .catch(handleError);
  return data ?? error;
};

/**
 * @author JMercie
 * @date 2021-06-20
 * @description commit -> This will commit al staged files in the current working directory.
 * @param {String} message -> Commit message that the user choose for his commit.
 * @returns {Result || GitError} -> String with info about the running process
 * @LastModifiedDate 2021-06-24
 * */
export const commit = async (
  message = 'Commit message provided by Power-To-Admins'
) => {
  const { data, error } = await git
    .commit(message, handleSuccess)
    .catch(handleError);
  return data ?? error;
};

/**
 * @author JMercie
 * @date 2021-06-20
 * @description This function allow to add a remote Repository.
 * @param {String} remoteName='origin' -> Name of the remote repository
 * @param {String} remoteRepo -> URL of the remote repository.
 * @returns {Result || GitError} -> String with info about the running process.
 * @LastModifiedDate 2021-06-24.
 */
export const addRemote = async (remoteName = 'origin', remoteRepo) => {
  if (remoteRepo) return 'No remote URL was provided.';

  const { data, error } = await git
    .addRemote(remoteName, remoteRepo, handleSuccess)
    .catch(handleError);
  return data ?? error;
};

/**
 * @author JMercie
 * @date 2021-06-21
 * @description This allow os to push to a remote repository our local changes.
 * @param {String} remoteName='origin' -> Name of the remote repository where we are pushing changes.
 * @param {String} branch -> Name of the branch in the remote repository.
 * @returns {Result || GitError} -> Returns stdout when successful or GitError if fails.
 * @LastModifiedDate 2021-06-24.
 */
export const push = async (remoteName = 'origin', branch) => {
  const { data, error } = await git
    .push(remoteName, branch, handleSuccess)
    .catch(handleError);
  return data ?? error;
};

/**
 * @author JMercie
 * @date 2021-06-21
 * @description This function allow us to fetch changes of the current remote repository.
 * @returns {Result || GitError} Returns stdout when successful or GitError if fails.
 * @LastModifiedDate 2021-06-24.
 */
export const fetch = async () => {
  const { data, error } = await git.fetch(handleSuccess).catch(handleError);
  return data ?? error;
};
