const { createClient } = require('redis');
const Config = require('../config');
const logger = require('../config/logger');

class CacheService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.init();
    }

    async init() {
        try {
            logger.info('Initializing Redis client', { host: Config.REDIS_HOST, port: Config.REDIS_PORT });

            this.client = createClient({
                url: `redis://${Config.REDIS_HOST}:${Config.REDIS_PORT}`,
            });

            this.client.on('error', (err) => {
                logger.error('Redis connection error', { error: err.message });
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                logger.info('Successfully connected to Redis', { host: Config.REDIS_HOST, port: Config.REDIS_PORT });
                this.isConnected = true;
            });

            this.client.on('disconnect', () => {
                logger.warn('Redis client disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
        } catch (error) {
            logger.error('Failed to initialize Redis client', { error: error.message, stack: error.stack });
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
        if (!this.isConnected) {
            logger.warn('Attempted to set cache while Redis is disconnected', { key });
            return false;
        }

        try {
            const serializedData = JSON.stringify(data);
            if (expireTime) {
                await this.client.set(key, serializedData, { EX: expireTime });
                logger.debug('Cache set with expiration', { key, expireTime, dataSize: serializedData.length });
            } else {
                await this.client.set(key, serializedData);
                logger.debug('Cache set', { key, dataSize: serializedData.length });
            }
            return true;
        } catch (error) {
            logger.error('Error setting cache', { key, error: error.message });
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
        if (!this.isConnected) {
            logger.warn('Attempted to set hash cache while Redis is disconnected', { hashKey, field });
            return false;
        }

        try {
            const serializedData = JSON.stringify(data);
            await this.client.hSet(hashKey, field, serializedData);
            logger.debug('Hash cache set', { hashKey, field, dataSize: serializedData.length });
            return true;
        } catch (error) {
            logger.error('Error setting hash cache', { hashKey, field, error: error.message });
            return false;
        }
    }

    /**
     * Retrieve data from the cache
     * @param {string} key - The cache key
     * @returns {Promise<any>} - The cached data or null if not found
     */
    async get(key) {
        if (!this.isConnected) {
            logger.warn('Attempted to get cache while Redis is disconnected', { key });
            return null;
        }

        try {
            const data = await this.client.get(key);
            if (!data) {
                logger.debug('Cache miss', { key });
                return null;
            }
            logger.debug('Cache hit', { key, dataSize: data.length });
            return JSON.parse(data);
        } catch (error) {
            logger.error('Error getting cache', { key, error: error.message });
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
        if (!this.isConnected) {
            logger.warn('Attempted to get hash cache while Redis is disconnected', { hashKey, field });
            return null;
        }

        try {
            const data = await this.client.hGet(hashKey, field);
            if (!data) {
                logger.debug('Hash cache miss', { hashKey, field });
                return null;
            }
            logger.debug('Hash cache hit', { hashKey, field, dataSize: data.length });
            return JSON.parse(data);
        } catch (error) {
            logger.error('Error getting hash cache', { hashKey, field, error: error.message });
            return null;
        }
    }

    /**
     * Delete a specific key from cache
     * @param {string} key - The cache key to delete
     * @returns {Promise<boolean>} - Success status
     */
    async del(key) {
        if (!this.isConnected) {
            logger.warn('Attempted to delete cache while Redis is disconnected', { key });
            return false;
        }

        try {
            await this.client.del(key);
            logger.debug('Cache key deleted', { key });
            return true;
        } catch (error) {
            logger.error('Error deleting cache', { key, error: error.message });
            return false;
        }
    }

    /**
     * Delete a hash key from cache
     * @param {string} hashKey - The hash key to delete
     * @returns {Promise<boolean>} - Success status
     */
    async delHash(hashKey) {
        if (!this.isConnected) {
            logger.warn('Attempted to delete hash cache while Redis is disconnected', { hashKey });
            return false;
        }

        try {
            await this.client.del(hashKey);
            logger.debug('Hash cache key deleted', { hashKey });
            return true;
        } catch (error) {
            logger.error('Error deleting hash cache', { hashKey, error: error.message });
            return false;
        }
    }

    /**
     * Clear all cache
     * @returns {Promise<boolean>} - Success status
     */
    async flushAll() {
        if (!this.isConnected) {
            logger.warn('Attempted to flush all cache while Redis is disconnected');
            return false;
        }

        try {
            await this.client.flushAll();
            logger.info('All cache flushed successfully');
            return true;
        } catch (error) {
            logger.error('Error flushing all cache', { error: error.message });
            return false;
        }
    }
}

const cacheService = new CacheService();

module.exports = {
    cacheService,
    clearCache: async (hashKey) => await cacheService.delHash(hashKey),
};
