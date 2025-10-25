'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import toast from "react-hot-toast"
import { Plus, Link as LinkIcon, Trash2, Edit2, ExternalLink } from "lucide-react"

interface Link {
  id: string
  title: string
  url: string
  order: number
  isActive: boolean
}

export default function LinksPage() {
  const { data: session } = useSession()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
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
        toast.success('Ссылка добавлена!')
        setFormData({ title: '', url: '' })
        setShowAddForm(false)
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
        toast.success('Ссылка обновлена!')
        setEditingLink(null)
        setFormData({ title: '', url: '' })
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
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить ссылку
              </button>
            )}
          </div>

          {links.length === 0 ? (
            <div className="p-6 text-center">
              <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Нет ссылок</h3>
              <p className="mt-1 text-sm text-gray-500">
                Начните с добавления первой ссылки
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить ссылку
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
