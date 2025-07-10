const { createClient } = require('redis');
const Config = require('../config');

class CacheService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.init();
    }

    async init() {
        try {
            this.client = createClient({
                url: `redis://${Config.REDIS_HOST}:${Config.REDIS_PORT}`,
            });

            this.client.on('error', (err) => {
                console.error('Redis connection error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('Successfully connected to Redis');
                this.isConnected = true;
            });

            await this.client.connect();
        } catch (error) {
            console.error('Failed to initialize Redis client:', error);
            this.isConnected = false;
        }
    }

    /**
     * Store data in the cache
     * @param {string} key - The cache key
     * @param {any} data - The data to store
     * @param {number} expireTime - Time in seconds after which the key will expire (optional)
     * @returns {Promise<boolean>} - Success status
     */
    async set(key, data, expireTime = null) {
        if (!this.isConnected) return false;

        try {
            const serializedData = JSON.stringify(data);
            if (expireTime) {
                await this.client.set(key, serializedData, { EX: expireTime });
            } else {
                await this.client.set(key, serializedData);
            }
            return true;
        } catch (error) {
            console.error(`Error setting cache for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Store data in a hash
     * @param {string} hashKey - The hash key
     * @param {string} field - The field in the hash
     * @param {any} data - The data to store
     * @returns {Promise<boolean>} - Success status
     */
    async hset(hashKey, field, data) {
        if (!this.isConnected) return false;

        try {
            const serializedData = JSON.stringify(data);
            await this.client.hSet(hashKey, field, serializedData);
            return true;
        } catch (error) {
            console.error(`Error setting hash cache for key ${hashKey}:${field}:`, error);
            return false;
        }
    }

    /**
     * Retrieve data from the cache
     * @param {string} key - The cache key
     * @returns {Promise<any>} - The cached data or null if not found
     */
    async get(key) {
        if (!this.isConnected) return null;

        try {
            const data = await this.client.get(key);
            if (!data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error getting cache for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Retrieve data from a hash
     * @param {string} hashKey - The hash key
     * @param {string} field - The field in the hash
     * @returns {Promise<any>} - The cached data or null if not found
     */
    async hget(hashKey, field) {
        if (!this.isConnected) return null;

        try {
            const data = await this.client.hGet(hashKey, field);
            if (!data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error getting hash cache for key ${hashKey}:${field}:`, error);
            return null;
        }
    }

    /**
     * Delete a specific key from cache
     * @param {string} key - The cache key to delete
     * @returns {Promise<boolean>} - Success status
     */
    async del(key) {
        if (!this.isConnected) return false;

        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error(`Error deleting cache for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Delete a hash key from cache
     * @param {string} hashKey - The hash key to delete
     * @returns {Promise<boolean>} - Success status
     */
    async delHash(hashKey) {
        if (!this.isConnected) return false;

        try {
            await this.client.del(hashKey);
            return true;
        } catch (error) {
            console.error(`Error deleting hash cache for key ${hashKey}:`, error);
            return false;
        }
    }

    /**
     * Clear all cache
     * @returns {Promise<boolean>} - Success status
     */
    async flushAll() {
        if (!this.isConnected) return false;

        try {
            await this.client.flushAll();
            return true;
        } catch (error) {
            console.error('Error flushing all cache:', error);
            return false;
        }
    }
}

const cacheService = new CacheService();

module.exports = {
    cacheService,
    clearCache: async (hashKey) => await cacheService.delHash(hashKey),
};
