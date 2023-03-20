import 'reflect-metadata';
import Database from './database';
import app from './app';

const database = new Database();

const port = app.get('port');

/**
 * Database connection when app run
 * It call Databse API Service which connects the Databse from the credentials given.
 */
(async function () {
  try {
    await database.connect();
    app.listen(port, () => {
      console.info(`Server started - PORT: ${port}`);
    });
  } catch (error) {
    console.log('Unable to connect to database. ', error);
  }
})();

process.on('SIGINT', async () => {
  console.info('Gracefully shutting down');
  await database.disConnect();
});
