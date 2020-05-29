const redis = require('redis');
const redisCache = require('express-redis-cache');

const cache = redisCache({
  client: redis.createClient(process.env.REDIS_URL),
});
cache.on('error', () => {});

module.exports.cache = cache;
