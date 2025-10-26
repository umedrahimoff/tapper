import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
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

    // Check if link belongs to user
    const existingLink = await prisma.link.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingLink) {
      return NextResponse.json(
        { message: "Link not found" },
        { status: 404 }
      )
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: { title, url },
      select: {
        id: true,
        title: true,
        url: true,
        order: true,
        isActive: true
      }
    })

    return NextResponse.json(updatedLink)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if link belongs to user
    const existingLink = await prisma.link.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingLink) {
      return NextResponse.json(
        { message: "Link not found" },
        { status: 404 }
      )
    }

    await prisma.link.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}