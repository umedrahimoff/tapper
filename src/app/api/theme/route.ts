import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { theme } = await request.json()

    if (!theme || !['light', 'dark', 'accent'].includes(theme)) {
      return NextResponse.json(
        { message: "Invalid theme" },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { theme }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Theme update error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
