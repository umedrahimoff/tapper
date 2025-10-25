import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function requireAdmin() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, isActive: true }
  })

  if (!user || user.role !== 'admin' || !user.isActive) {
    return NextResponse.json({ message: "Admin access required" }, { status: 403 })
  }

  return null // No error, user is admin
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, isActive: true }
  })

  return user?.role === 'admin' && user?.isActive === true
}
