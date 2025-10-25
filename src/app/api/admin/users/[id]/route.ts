import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin()
    if (adminCheck) return adminCheck

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatar: true,
        theme: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        links: {
          select: {
            id: true,
            title: true,
            url: true,
            order: true,
            isActive: true,
            createdAt: true
          },
          orderBy: { order: 'asc' }
        },
        views: {
          select: {
            id: true,
            userAgent: true,
            referer: true,
            ipAddress: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            links: true,
            views: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Admin user fetch error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin()
    if (adminCheck) return adminCheck

    const { id } = await params
    const { name, username, bio, avatar, theme, role, isActive } = await request.json()

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    // Check if username is already taken by another user
    if (username && username !== existingUser.username) {
      const usernameTaken = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id }
        }
      })

      if (usernameTaken) {
        return NextResponse.json(
          { message: "Username already taken" },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
        ...(theme && { theme }),
        ...(role && { role }),
        ...(isActive !== undefined && { isActive })
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatar: true,
        theme: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            links: true,
            views: true
          }
        }
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Admin user update error:", error)
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
    const adminCheck = await requireAdmin()
    if (adminCheck) return adminCheck

    const { id } = await params

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    // Prevent deleting yourself
    const session = await auth()
    if (session?.user?.id === id) {
      return NextResponse.json(
        { message: "Cannot delete your own account" },
        { status: 400 }
      )
    }

    // Delete user (cascade will delete links and views)
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "User deleted successfully"
    })
  } catch (error) {
    console.error("Admin user deletion error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
