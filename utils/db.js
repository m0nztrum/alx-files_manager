import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const dbName = process.env.DB_DATABASE || 'file_manager';
    const url = `mongodb://${host}:${port}/${dbName}`;
    this.client = new MongoClient(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    this.client
      .connect()
      .then(() => {
        this.db = this.client.db(dbName);
      })
      .catch((err) => {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        this.db = null;
      });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async getUser(query) {
    console.log('QUERY IN DB.JS', query);
    const user = await this.db.collection('users').findOne(query);
    console.log('GET USER IN DB.JS', user);
    return user;
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
