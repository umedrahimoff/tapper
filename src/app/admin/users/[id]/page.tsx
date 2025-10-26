'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, User, Mail, Calendar, Shield, Eye, EyeOff, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  username: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  bio?: string
  avatar?: string
  theme: string
  _count: {
    links: number
    views: number
  }
}

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'user',
    isActive: true,
    bio: ''
  })

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setEditData({
          name: userData.name || '',
          email: userData.email || '',
          username: userData.username || '',
          role: userData.role || 'user',
          isActive: userData.isActive,
          bio: userData.bio || ''
        })
      } else {
        toast.error('Пользователь не найден')
        router.push('/admin/users')
      }
    } catch (error) {
      toast.error('Ошибка загрузки пользователя')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        
        // Update local state with the response
        setUser(updatedUser)
        setEditData({
          name: updatedUser.name || '',
          email: updatedUser.email || '',
          username: updatedUser.username || '',
          role: updatedUser.role || 'user',
          isActive: updatedUser.isActive,
          bio: updatedUser.bio || ''
        })
        
        toast.success('Пользователь обновлен')
        setEditing(false)
      } else {
        const data = await response.json()
        toast.error(data.message || 'Ошибка обновления')
      }
    } catch (error) {
      toast.error('Ошибка сети')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Пользователь удален')
        router.push('/admin/users')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Ошибка удаления')
      }
    } catch (error) {
      toast.error('Ошибка сети')
    }
  }

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center py-12">
          <p className="text-gray-500">Пользователь не найден</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Назад"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="mt-1 text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center"
                  title="Редактировать пользователя"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center"
                  title="Удалить пользователя"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900 flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                Основная информация
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                    <select
                      value={editData.role}
                      onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <select
                      value={editData.isActive ? 'true' : 'false'}
                      onChange={(e) => setEditData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="true">Активный</option>
                      <option value="false">Неактивный</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Биография</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="ml-2 text-sm font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Роль:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {user.isActive ? (
                      <Eye className="h-4 w-4 text-green-400 mr-3" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-red-400 mr-3" />
                    )}
                    <span className="text-sm text-gray-600">Статус:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Активный' : 'Неактивный'}
                    </span>
                  </div>
                  {user.bio && (
                    <div>
                      <span className="text-sm text-gray-600">Биография:</span>
                      <p className="mt-1 text-sm text-gray-900">{user.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">Статистика</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ссылки:</span>
                <span className="text-sm font-medium">{user._count.links}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Просмотры:</span>
                <span className="text-sm font-medium">{user._count.views}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-green-600" />
                Даты
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <span className="text-sm text-gray-600">Создан:</span>
                <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Обновлен:</span>
                <p className="text-sm font-medium">{new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
