import * as RedisClient from "ioredis";

export const Redis = () => {
  const url = process.env.REDIS_URL;
  return new RedisClient(url);
};
