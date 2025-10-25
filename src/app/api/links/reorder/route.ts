import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { links } = await request.json()

    if (!Array.isArray(links)) {
      return NextResponse.json(
        { message: "Links array is required" },
        { status: 400 }
      )
    }

    // Update all links in a transaction
    await prisma.$transaction(
      links.map((link: { id: string; order: number }) =>
        prisma.link.update({
          where: {
            id: link.id,
            userId: session.user.id
          },
          data: { order: link.order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Links reorder error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
