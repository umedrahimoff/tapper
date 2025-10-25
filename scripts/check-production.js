const { PrismaClient } = require('../src/generated/client')

const prisma = new PrismaClient()

async function checkProduction() {
  try {
    console.log('🔍 Checking production database...')
    
    // Check database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@tapper.com' }
    })
    
    if (admin) {
      console.log('✅ Admin user found:')
      console.log(`   Email: ${admin.email}`)
      console.log(`   Username: ${admin.username}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Active: ${admin.isActive}`)
      console.log(`   Created: ${admin.createdAt}`)
    } else {
      console.log('❌ Admin user NOT found!')
      console.log('   You need to create an admin user')
    }
    
    // List all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    })
    
    console.log(`\n📋 All users (${users.length}):`)
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (@${user.username}) - ${user.role} - ${user.isActive ? 'Active' : 'Inactive'}`)
    })
    
    if (users.length === 0) {
      console.log('\n⚠️  No users found in database!')
      console.log('   Run: npm run create-production-admin')
    }
    
  } catch (error) {
    console.error('❌ Error checking production:', error)
    
    if (error.code === 'P1001') {
      console.log('\n💡 Database connection failed')
      console.log('   Check your DATABASE_URL environment variable')
    } else if (error.code === 'P2025') {
      console.log('\n💡 Database not found')
      console.log('   Make sure your database is created and accessible')
    } else {
      console.log('\n💡 Unknown error:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkProduction()
