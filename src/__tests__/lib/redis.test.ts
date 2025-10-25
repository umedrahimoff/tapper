import { getCached, setCached, deleteCached, deleteCachedPattern } from '@/lib/redis'

// Mock Redis
jest.mock('ioredis', () => {
  const mockRedis = {
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  }
  return jest.fn(() => mockRedis)
})

describe('Redis Cache Functions', () => {
  let mockRedis: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockRedis = require('ioredis')()
  })

  describe('getCached', () => {
    it('should return parsed data when cache hit', async () => {
      const mockData = { id: '1', name: 'Test' }
      mockRedis.get.mockResolvedValue(JSON.stringify(mockData))

      const result = await getCached('test-key')

      expect(result).toEqual(mockData)
      expect(mockRedis.get).toHaveBeenCalledWith('test-key')
    })

    it('should return null when cache miss', async () => {
      mockRedis.get.mockResolvedValue(null)

      const result = await getCached('test-key')

      expect(result).toBeNull()
    })

    it('should return null and log error when Redis fails', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      mockRedis.get.mockRejectedValue(new Error('Redis connection failed'))

      const result = await getCached('test-key')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Redis cache miss:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('setCached', () => {
    it('should set data with default TTL', async () => {
      const mockData = { id: '1', name: 'Test' }
      mockRedis.setex.mockResolvedValue('OK')

      await setCached('test-key', mockData)

      expect(mockRedis.setex).toHaveBeenCalledWith('test-key', 300, JSON.stringify(mockData))
    })

    it('should set data with custom TTL', async () => {
      const mockData = { id: '1', name: 'Test' }
      mockRedis.setex.mockResolvedValue('OK')

      await setCached('test-key', mockData, 600)

      expect(mockRedis.setex).toHaveBeenCalledWith('test-key', 600, JSON.stringify(mockData))
    })

    it('should log error when Redis fails', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      mockRedis.setex.mockRejectedValue(new Error('Redis connection failed'))

      await setCached('test-key', { data: 'test' })

      expect(consoleSpy).toHaveBeenCalledWith('Redis cache set error:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('deleteCached', () => {
    it('should delete single key', async () => {
      mockRedis.del.mockResolvedValue(1)

      await deleteCached('test-key')

      expect(mockRedis.del).toHaveBeenCalledWith('test-key')
    })

    it('should log error when Redis fails', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      mockRedis.del.mockRejectedValue(new Error('Redis connection failed'))

      await deleteCached('test-key')

      expect(consoleSpy).toHaveBeenCalledWith('Redis cache delete error:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('deleteCachedPattern', () => {
    it('should delete keys matching pattern', async () => {
      mockRedis.keys.mockResolvedValue(['key1', 'key2'])
      mockRedis.del.mockResolvedValue(2)

      await deleteCachedPattern('test:*')

      expect(mockRedis.keys).toHaveBeenCalledWith('test:*')
      expect(mockRedis.del).toHaveBeenCalledWith('key1', 'key2')
    })

    it('should handle empty keys array', async () => {
      mockRedis.keys.mockResolvedValue([])

      await deleteCachedPattern('test:*')

      expect(mockRedis.keys).toHaveBeenCalledWith('test:*')
      expect(mockRedis.del).not.toHaveBeenCalled()
    })

    it('should log error when Redis fails', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      mockRedis.keys.mockRejectedValue(new Error('Redis connection failed'))

      await deleteCachedPattern('test:*')

      expect(consoleSpy).toHaveBeenCalledWith('Redis cache pattern delete error:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})
