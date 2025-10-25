'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  Settings, 
  Shield,
  LogOut,
  Home
} from 'lucide-react'

const adminNavigation = [
  { name: 'Обзор', href: '/admin', icon: BarChart3 },
  { name: 'Пользователи', href: '/admin/users', icon: Users },
  { name: 'Настройки', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  if (session.user.role !== 'admin') {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Admin Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center flex-shrink-0 px-4 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-red-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">Админ-панель</h1>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-red-100 text-red-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            
            {/* User Profile & Actions - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50">
              <div className="p-4 space-y-3">
                {/* User Info */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">{session.user.name}</p>
                    <p className="text-xs text-gray-500 truncate">@{session.user.username}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Администратор
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href="/dashboard"
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Кабинет
                  </Link>
                  <button
                    onClick={() => router.push('/api/auth/signout')}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - Full width */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-red-600 mr-2" />
                <h1 className="text-lg font-semibold text-gray-900">Админ-панель</h1>
              </div>
              <Link
                href="/dashboard"
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                Кабинет
              </Link>
            </div>
          </div>

          {/* Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
