import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/links/route'
import { prisma } from '@/lib/prisma'
import { getCached, setCached, deleteCached } from '@/lib/redis'

// Mock dependencies
jest.mock('@/lib/prisma')
jest.mock('@/lib/redis')
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGetCached = getCached as jest.MockedFunction<typeof getCached>
const mockSetCached = setCached as jest.MockedFunction<typeof setCached>
const mockDeleteCached = deleteCached as jest.MockedFunction<typeof deleteCached>

describe('/api/links', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return cached links when available', async () => {
      const mockLinks = [
        { id: '1', title: 'Instagram', url: 'https://instagram.com', order: 0, isActive: true },
        { id: '2', title: 'Twitter', url: 'https://twitter.com', order: 1, isActive: true },
      ]

      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })
      mockGetCached.mockResolvedValue(mockLinks)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockLinks)
      expect(mockGetCached).toHaveBeenCalledWith('links:1')
      expect(mockPrisma.link.findMany).not.toHaveBeenCalled()
    })

    it('should fetch from database when cache miss', async () => {
      const mockLinks = [
        { id: '1', title: 'Instagram', url: 'https://instagram.com', order: 0, isActive: true },
      ]

      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })
      mockGetCached.mockResolvedValue(null)
      mockPrisma.link.findMany.mockResolvedValue(mockLinks)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockLinks)
      expect(mockSetCached).toHaveBeenCalledWith('links:1', mockLinks, 300)
    })

    it('should return 401 when not authenticated', async () => {
      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized')
    })
  })

  describe('POST', () => {
    it('should create new link successfully', async () => {
      const mockLink = {
        id: '1',
        title: 'New Link',
        url: 'https://example.com',
        order: 0,
        isActive: true,
      }

      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })
      mockPrisma.link.findFirst.mockResolvedValue(null) // No existing links
      mockPrisma.link.create.mockResolvedValue(mockLink)

      const request = new NextRequest('http://localhost:3000/api/links', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Link',
          url: 'https://example.com',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockLink)
      expect(mockDeleteCached).toHaveBeenCalledWith('links:1')
    })

    it('should return 400 when required fields are missing', async () => {
      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })

      const request = new NextRequest('http://localhost:3000/api/links', {
        method: 'POST',
        body: JSON.stringify({
          title: '',
          url: '',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Title and URL are required')
    })

    it('should return 400 when URL format is invalid', async () => {
      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })

      const request = new NextRequest('http://localhost:3000/api/links', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Link',
          url: 'invalid-url',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Invalid URL format')
    })
  })
})
