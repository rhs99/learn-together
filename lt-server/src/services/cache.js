// const mongoose = require('mongoose');
// const { createClient } = require('redis');
// const Config = require('../config');

// let redisClient;

// (async () => {
//     redisClient = await createClient({
//         url: `redis://${Config.REDIS_HOST}:${Config.REDIS_PORT}`,
//     })
//         .on('error', (err) => console.log(err))
//         .connect();
// })();

// const exec = mongoose.Query.prototype.exec;

// mongoose.Query.prototype.cache = function (options = {}) {
//     this.useCache = true;
//     this.hashKey = JSON.stringify(options.key || '');
//     return this;
// };

// mongoose.Query.prototype.exec = async function () {
//     if (!this.useCache) {
//         return exec.apply(this, arguments);
//     }

//     const key = JSON.stringify(
//         Object.assign({}, this.getQuery(), {
//             collection: this.mongooseCollection.name,
//         }),
//     );

//     const cachedValue = await redisClient.HGET(this.hashKey, key);

//     if (cachedValue) {
//         const doc = JSON.parse(cachedValue);
//         return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
//     }

//     const result = await exec.apply(this, arguments);
//     await redisClient.HSET(this.hashKey, key, JSON.stringify(result));

//     return result;
// };

// const clearCache = async (hashKey) => {
//     await redisClient.del(JSON.stringify(hashKey));
// };

// module.exports = {
//     clearCache,
// };
