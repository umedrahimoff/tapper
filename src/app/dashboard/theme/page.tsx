'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { Check, Sun, Moon, Palette } from "lucide-react"

const themes = [
  {
    id: 'light',
    name: 'Светлая',
    description: 'Классическая светлая тема',
    icon: Sun,
    preview: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-900',
      button: 'bg-indigo-600 text-white'
    }
  },
  {
    id: 'dark',
    name: 'Тёмная',
    description: 'Стильная тёмная тема',
    icon: Moon,
    preview: {
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      button: 'bg-white text-gray-900'
    }
  },
  {
    id: 'accent',
    name: 'Акцентная',
    description: 'Яркая градиентная тема',
    icon: Palette,
    preview: {
      bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      card: 'bg-white/10 backdrop-blur-sm',
      text: 'text-white',
      button: 'bg-white text-indigo-600'
    }
  }
]

export default function ThemePage() {
  const { data: session, update } = useSession()
  const [currentTheme, setCurrentTheme] = useState('light')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // You would typically fetch the user's current theme from the API
    // For now, we'll use a default
  }, [])

  const handleThemeChange = async (themeId: string) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: themeId }),
      })

      if (response.ok) {
        setCurrentTheme(themeId)
        toast.success('Тема изменена!')
        await update()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Ошибка при изменении темы')
      }
    } catch (error) {
      toast.error('Ошибка при изменении темы')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Тема</h1>
          <p className="mt-2 text-gray-600">
            Выберите внешний вид вашей страницы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme) => {
            const Icon = theme.icon
            const isSelected = currentTheme === theme.id
            
            return (
              <div
                key={theme.id}
                className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => !loading && handleThemeChange(theme.id)}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-indigo-500 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* Preview */}
                <div className={`p-6 rounded-t-lg ${theme.preview.bg}`}>
                  <div className={`p-4 rounded-lg ${theme.preview.card}`}>
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 rounded-full ${theme.preview.button} flex items-center justify-center mr-3`}>
                        <span className="text-xs font-bold">
                          {(session?.user?.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${theme.preview.text}`}>
                          {session?.user?.name || 'Пользователь'}
                        </div>
                        <div className={`text-xs opacity-70 ${theme.preview.text}`}>
                          @{session?.user?.username || 'username'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`h-8 rounded ${theme.preview.button} flex items-center justify-center`}>
                        <span className={`text-xs font-medium ${theme.preview.text}`}>
                          Ссылка 1
                        </span>
                      </div>
                      <div className={`h-8 rounded ${theme.preview.button} flex items-center justify-center`}>
                        <span className={`text-xs font-medium ${theme.preview.text}`}>
                          Ссылка 2
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-white">
                  <div className="flex items-center mb-2">
                    <Icon className="w-5 h-5 text-gray-400 mr-2" />
                    <h3 className="font-medium text-gray-900">{theme.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{theme.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            💡 Совет
          </h3>
          <p className="text-sm text-blue-700">
            Выбранная тема будет применена к вашей публичной странице. 
            Вы можете изменить её в любое время.
          </p>
        </div>
      </div>
    </div>
  )
}
