const { PrismaClient } = require('../src/generated/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@tapper.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const name = process.env.ADMIN_NAME || 'Admin'
    const username = process.env.ADMIN_USERNAME || 'admin'

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log('Admin user already exists!')
      console.log(`Email: ${existingAdmin.email}`)
      console.log(`Username: ${existingAdmin.username}`)
      console.log(`Role: ${existingAdmin.role}`)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        role: 'admin',
        bio: 'System Administrator',
        avatar: null,
        theme: 'light',
        isActive: true
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log(`Email: ${admin.email}`)
    console.log(`Username: ${admin.username}`)
    console.log(`Role: ${admin.role}`)
    console.log(`Password: ${password}`)
    console.log('\n🔐 You can now login with these credentials')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
