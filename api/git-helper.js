'use strict';

/**
 * @author JMercie
 * @date 2021-06-20
 * @description handleSuccess -> Trailing callback function to handle success of git tasks.
 * @param {Error} err -> fatal error of the current task being run by the git binary.
 * @param {Result} taskResult -> result (stdout) of the current task. Can be a string, a stream or undefined.
 * @returns {[Result || GitError]} -> Returns data (stdout) in case of success and stderr in case of failure
 * @LastModifiedDate 2021-06-24
 */
export const handleSuccess = async (err, taskResult) => {
  if (err.message || err.git) {
    return [null, err.message || String(err.git)];
  }
  return [taskResult, null];
};

/**
 * @author JMercie
 * @date 2021-06-24
 * @description handleError -> To be called inside the catch() of the git promise.
 * @param {GitError} gitError -> fatal error returned by the git task.
 * @returns {GitError}
 * @LastModifiedDate 2021-06-24
 */
export const handleError = async (gitError) => {
  return gitError;
};
