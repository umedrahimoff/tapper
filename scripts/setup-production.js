#!/usr/bin/env node

/**
 * Production Environment Setup Script
 * This script helps you set up the production environment variables
 */

const crypto = require('crypto')

console.log('🚀 Tapper Production Setup')
console.log('========================\n')

// Generate a secure secret
const secret = crypto.randomBytes(32).toString('hex')

console.log('📋 Environment Variables for Render:')
console.log('=====================================\n')

console.log('NEXTAUTH_URL=https://tapper.onrender.com')
console.log(`NEXTAUTH_SECRET=${secret}`)
console.log('DATABASE_URL=your-postgresql-connection-string')
console.log('REDIS_HOST=your-redis-host (optional)')
console.log('REDIS_PORT=6379 (optional)')
console.log('REDIS_PASSWORD=your-redis-password (optional)')

console.log('\n🔐 OAuth Providers (optional):')
console.log('===============================')
console.log('GOOGLE_CLIENT_ID=your-google-client-id')
console.log('GOOGLE_CLIENT_SECRET=your-google-client-secret')
console.log('GITHUB_CLIENT_ID=your-github-client-id')
console.log('GITHUB_CLIENT_SECRET=your-github-client-secret')

console.log('\n📝 Instructions:')
console.log('================')
console.log('1. Copy the variables above')
console.log('2. Go to your Render dashboard')
console.log('3. Navigate to Environment section')
console.log('4. Add each variable with its value')
console.log('5. Redeploy your service')

console.log('\n✅ After setting up variables, your app should work without 502 errors!')
