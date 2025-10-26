import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCached, setCached } from "@/lib/redis"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const cacheKey = `public:${username}`

    // Проверяем кэш
    const cached = await getCached(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Загружаем из базы данных
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatar: true,
        theme: true,
        links: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            url: true,
            order: true
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

    // Кэшируем на 10 минут
    await setCached(cacheKey, user, 600)

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
