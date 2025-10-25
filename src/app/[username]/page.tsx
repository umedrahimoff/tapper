import { notFound } from "next/navigation"
import { Metadata } from "next"
import PublicProfile from "@/components/PublicProfile"

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  
  try {
    // Fetch user data from API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/public/${username}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return {
        title: 'Пользователь не найден - Tapper',
        description: 'Пользователь не найден',
      }
    }
    
    const user = await response.json()

    return {
      title: `${user.name} - Tapper`,
      description: user.bio || `Персональная страница ${user.name}`,
      openGraph: {
        title: `${user.name} - Tapper`,
        description: user.bio || `Персональная страница ${user.name}`,
        images: user.avatar ? [user.avatar] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Пользователь не найден - Tapper',
      description: 'Пользователь не найден',
    }
  }
}

export default async function PublicUserPage({ params }: Props) {
  const { username } = await params
  
  try {
    // Fetch user data from API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/public/${username}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      notFound()
    }
    
    const user = await response.json()

    return <PublicProfile user={user} />
  } catch (error) {
    notFound()
  }
}
