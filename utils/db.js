import { MongoClient } from 'mongodb';

class DBClient {
  /*
   * constructor for the DBClient class.
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const dbName = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${dbName}`;
    this.client = new MongoClient(url, {
      useUnifiedTopology: true,
    });

    this.client
      .connect()
      .then(() => {
        this.db = this.client.db(dbName);
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        this.db = null;
      });
  }

  /*
   * Checks if the MongoDB client is connected.
   *
   * @return {boolean} True if connected, false otherwise
   */
  isAlive() {
    return this.client.isConnected();
  }

  /*
   * Asynchronously retrieves the number of users in the 'users' collection
   *
   * @return {Promise<number|null>} The number of files, or null if the
   *           database is not connected.
   */
  async nbUsers() {
    if (!this.db) {
      return null;
    }
    const result = await this.db.collection('users').countDocuments();
    return result;
  }

  /*
   * Asynchronously retrieves the number of files in the 'files' collection
   *
   * @return {Promise<number|null>} The number of files, or null if the
   *           database is not connected.
   */
  async nbFiles() {
    if (!this.db) {
      return null;
    }
    const result = await this.db.collection('files').countDocuments();
    return result;
  }
}

const dbClient = new DBClient();
export default dbClient;
