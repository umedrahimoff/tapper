'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import toast from "react-hot-toast"
import { Plus, Link as LinkIcon, Trash2, Edit2, ExternalLink, Star, Search } from "lucide-react"

interface Link {
  id: string
  title: string
  url: string
  order: number
  isActive: boolean
}

interface PopularLink {
  id: string
  title: string
  url: string
  icon: string
  category: string
}

// Предустановленные популярные ссылки
const popularLinks: PopularLink[] = [
  // Социальные сети
  { id: 'instagram', title: 'Instagram', url: 'https://instagram.com/', icon: '📷', category: 'Социальные сети' },
  { id: 'tiktok', title: 'TikTok', url: 'https://tiktok.com/@', icon: '🎵', category: 'Социальные сети' },
  { id: 'youtube', title: 'YouTube', url: 'https://youtube.com/@', icon: '📺', category: 'Социальные сети' },
  { id: 'telegram', title: 'Telegram', url: 'https://t.me/', icon: '✈️', category: 'Социальные сети' },
  { id: 'whatsapp', title: 'WhatsApp', url: 'https://wa.me/', icon: '💬', category: 'Социальные сети' },
  { id: 'twitter', title: 'Twitter', url: 'https://twitter.com/', icon: '🐦', category: 'Социальные сети' },
  { id: 'facebook', title: 'Facebook', url: 'https://facebook.com/', icon: '👥', category: 'Социальные сети' },
  { id: 'linkedin', title: 'LinkedIn', url: 'https://linkedin.com/in/', icon: '💼', category: 'Социальные сети' },
  
  // Мессенджеры
  { id: 'discord', title: 'Discord', url: 'https://discord.gg/', icon: '🎮', category: 'Мессенджеры' },
  { id: 'viber', title: 'Viber', url: 'viber://chat?number=', icon: '💜', category: 'Мессенджеры' },
  { id: 'skype', title: 'Skype', url: 'skype:', icon: '📞', category: 'Мессенджеры' },
  
  // Платежи
  { id: 'paypal', title: 'PayPal', url: 'https://paypal.me/', icon: '💳', category: 'Платежи' },
  { id: 'yoomoney', title: 'ЮMoney', url: 'https://yoomoney.ru/to/', icon: '💰', category: 'Платежи' },
  { id: 'qiwi', title: 'QIWI', url: 'https://qiwi.com/p/', icon: '💸', category: 'Платежи' },
  
  // Работа
  { id: 'github', title: 'GitHub', url: 'https://github.com/', icon: '💻', category: 'Работа' },
  { id: 'behance', title: 'Behance', url: 'https://behance.net/', icon: '🎨', category: 'Работа' },
  { id: 'dribbble', title: 'Dribbble', url: 'https://dribbble.com/', icon: '🏀', category: 'Работа' },
  
  // Развлечения
  { id: 'spotify', title: 'Spotify', url: 'https://open.spotify.com/user/', icon: '🎵', category: 'Развлечения' },
  { id: 'twitch', title: 'Twitch', url: 'https://twitch.tv/', icon: '🎮', category: 'Развлечения' },
  { id: 'steam', title: 'Steam', url: 'https://steamcommunity.com/id/', icon: '🎮', category: 'Развлечения' },
  
  // Другие
  { id: 'website', title: 'Веб-сайт', url: 'https://', icon: '🌐', category: 'Другие' },
  { id: 'email', title: 'Email', url: 'mailto:', icon: '📧', category: 'Другие' },
  { id: 'phone', title: 'Телефон', url: 'tel:', icon: '📱', category: 'Другие' },
]

