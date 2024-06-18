import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const collection = await dbClient.db.collection('users');
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Already exists' });
    }
    const hashedPassword = sha1(password);
    const newUser = await collection.insertOne({
      email,
      password: hashedPassword,
    });

    const { _id } = newUser.ops[0];
    return res.status(201).json({ email, id: _id });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const collection = dbClient.db.collection('users');
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ email: user.email, id: user._id });
  }
}

export default UsersController;
