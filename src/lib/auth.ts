import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-demo",
  trustHost: true,
  providers: [
    // Only add OAuth providers if environment variables are set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          if (!user || !user.password) {
            return null
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValidPassword) {
            return null
          }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      }
        } catch (error) {
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirect to the base URL for production
      if (process.env.NODE_ENV === 'production') {
        return baseUrl
      }
      // In development, allow relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allow external URLs in development
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Create new user
            const username = user.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
            
            // Ensure username is unique
            let finalUsername = username
            let counter = 1
            while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
              finalUsername = `${username}${counter}`
              counter++
            }

            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                username: finalUsername,
                bio: null,
                avatar: user.image,
                theme: 'light'
              }
            })
          }
        } catch (error) {
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
        token.role = user.role
        token.isActive = user.isActive
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.username = token.username as string
        session.user.role = token.role as string
        session.user.isActive = token.isActive as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-demo",
  trustHost: true,
})