export default function LinksPage() {
  const { data: session } = useSession()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPopularLinks, setShowPopularLinks] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    url: ''
  })

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      // First try to load from localStorage for demo
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedLinks = localStorage.getItem('user-links')
        if (savedLinks) {
          const links = JSON.parse(savedLinks)
          setLinks(links.sort((a: Link, b: Link) => a.order - b.order))
          setLoading(false)
          return
        }
      }
      
      // Fallback to API
      const response = await fetch('/api/links')
      if (response.ok) {
        const data = await response.json()
        setLinks(data.sort((a: Link, b: Link) => a.order - b.order))
      }
    } catch (error) {
      toast.error('Ошибка при загрузке ссылок')
    } finally {
      setLoading(false)
    }
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error('Заполните все поля')
      return
    }

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newLink = await response.json()
        toast.success('Ссылка добавлена!')
        setFormData({ title: '', url: '' })
        setShowAddForm(false)
        
        // Save to localStorage for demo
        if (typeof window !== 'undefined' && window.localStorage) {
          const updatedLinks = [...links, newLink].sort((a, b) => a.order - b.order)
          localStorage.setItem('user-links', JSON.stringify(updatedLinks))
        }
        
        fetchLinks()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Ошибка при добавлении ссылки')
      }
    } catch (error) {
      toast.error('Ошибка при добавлении ссылки')
    }
  }

  const handleEditLink = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingLink || !formData.title.trim() || !formData.url.trim()) {
      return
    }

    try {
      const response = await fetch(`/api/links/${editingLink.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedLink = await response.json()
        toast.success('Ссылка обновлена!')
        setEditingLink(null)
        setFormData({ title: '', url: '' })
        
        // Update localStorage for demo
        const updatedLinks = links.map(link => 
          link.id === editingLink.id ? updatedLink : link
        ).sort((a, b) => a.order - b.order)
        localStorage.setItem('user-links', JSON.stringify(updatedLinks))
        
        fetchLinks()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Ошибка при обновлении ссылки')
      }
    } catch (error) {
      toast.error('Ошибка при обновлении ссылки')
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Удалить эту ссылку?')) return

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Ссылка удалена!')
        
        // Update localStorage for demo
        const updatedLinks = links.filter(link => link.id !== id)
        localStorage.setItem('user-links', JSON.stringify(updatedLinks))
        
        fetchLinks()
      } else {
        toast.error('Ошибка при удалении ссылки')
      }
    } catch (error) {
      toast.error('Ошибка при удалении ссылки')
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const newLinks = Array.from(links)
    const [reorderedItem] = newLinks.splice(result.source.index, 1)
    newLinks.splice(result.destination.index, 0, reorderedItem)

    // Update order in database
    const updates = newLinks.map((link, index) => ({
      id: link.id,
      order: index
    }))

    try {
      await fetch('/api/links/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: updates })
      })

      setLinks(newLinks)
      
      // Update localStorage for demo
      localStorage.setItem('user-links', JSON.stringify(newLinks))
    } catch (error) {
      toast.error('Ошибка при изменении порядка')
    }
  }

  const startEdit = (link: Link) => {
    setEditingLink(link)
    setFormData({ title: link.title, url: link.url })
    setShowAddForm(false)
  }

  const cancelEdit = () => {
    setEditingLink(null)
    setFormData({ title: '', url: '' })
    setShowAddForm(false)
  }

  // Функции для работы с популярными ссылками
  const handleSelectPopularLink = (popularLink: PopularLink) => {
    setFormData({
      title: popularLink.title,
      url: popularLink.url
    })
    setShowPopularLinks(false)
    setShowAddForm(true)
  }

  const handleAddCustomLink = () => {
    setFormData({ title: '', url: '' })
    setShowPopularLinks(false)
    setShowAddForm(true)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ссылки</h1>
          <p className="mt-2 text-gray-600">
            Управляйте своими ссылками и их порядком
          </p>
        </div>

        {/* Popular Links Modal */}
        {showPopularLinks && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Выберите популярную ссылку
                </h2>
                <button
                  onClick={() => setShowPopularLinks(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                {/* Popular Links Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
                  {popularLinks.map(link => (
                    <button
                      key={link.id}
                      onClick={() => handleSelectPopularLink(link)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center"
                    >
                      <div className="text-xl mb-1">{link.icon}</div>
                      <div className="text-xs font-medium text-gray-900">{link.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                <button
                  onClick={handleAddCustomLink}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Своя ссылка
                </button>
                <button
                  onClick={() => setShowPopularLinks(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingLink) && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {editingLink ? 'Редактировать ссылку' : 'Добавить ссылку'}
              </h2>
            </div>
            <form
              onSubmit={editingLink ? handleEditLink : handleAddLink}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Например: Instagram"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingLink ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Links List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Ваши ссылки</h2>
            {!showAddForm && !editingLink && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPopularLinks(true)}
                  className="flex items-center px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Star className="h-4 w-4 mr-1" />
                  Популярные
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Добавить
                </button>
              </div>
            )}
          </div>

          {links.length === 0 ? (
            <div className="p-6 text-center">
              <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Нет ссылок</h3>
              <p className="mt-1 text-sm text-gray-500">
                Начните с добавления первой ссылки
              </p>
              <div className="mt-6 flex justify-center space-x-2">
                <button
                  onClick={() => setShowPopularLinks(true)}
                  className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Star className="h-4 w-4 mr-1" />
                  Популярные
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Добавить
                </button>
              </div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="divide-y divide-gray-200"
                  >
                    {links.map((link, index) => (
                      <Draggable key={link.id} draggableId={link.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 hover:bg-gray-50 ${
                              snapshot.isDragging ? 'bg-indigo-50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 text-sm font-medium">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {link.title}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate max-w-xs">
                                    {link.url}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                                <button
                                  onClick={() => startEdit(link)}
                                  className="p-2 text-gray-400 hover:text-indigo-600"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLink(link.id)}
                                  className="p-2 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  )
}
