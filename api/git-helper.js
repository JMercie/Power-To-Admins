/**
 * @author JMercie
 * @date 2021-06-20
 * @description handleSuccess -> This functions responsibility is to avoid many try/catch blocks per use in promises.
 * @param {Promise} operation -> Running task for the git binary that we're executing at the moment.
 * @returns {Array} -> Returns data (stdout) in case of success an stderr in case of failure
 * @LastModifiedDate 2021-06-20
 */
export const handleSuccess = async (operation) => {
  const data = await operation.catch (error => {
    console.error({error});
    return [null, error];
  });
  return [data, null];
};
