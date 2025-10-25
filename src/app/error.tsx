'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Что-то пошло не так
          </h1>
          <p className="text-gray-600 mb-6">
            Произошла ошибка при загрузке приложения. Попробуйте обновить страницу.
          </p>
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Попробовать снова
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
