'use client'

import { useState, useEffect } from "react"
import { ExternalLink, Copy, Check } from "lucide-react"
import toast from "react-hot-toast"

interface User {
  id: string
  name: string | null
  username: string
  bio: string | null
  avatar: string | null
  theme: string
  links: {
    id: string
    title: string
    url: string
    order: number
  }[]
}

interface PublicProfileProps {
  user: User
}

export default function PublicProfile({ user }: PublicProfileProps) {
  const [copied, setCopied] = useState(false)
  const [userData, setUserData] = useState(user)

  useEffect(() => {
    // Track page view
    const trackView = async () => {
      try {
        await fetch(`/api/views/${user.username}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referer: document.referrer
          })
        })
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }

    // Track view on component mount
    trackView()

    // Track view

    // Use user data as is
    setUserData(user)
  }, [user])

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Ссылка скопирована!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Ошибка при копировании')
    }
  }

  const getThemeClasses = () => {
    switch (userData.theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          text: 'text-white',
          card: 'bg-gray-800',
          button: 'bg-white text-gray-900 hover:bg-gray-100',
          link: 'bg-gray-700 hover:bg-gray-600 text-white'
        }
      case 'accent':
        return {
          bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
          text: 'text-white',
          card: 'bg-white/10 backdrop-blur-sm',
          button: 'bg-white text-indigo-600 hover:bg-gray-100',
          link: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
        }
      default: // light
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          card: 'bg-white',
          button: 'bg-indigo-600 text-white hover:bg-indigo-700',
          link: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
        }
    }
  }

  const theme = getThemeClasses()

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          {userData.avatar ? (
            <img
              src={userData.avatar}
              alt={userData.name || userData.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-indigo-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">
                {(userData.name || userData.username).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <h1 className="text-2xl font-bold mb-2">
            {userData.name || userData.username}
          </h1>
          
          {userData.bio && (
            <p className="text-sm opacity-80 mb-4">
              {userData.bio}
            </p>
          )}

          <button
            onClick={copyUrl}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${theme.button}`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Скопировано!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Поделиться
              </>
            )}
          </button>
        </div>

        {/* Links */}
        {userData.links.length > 0 ? (
          <div className="space-y-3">
            {userData.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full px-6 py-4 rounded-xl text-center font-medium transition-all duration-200 hover:scale-105 ${theme.link}`}
              >
                <div className="flex items-center justify-center">
                  <span className="mr-2">{link.title}</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm opacity-60">
              Ссылки пока не добавлены
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs opacity-60">
            Создано с помощью{' '}
            <a
              href="/"
              className="underline hover:no-underline"
            >
              Tapper
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
