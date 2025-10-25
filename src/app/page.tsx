import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function HomePage() {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard")
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tapper
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Создайте свою персональную страницу со ссылками за несколько минут
          </p>
          <div className="space-y-4">
            <a
              href="/auth/signin"
              className="block w-full py-3 px-4 border border-transparent text-center text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Войти в аккаунт
            </a>
            <p className="text-sm text-gray-500">
              Безопасно • Быстро • Просто
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}