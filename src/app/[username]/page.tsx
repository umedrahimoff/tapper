import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import PublicProfile from "@/components/PublicProfile"

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  // Mock user data for demo
  const user = {
    name: 'Demo User',
    username: username,
    bio: 'Добро пожаловать в Tapper!',
    avatar: null
  }

  return {
    title: `${user.name} - Tapper`,
    description: user.bio || `Персональная страница ${user.name}`,
    openGraph: {
      title: `${user.name} - Tapper`,
      description: user.bio || `Персональная страница ${user.name}`,
      images: user.avatar ? [user.avatar] : [],
    },
  }
}

export default async function PublicUserPage({ params }: Props) {
  const { username } = await params
  // Mock user data for demo
  const user = {
    id: '1',
    name: 'Demo User',
    username: username,
    bio: 'Добро пожаловать в Tapper!',
    avatar: null,
    theme: 'light',
    links: [
      { id: '1', title: 'Instagram', url: 'https://instagram.com/demo', order: 0, isActive: true },
      { id: '2', title: 'Twitter', url: 'https://twitter.com/demo', order: 1, isActive: true },
      { id: '3', title: 'GitHub', url: 'https://github.com/demo', order: 2, isActive: true }
    ]
  }

  return <PublicProfile user={user} />
}
