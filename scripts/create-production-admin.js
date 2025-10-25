const { PrismaClient } = require('../src/generated/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createProductionAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@tapper.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const name = process.env.ADMIN_NAME || 'Admin'
    const username = process.env.ADMIN_USERNAME || 'admin'

    console.log('🚀 Creating production admin user...')
    console.log(`Email: ${email}`)
    console.log(`Username: ${username}`)
    console.log(`Password: ${password}`)

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log(`Email: ${existingAdmin.email}`)
      console.log(`Username: ${existingAdmin.username}`)
      console.log(`Role: ${existingAdmin.role}`)
      console.log(`Active: ${existingAdmin.isActive}`)
      
      // Update password if needed
      if (password !== 'admin123') {
        const hashedPassword = await bcrypt.hash(password, 12)
        await prisma.user.update({
          where: { email },
          data: { password: hashedPassword }
        })
        console.log('✅ Password updated!')
      }
      
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

    console.log('✅ Production admin user created successfully!')
    console.log(`ID: ${admin.id}`)
    console.log(`Email: ${admin.email}`)
    console.log(`Username: ${admin.username}`)
    console.log(`Role: ${admin.role}`)
    console.log(`Password: ${password}`)
    console.log('\n🔐 You can now login with these credentials')
    console.log('\n🌐 Login URL: https://tapper.onrender.com/auth/signin')

  } catch (error) {
    console.error('❌ Error creating production admin:', error)
    
    if (error.code === 'P2002') {
      console.log('\n💡 User with this email or username already exists')
    } else if (error.code === 'P1001') {
      console.log('\n💡 Database connection failed. Check your DATABASE_URL')
    } else {
      console.log('\n💡 Check your database connection and try again')
    }
  } finally {
    await prisma.$disconnect()
  }
}

createProductionAdmin()
