import { Redis } from 'ioredis';


/* 
  Redis Configuration
  This module sets up a connection to a Redis server using the ioredis library.
  The connection parameters can be configured via environment variables or default to localhost and port 6379.
*/
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

export default redis;