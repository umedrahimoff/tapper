import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, username, bio, avatar } = await request.json()

    // Mock response for demo
    const updatedUser = {
      id: session.user.id,
      name,
      username,
      bio,
      avatar,
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
