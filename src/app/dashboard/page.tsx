import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ExternalLink, Users, Link as LinkIcon } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/")
  }

  // Mock user data for demo
  const user = {
    id: session.user.id,
    name: session.user.name || 'Demo User',
    username: session.user.username || 'demo',
    bio: 'Добро пожаловать в Tapper!',
    avatar: null,
    theme: 'light',
    links: [
      { id: '1', title: 'Instagram', url: 'https://instagram.com/demo', order: 0, isActive: true },
      { id: '2', title: 'Twitter', url: 'https://twitter.com/demo', order: 1, isActive: true }
    ]
  }

  const publicUrl = `${process.env.NEXTAUTH_URL}/${user.username}`

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Обзор</h1>
          <p className="mt-2 text-gray-600">
            Управляйте своей персональной страницей
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <LinkIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Активных ссылок</p>
                <p className="text-2xl font-semibold text-gray-900">{user.links.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Просмотры</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExternalLink className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Публичная ссылка</p>
                <a 
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {publicUrl}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Быстрые действия</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/dashboard/profile"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 text-sm font-medium">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Настроить профиль</p>
                  <p className="text-sm text-gray-500">Имя, описание, аватар</p>
                </div>
              </Link>

              <Link
                href="/dashboard/links"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Добавить ссылки</p>
                  <p className="text-sm text-gray-500">Социальные сети, контакты</p>
                </div>
              </Link>

              <Link
                href="/dashboard/theme"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-medium">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Выбрать тему</p>
                  <p className="text-sm text-gray-500">Светлая, тёмная, акцентная</p>
                </div>
              </Link>

              <Link
                href={`/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">4</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Посмотреть страницу</p>
                  <p className="text-sm text-gray-500">Предпросмотр результата</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
