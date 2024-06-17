import { createClient } from 'redis';

class RedisClient {
    /*
     * Constructor for the redis client
     */

    constructor() {
        this.client = createClient();

        this.clientConnected = true;

        this.client.on('error', (err) => {
            console.log('Redis Client Error', err);
            this.clientConnected = false;
        });

        this.client.on('connect', () => {
            console.log('Redis Client Connected');
            this.clientConnected = true;
        });
    }

    /*
     * Returns a boolean indicating whether the Redis client is connected.
     *
     * @return {boolean} A boolean indicating Redis client is connected.
     */
    isAlive() {
        this.clientConnected;
    }

    /*
     * Retrieves the value associated with the specified key from the
     *          database
     *
     * @param {string} key - The key to retrieve the value for
     * @return {Promise} A promise that resolves with the val associated with
     *       the key, or rejects with an error.
     */
    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /*
     * Asynchronously sets the value of a key in the Redis database with
     *       an expiration time.
     *
     * @param {string} key - The key to set the value for
     * @param {any} value - The value to set the key for
     * @param {number} duration = The expiration time
     * @return {Promise} A promise that resolves when the key is successfully
     *       set, or rejects with an error.
     */
    async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, 'EX', duration, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Asynchronously deletes a key from the Redis database.
     *
     * @param {string} key - The key to delete.
     * @return {Promise} A Promise that resolves when the key is successfully
     *       deleted, or rejects with an error.
     */
    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

const redisClient = new RedisClient();
export default redisClient;
