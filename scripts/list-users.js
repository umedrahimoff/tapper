const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listUsers() {
  try {
    console.log('👥 Users in database:')
    console.log('===================\n')

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    if (users.length === 0) {
      console.log('❌ No users found in database')
      console.log('\n💡 Create users with:')
      console.log('npm run create-admin')
      console.log('npm run create-test-user')
      return
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (@${user.username})`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Active: ${user.isActive ? '✅' : '❌'}`)
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`)
      console.log('')
    })

    console.log(`📊 Total users: ${users.length}`)
    console.log(`👑 Admins: ${users.filter(u => u.role === 'admin').length}`)
    console.log(`👤 Regular users: ${users.filter(u => u.role === 'user').length}`)

  } catch (error) {
    console.error('❌ Error fetching users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
