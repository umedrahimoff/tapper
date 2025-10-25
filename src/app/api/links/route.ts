import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Mock data for demo
    const links = [
      { id: '1', title: 'Instagram', url: 'https://instagram.com/demo', order: 0, isActive: true },
      { id: '2', title: 'Twitter', url: 'https://twitter.com/demo', order: 1, isActive: true }
    ]

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

    // Mock response for demo
    const link = {
      id: Date.now().toString(),
      title,
      url,
      order: 0,
      isActive: true,
      userId: session.user.id
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error("Link creation error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
