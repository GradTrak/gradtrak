const redis = require('redis');

module.exports.client = redis.createClient(process.env.REDIS_URL);
