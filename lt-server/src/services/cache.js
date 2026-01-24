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
        if (!Config.CACHE_ENABLED) {
            logger.info('Cache is disabled via CACHE_ENABLED environment variable');
            console.log('Cache is disabled via CACHE_ENABLED environment variable');
            return;
        }

        try {
            logger.info('Initializing Redis client', { host: Config.REDIS_HOST, port: Config.REDIS_PORT });
            console.log(`Initializing Redis client at ${Config.REDIS_HOST}:${Config.REDIS_PORT}`);

            this.client = createClient({
                url: `redis://${Config.REDIS_HOST}:${Config.REDIS_PORT}`,
            });

            this.client.on('error', (err) => {
                logger.error('Redis connection error', { error: err.message });
                console.log('Redis connection error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                logger.info('Successfully connected to Redis', { host: Config.REDIS_HOST, port: Config.REDIS_PORT });
                console.log('Successfully connected to Redis');
                this.isConnected = true;
            });

            this.client.on('disconnect', () => {
                logger.warn('Redis client disconnected');
                console.log('Redis client disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
        } catch (error) {
            logger.error('Failed to initialize Redis client', { error: error.message, stack: error.stack });
            console.log('Failed to initialize Redis client:', error);
            this.isConnected = false;
        }
    }

    async set(key, data, expireTime = null) {
        if (!Config.CACHE_ENABLED) {
            return false;
        }

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

    async get(key) {
        if (!Config.CACHE_ENABLED) {
            return null;
        }

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

    async del(key) {
        if (!Config.CACHE_ENABLED) {
            return false;
        }

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
}

const cacheService = new CacheService();

module.exports = { cacheService };
