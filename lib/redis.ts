import { createClient, type RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL;

const globalForRedis = globalThis as typeof globalThis & {
  redisClient?: RedisClientType;
  redisConnection?: Promise<RedisClientType | null>;
  redisUnavailable?: boolean;
};

export async function getRedis(): Promise<RedisClientType | null> {
  if (globalForRedis.redisUnavailable) {
    return null;
  }

  if (!globalForRedis.redisClient) {
    const client = createClient({ url: redisUrl, socket: { reconnectStrategy: () => false } });
    client.on('error', (error) => {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('Redis unavailable:', error.message);
      }
    });
    globalForRedis.redisClient = client;
  }

  if (!globalForRedis.redisClient.isOpen) {
    globalForRedis.redisConnection ??= globalForRedis.redisClient.connect()
      .then(() => globalForRedis.redisClient!)
      .catch((error) => {
        globalForRedis.redisUnavailable = true;
        if (process.env.NODE_ENV !== 'test') {
          console.warn('Redis connection skipped:', error.message);
        }
        return null;
      });
    const client = await globalForRedis.redisConnection;
    if (!client) {
      return null;
    }
  }

  return globalForRedis.redisClient;
}

export async function deleteCache(key: string) {
  try {
    const redis = await getRedis();
    if (!redis) return;
    await redis.del(key);
  } catch (error) {
    console.warn('Redis cache invalidation skipped:', error);
  }
}
