'use client'

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { User, Mail, Hash, FileText, Upload, X } from "lucide-react"
import { safeLocalStorage } from "@/lib/storage"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: ''
  })
  const [avatarFileName, setAvatarFileName] = useState('')

  // Функция для сжатия и изменения размера изображения
  const compressImage = (file: File, maxWidth: number = 400, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Вычисляем новые размеры
        let { width, height } = img
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height
            height = maxWidth
          }
        }

        canvas.width = width
        canvas.height = height

        // Рисуем изображение с новыми размерами
        ctx?.drawImage(img, 0, 0, width, height)

        // Конвертируем в base64 с заданным качеством
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }

      img.onerror = () => reject(new Error('Ошибка загрузки изображения'))
      img.src = URL.createObjectURL(file)
    })
  }

  useEffect(() => {
    if (session?.user) {
      loadProfileData()
    }
  }, [session])

  const loadProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const profileData = await response.json()
        
        // Load avatar from localStorage for demo
        const savedAvatar = safeLocalStorage.getItem('user-avatar')
        
        setFormData({
          name: profileData.name || '',
          username: profileData.username || '',
          bio: profileData.bio || '',
          avatar: savedAvatar || profileData.avatar || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setInitialLoading(false)
    }
  }

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
        const updatedUser = await response.json()
        
        // Save avatar to localStorage for demo
        if (formData.avatar) {
          safeLocalStorage.setItem('user-avatar', formData.avatar)
        } else {
          safeLocalStorage.removeItem('user-avatar')
        }
        
        // Update local form data with the response
        setFormData(prev => ({
          ...prev,
          name: updatedUser.name,
          username: updatedUser.username,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar
        }))
        
        // Dispatch custom event to update Layout
        window.dispatchEvent(new CustomEvent('avatar-updated'))
        
        toast.success('Профиль обновлен!')
        await update()
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение')
      return
    }

    // Проверяем размер файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 10MB')
      return
    }

    setUploading(true)

    try {
      // Сжимаем изображение
      const compressedImage = await compressImage(file, 400, 0.8)
      
      // Сохраняем имя файла для отображения
      const fileName = file.name
      const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'FILE'
      const displayName = `${fileName.split('.')[0]}.${fileExtension}`
      
      setAvatarFileName(displayName)
      setFormData(prev => ({
        ...prev,
        avatar: compressedImage
      }))
      
      toast.success('Аватар загружен и сжат!')
    } catch (error) {
      console.error('Error compressing image:', error)
      toast.error('Ошибка при обработке изображения')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: ''
    }))
    setAvatarFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Remove from localStorage
    localStorage.removeItem('user-avatar')
    
    // Dispatch custom event to update Layout
    window.dispatchEvent(new CustomEvent('avatar-updated'))
  }

  if (initialLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
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
              <div className="flex-shrink-0 relative">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
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
                {formData.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Удалить аватар"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Аватар
                </label>
                <div className="space-y-3">
                  {/* URL input */}
                  <div>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar.startsWith('data:') ? '' : formData.avatar}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {formData.avatar.startsWith('data:') && avatarFileName && (
                      <div className="mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                          <div className="text-green-600 text-sm">
                            📁 {avatarFileName}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* File upload */}
                  <div className="flex items-center space-x-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                          Обработка...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Загрузить файл
                        </div>
                      )}
                    </button>
                    <span className="text-sm text-gray-500">
                      или вставьте URL
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Поддерживаются форматы: JPG, PNG, GIF. Максимальный размер: 10MB. 
                    Изображение будет автоматически сжато до 400x400px.
                  </p>
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
