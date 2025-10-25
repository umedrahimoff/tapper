import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error("Links fetch error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, url } = await request.json()

    if (!title || !url) {
      return NextResponse.json(
        { message: "Title and URL are required" },
        { status: 400 }
      )
    }

    // Get the highest order number
    const lastLink = await prisma.link.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' }
    })

    const newOrder = lastLink ? lastLink.order + 1 : 0

    const link = await prisma.link.create({
      data: {
        title,
        url,
        order: newOrder,
        userId: session.user.id
      }
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error("Link creation error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
