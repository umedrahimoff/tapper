'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { User, Mail, Hash, FileText, Upload } from "lucide-react"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: ''
  })

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        username: session.user.username || '',
        bio: '',
        avatar: ''
      })
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Профиль обновлен!')
        await update()
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Ошибка при обновлении профиля')
      }
    } catch (error) {
      toast.error('Ошибка при обновлении профиля')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Профиль</h1>
          <p className="mt-2 text-gray-600">
            Настройте информацию о себе
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-indigo-600">
                      {formData.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Аватар
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Имя
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ваше имя"
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline h-4 w-4 mr-1" />
                Имя пользователя
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  tapper.uz/
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  pattern="[a-zA-Z0-9_-]+"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="username"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Только буквы, цифры, дефисы и подчеркивания
              </p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Описание
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Расскажите о себе в нескольких словах..."
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.bio.length}/160 символов
              </p>
            </div>

            {/* Email (readonly) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Email нельзя изменить
              </p>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
