import redis from 'redis';

export const client = redis.createClient({
  url: process.env.REDIS_URL,
});
