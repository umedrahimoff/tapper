import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

export const redis = globalForRedis.redis ?? new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  // Отключаем Redis в development если не настроен
  ...(process.env.NODE_ENV === 'development' && !process.env.REDIS_HOST ? {
    host: 'localhost',
    port: 6379,
    connectTimeout: 1000,
    lazyConnect: true,
  } : {})
})

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

// Функция для безопасного получения данных из кэша
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.warn('Redis cache miss:', error)
    return null
  }
}

// Функция для безопасного сохранения в кэш
export async function setCached(key: string, data: any, ttlSeconds: number = 300): Promise<void> {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(data))
  } catch (error) {
    console.warn('Redis cache set error:', error)
  }
}

// Функция для удаления из кэша
export async function deleteCached(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.warn('Redis cache delete error:', error)
  }
}

// Функция для удаления по паттерну
export async function deleteCachedPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.warn('Redis cache pattern delete error:', error)
  }
}
