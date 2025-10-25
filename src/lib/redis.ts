import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

// В development режиме отключаем Redis если не настроен
let redis: Redis | null = null

if (process.env.NODE_ENV === 'development' && !process.env.REDIS_HOST) {
  // В development без Redis - используем заглушку
  redis = null
} else {
  try {
    redis = globalForRedis.redis ?? new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 5000,
    })

    if (process.env.NODE_ENV !== 'production') {
      globalForRedis.redis = redis
    }
  } catch (error) {
    console.warn('Redis connection failed, using fallback:', error)
    redis = null
  }
}

export { redis }

// Функция для безопасного получения данных из кэша
export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) {
    return null // В development без Redis возвращаем null
  }
  
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
  if (!redis) {
    return // В development без Redis ничего не делаем
  }
  
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(data))
  } catch (error) {
    console.warn('Redis cache set error:', error)
  }
}

// Функция для удаления из кэша
export async function deleteCached(key: string): Promise<void> {
  if (!redis) {
    return // В development без Redis ничего не делаем
  }
  
  try {
    await redis.del(key)
  } catch (error) {
    console.warn('Redis cache delete error:', error)
  }
}

// Функция для удаления по паттерну
export async function deleteCachedPattern(pattern: string): Promise<void> {
  if (!redis) {
    return // В development без Redis ничего не делаем
  }
  
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.warn('Redis cache pattern delete error:', error)
  }
}
