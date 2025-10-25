import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    
    // Mock response for demo
    const link = {
      id,
      title,
      url,
      order: 0,
      isActive: true,
      userId: session.user.id
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error("Link update error:", error)
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
    
    // Mock response for demo
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Link deletion error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
