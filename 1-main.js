import dbClient from './utils/db';

const waitConnection = () => {
  return new Promise((resolve, reject) => {
    let i = 0;
    const repeatFct = () => {
      setTimeout(() => {
        i += 1;
        if (i >= 10) {
          reject(new Error('Unable to connect to the database'));
        } else if (!dbClient.isAlive()) {
          repeatFct();
        } else {
          resolve();
        }
      }, 1000);
    };
    repeatFct();
  });
};

(async () => {
  console.log('Is DB alive initially:', dbClient.isAlive());
  try {
    await waitConnection();
    console.log('Is DB alive after wait:', dbClient.isAlive());
    console.log('Number of users:', await dbClient.nbUsers());
    console.log('Number of files:', await dbClient.nbFiles());
  } catch (err) {
    console.error('Error during database operations:', err.message);
  }
})();
