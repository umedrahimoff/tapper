import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getCached, setCached, deleteCached, deleteCachedPattern } from "@/lib/redis"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatar: true,
        email: true
      }
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, username, bio, avatar } = await request.json()

    // Validate required fields
    if (!name || !username) {
      return NextResponse.json(
        { message: "Name and username are required" },
        { status: 400 }
      )
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: session.user.id }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        username,
        bio,
        avatar
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatar: true,
        email: true
      }
    })

    // Очищаем кэш профиля и публичной страницы
    await deleteCached(`profile:${session.user.id}`)
    await deleteCachedPattern(`public:${updatedUser.username}`)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
