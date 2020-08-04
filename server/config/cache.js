const redisCache = require('express-redis-cache');

const { client } = require('./redis');

const cache = redisCache({
  client,
});
let cacheConnRefused = false;

cache.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED' || !cacheConnRefused) {
    console.error(err);
    cacheConnRefused = true;
  }
});

module.exports.cache = cache;
