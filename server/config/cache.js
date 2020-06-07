const redis = require('redis');
const redisCache = require('express-redis-cache');

const cache = redisCache({
  client: redis.createClient(process.env.REDIS_URL),
});
let cacheConnRefused = false;

cache.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED' || !cacheConnRefused) {
    console.error(err);
    cacheConnRefused = true;
  }
});

module.exports.cache = cache;
