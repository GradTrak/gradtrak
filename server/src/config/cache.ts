import redisCache from 'express-redis-cache';

import { client } from './redis';

export const cache = redisCache({
  client,
});

let cacheConnRefused = false;

cache.on('error', (err) => {
  if (err.code !== 'ECONNREFUSED' || !cacheConnRefused) {
    console.error(err);
    cacheConnRefused = true;
  }
});
