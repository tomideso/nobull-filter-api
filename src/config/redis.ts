import * as RedisClient from 'ioredis'

export const Redis=()=>{
    const url =process.env.REDIS_URL || '';
    console.log(url,"kkk")
    return new RedisClient(url)
}
