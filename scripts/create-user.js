const { PrismaClient } = require('../src/generated')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createUser() {
  try {
    const email = process.argv[2]
    const password = process.argv[3]
    const name = process.argv[4] || 'Admin User'
    const username = process.argv[5] || 'admin'

    if (!email || !password) {
      console.error('Usage: node scripts/create-user.js <email> <password> [name] [username]')
      process.exit(1)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.error('User with this email already exists')
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        bio: null,
        avatar: null,
        theme: 'light'
      }
    })

    console.log('User created successfully:')
    console.log(`Email: ${user.email}`)
    console.log(`Name: ${user.name}`)
    console.log(`Username: ${user.username}`)
    console.log(`ID: ${user.id}`)
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUser()
