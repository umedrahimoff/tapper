'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  User, 
  Link as LinkIcon, 
  Palette, 
  Settings, 
  LogOut,
  LogIn,
  Shield
} from "lucide-react"
import { safeLocalStorage } from "@/lib/storage"

const navigation = [
  { name: 'Обзор', href: '/dashboard', icon: Home },
  { name: 'Профиль', href: '/dashboard/profile', icon: User },
  { name: 'Ссылки', href: '/dashboard/links', icon: LinkIcon },
  { name: 'Тема', href: '/dashboard/theme', icon: Palette },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [userAvatar, setUserAvatar] = useState<string>('')

  useEffect(() => {
    // Load avatar from localStorage for demo
    const savedAvatar = safeLocalStorage.getItem('user-avatar')
    if (savedAvatar) {
      setUserAvatar(savedAvatar)
    }

    // Listen for avatar updates
    const handleStorageChange = () => {
      const newAvatar = safeLocalStorage.getItem('user-avatar')
      setUserAvatar(newAvatar || '')
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events (for same-tab updates)
    window.addEventListener('avatar-updated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('avatar-updated', handleStorageChange)
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Добро пожаловать в Tapper
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Создайте свою персональную страницу со ссылками
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <button
              onClick={() => signIn()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Войти
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col h-screen bg-white border-r border-gray-200">
            {/* Header */}
            <div className="flex items-center flex-shrink-0 px-4 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Tapper</h1>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
              
            </nav>
            
            {/* User Profile & Logout - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Avatar"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">{session.user.name}</p>
                    <p className="text-xs text-gray-500 truncate">@{session.user.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {session.user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Админ-панель"
                          >
                      <Shield className="h-5 w-5" />
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Выйти"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
