import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, username, bio, avatar } = await request.json()

    // Check if username is already taken
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: session.user.id }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { message: "Имя пользователя уже занято" },
          { status: 400 }
        )
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        username,
        bio,
        avatar,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
