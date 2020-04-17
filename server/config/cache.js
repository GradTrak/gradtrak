const redisCache = require('express-redis-cache');

const cache = redisCache({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  auth_pass: process.env.REDIS_PASSWORD || '',
});

module.exports.cache = cache;
