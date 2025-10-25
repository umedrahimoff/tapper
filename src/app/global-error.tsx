'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Критическая ошибка
              </h1>
              <p className="text-gray-600 mb-6">
                Произошла критическая ошибка приложения. Попробуйте обновить страницу.
              </p>
              <button
                onClick={reset}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
