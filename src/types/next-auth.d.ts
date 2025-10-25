import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      username?: string
      role?: string
      isActive?: boolean
    }
  }

  interface User {
    username?: string
    role?: string
    isActive?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string
    role?: string
    isActive?: boolean
  }
}
