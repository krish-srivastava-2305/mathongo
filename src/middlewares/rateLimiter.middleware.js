import { Redis } from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

const rateLimiter = async (req, res, next) => {
  const key = `rate_limit:${req.ip}`;
  const limit = 30; 
  const window = 60; 

  const tokenTimeStr = await redis.get(key);

  if (!tokenTimeStr) {
    await redis.set(key, `${limit - 1}-${Date.now()}`);
    return next();
  }

  const [remTokensStr, lastTimeStr] = tokenTimeStr.split("-");
  let remTokens = Number(remTokensStr);
  const lastTime = Number(lastTimeStr);

  const timeRem = (Date.now() - lastTime) / 1000; 

  if (timeRem > window) {
    remTokens = limit - 1;
  } else {
    if (remTokens <= 0) {
      return res.status(429).json({ message: "Too many requests", status: 429 });
    }
    remTokens -= 1;
  }

  await redis.set(key, `${remTokens}-${Date.now()}`);
  next();
};

export default rateLimiter;
