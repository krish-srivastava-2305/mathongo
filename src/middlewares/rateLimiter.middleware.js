import redis from "../configure/redis.configure.js";


// Rate Limiter Middleware
// This middleware limits the number of requests a user can make to the server within a specified time window.
const rateLimiter = async (req, res, next) => {
  /*
    Defining the rate limit parameters:
    - key: Unique identifier for the user based on their IP address.
    - limit: Maximum number of requests allowed within the time window.
    - window: Time window in seconds during which the requests are counted. 
  */
  const key = `rate_limit:${req.ip}`;
  const limit = 30; 
  const window = 60;
  
  
  // Fetch the current token count and timestamp from Redis
  const tokenTimeStr = await redis.get(key);

  // If no record exists, initialize it with the maximum allowed tokens and current timestamp
  // This means the user has not made any requests yet.
  if (!tokenTimeStr) {
    await redis.set(key, `${limit - 1}-${Date.now()}`);
    return next();
  }

  // If a record exists, parse the remaining tokens and the last request timestamp
  const [remTokensStr, lastTimeStr] = tokenTimeStr.split("-");
  let remTokens = Number(remTokensStr);
  const lastTime = Number(lastTimeStr);

  // Calculate the time remaining since the last request
  // This is used to determine if the user can make another request within the allowed time window.
  const timeRem = (Date.now() - lastTime) / 1000; 

  // If the time since the last request exceeds the window, reset the token count to limit - 1
  if (timeRem > window) {
    remTokens = limit - 1;
  } else {
    if (remTokens <= 0) {
      return res.status(429).json({ message: "Too many requests", status: 429 });
    }
    remTokens -= 1;
  }

  // Update the Redis store with the new token count and current timestamp
  await redis.set(key, `${remTokens}-${Date.now()}`);
  next();
};

export default rateLimiter;
