import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const adminCheck = await requireAdmin()
    if (adminCheck) return adminCheck

    const [
      totalUsers,
      activeUsers,
      totalLinks,
      totalViews,
      recentUsers,
      topUsers,
      dailyStats
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users (last 30 days)
      prisma.user.count({
        where: {
          isActive: true,
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Total links
      prisma.link.count(),
      
      // Total views
      prisma.view.count(),
      
      // Recent users (last 7 days)
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      // Top users by links
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          _count: {
            select: {
              links: true,
              views: true
            }
          }
        },
        orderBy: {
          links: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      
      // Daily stats for last 30 days
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM users 
        WHERE createdAt >= datetime('now', '-30 days')
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `
    ])

    // Calculate growth rates
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const previousMonth = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    
    const [lastMonthUsers, previousMonthUsers] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonth
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: previousMonth,
            lt: lastMonth
          }
        }
      })
    ])

    const userGrowthRate = previousMonthUsers > 0 
      ? ((lastMonthUsers - previousMonthUsers) / previousMonthUsers) * 100 
      : 0

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        totalLinks,
        totalViews,
        userGrowthRate: Math.round(userGrowthRate * 100) / 100
      },
      recentUsers,
      topUsers,
      dailyStats
    })
  } catch (error) {
    console.error("Admin stats fetch error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
