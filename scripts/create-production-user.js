const { PrismaClient } = require('../src/generated')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createProductionUser() {
  try {
    const email = process.env.ADMIN_EMAIL || process.argv[2]
    const password = process.env.ADMIN_PASSWORD || process.argv[3]
    const name = process.env.ADMIN_NAME || process.argv[4] || 'Admin User'
    const username = process.env.ADMIN_USERNAME || process.argv[5] || 'admin'

    if (!email || !password) {
      console.error('Usage: ADMIN_EMAIL=email ADMIN_PASSWORD=password node scripts/create-production-user.js')
      console.error('Or: node scripts/create-production-user.js <email> <password> [name] [username]')
      process.exit(1)
    }

    console.log('Creating production user...')
    console.log(`Email: ${email}`)
    console.log(`Name: ${name}`)
    console.log(`Username: ${username}`)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User with this email already exists')
      console.log(`ID: ${existingUser.id}`)
      console.log(`Username: ${existingUser.username}`)
      process.exit(0)
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

    console.log('✅ Production user created successfully!')
    console.log(`ID: ${user.id}`)
    console.log(`Email: ${user.email}`)
    console.log(`Name: ${user.name}`)
    console.log(`Username: ${user.username}`)
    console.log(`Created: ${user.createdAt}`)
    
    console.log('\n🔗 You can now login at:')
    console.log(`${process.env.NEXTAUTH_URL || 'https://your-domain.com'}/auth/signin`)
  } catch (error) {
    console.error('❌ Error creating production user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createProductionUser()
