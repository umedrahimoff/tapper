import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tapper - Персональная страница со ссылками",
  description: "Создайте свою персональную страницу со ссылками за несколько минут",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          {children}
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  )
}