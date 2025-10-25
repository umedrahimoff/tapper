'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Users, BarChart3, Link, Eye, TrendingUp, UserPlus, Settings } from 'lucide-react'

interface Stats {
  overview: {
    totalUsers: number
    activeUsers: number
    totalLinks: number
    totalViews: number
    userGrowthRate: number
  }
  recentUsers: Array<{
    id: string
    name: string
    username: string
    email: string
    createdAt: string
  }>
  topUsers: Array<{
    id: string
    name: string
    username: string
    _count: {
      links: number
      views: number
    }
  }>
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchStats()
    }
  }, [status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else if (response.status === 403) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h1>
          <p className="text-gray-600">У вас нет прав администратора</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Обзор системы</h1>
        <p className="mt-1 text-sm text-gray-600">Статистика и аналитика платформы</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-gray-500">Всего пользователей</p>
                <p className="text-xl font-semibold text-gray-900">{stats.overview.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Активных пользователей</p>
                <p className="text-xl font-semibold text-gray-900">{stats.overview.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Всего ссылок</p>
                <p className="text-xl font-semibold text-gray-900">{stats.overview.totalLinks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Всего просмотров</p>
                <p className="text-xl font-semibold text-gray-900">{stats.overview.totalViews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">Рост пользователей</h3>
              <p className="text-xs text-gray-500">За последний месяц</p>
            </div>
            <div className="text-right">
              <p className={`text-xl font-semibold ${
                stats.overview.userGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.overview.userGrowthRate >= 0 ? '+' : ''}{stats.overview.userGrowthRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">Новые пользователи</h3>
            </div>
            <div className="p-4">
              {stats.recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-3 text-sm">Нет новых пользователей</p>
              )}
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Топ пользователи</h3>
            </div>
            <div className="p-6">
              {stats.topUsers.length > 0 ? (
                <div className="space-y-4">
                  {stats.topUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 text-sm font-medium">{index + 1}</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{user._count.links} ссылок</p>
                        <p className="text-xs text-gray-500">{user._count.views} просмотров</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Нет данных</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Быстрые действия</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/admin/users')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Users className="h-6 w-6 text-indigo-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Управление пользователями</p>
                  <p className="text-sm text-gray-500">Просмотр и редактирование</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/stats')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Подробная статистика</p>
                  <p className="text-sm text-gray-500">Аналитика и отчеты</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/settings')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-6 w-6 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Настройки</p>
                  <p className="text-sm text-gray-500">Конфигурация системы</p>
                </div>
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}
