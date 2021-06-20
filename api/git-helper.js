import simpleGit from 'simple-git';
const git = simpleGit();

export const handleSuccess = async (operation) => {
  try {
    const data = await operation;
    return [data, null];
  } catch (error) {
    console.error(error);
    return [null, error.git.conflicts.length];
  }
};
