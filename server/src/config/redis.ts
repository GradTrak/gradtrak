import redis from 'redis';

export const client = redis.createClient(process.env.REDIS_URL);
