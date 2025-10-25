import { NextRequest } from 'next/server'
import { GET, PUT } from '@/app/api/profile/route'
import { prisma } from '@/lib/prisma'
import { getCached, setCached, deleteCached, deleteCachedPattern } from '@/lib/redis'

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
const mockDeleteCachedPattern = deleteCachedPattern as jest.MockedFunction<typeof deleteCachedPattern>

describe('/api/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return user profile when authenticated', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        username: 'testuser',
        bio: 'Test bio',
        avatar: 'avatar.jpg',
        email: 'test@example.com',
      }

      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockUser)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: {
          id: true,
          name: true,
          username: true,
          bio: true,
          avatar: true,
          email: true,
        },
      })
    })

    it('should return 401 when not authenticated', async () => {
      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized')
    })

    it('should return 404 when user not found', async () => {
      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.message).toBe('User not found')
    })
  })

  describe('PUT', () => {
    it('should update user profile successfully', async () => {
      const mockUpdatedUser = {
        id: '1',
        name: 'Updated User',
        username: 'updateduser',
        bio: 'Updated bio',
        avatar: 'new-avatar.jpg',
        email: 'test@example.com',
      }

      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })
      mockPrisma.user.findFirst.mockResolvedValue(null) // Username not taken
      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser)

      const request = new NextRequest('http://localhost:3000/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated User',
          username: 'updateduser',
          bio: 'Updated bio',
          avatar: 'new-avatar.jpg',
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockUpdatedUser)
      expect(mockDeleteCached).toHaveBeenCalledWith('profile:1')
      expect(mockDeleteCachedPattern).toHaveBeenCalledWith('public:updateduser')
    })

    it('should return 400 when required fields are missing', async () => {
      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })

      const request = new NextRequest('http://localhost:3000/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: '',
          username: '',
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Name and username are required')
    })

    it('should return 400 when username is already taken', async () => {
      const { auth } = require('@/lib/auth')
      auth.mockResolvedValue({ user: { id: '1' } })
      mockPrisma.user.findFirst.mockResolvedValue({ id: '2' }) // Username taken

      const request = new NextRequest('http://localhost:3000/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Test User',
          username: 'takenuser',
          bio: 'Test bio',
        }),
      })

      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Username already taken')
    })
  })
})
