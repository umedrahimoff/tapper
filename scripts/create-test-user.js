const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    const email = 'test@tapper.com'
    const password = 'test123'
    const name = 'Test User'
    const username = 'testuser'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('✅ Test user already exists!')
      console.log(`Email: ${existingUser.email}`)
      console.log(`Username: ${existingUser.username}`)
      console.log(`Role: ${existingUser.role}`)
      console.log(`Password: ${password}`)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create test user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        role: 'user',
        bio: 'Test user for demo',
        avatar: null,
        theme: 'light',
        isActive: true
      }
    })

    console.log('✅ Test user created successfully!')
    console.log(`Email: ${user.email}`)
    console.log(`Username: ${user.username}`)
    console.log(`Role: ${user.role}`)
    console.log(`Password: ${password}`)
    console.log('\n🔐 You can now login with these credentials')

  } catch (error) {
    console.error('❌ Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
