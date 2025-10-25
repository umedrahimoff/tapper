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
      where: { 
        userId: session.user.id,
        isActive: true 
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        url: true,
        order: true,
        isActive: true
      }
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

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { message: "Invalid URL format" },
        { status: 400 }
      )
    }

    // Get the next order number
    const lastLink = await prisma.link.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' }
    })

    const nextOrder = lastLink ? lastLink.order + 1 : 0

    const link = await prisma.link.create({
      data: {
        title,
        url,
        order: nextOrder,
        userId: session.user.id
      },
      select: {
        id: true,
        title: true,
        url: true,
        order: true,
        isActive: true
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
