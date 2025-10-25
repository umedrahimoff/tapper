const bcrypt = require('bcryptjs')

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@tapper.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const name = process.env.ADMIN_NAME || 'Admin'
    const username = process.env.ADMIN_USERNAME || 'admin'

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user via API
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        name,
        username,
        role: 'admin'
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Admin user created successfully!')
      console.log(`Email: ${email}`)
      console.log(`Username: ${username}`)
      console.log(`Role: admin`)
      console.log(`Password: ${password}`)
      console.log('\n🔐 You can now login with these credentials')
    } else {
      const error = await response.json()
      console.log('❌ Error creating admin user:', error.message)
    }

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    console.log('\n💡 Make sure the server is running: npm run dev')
  }
}

createAdmin()
