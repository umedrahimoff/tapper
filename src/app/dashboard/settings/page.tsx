'use client'

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import toast from "react-hot-toast"
import { User, Mail, Trash2, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDeleteAccount = async () => {
    if (!confirm('Вы уверены? Это действие нельзя отменить!')) return

    setDeleteLoading(true)
    
    try {
      const response = await fetch('/api/account', {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Аккаунт удален')
        signOut({ callbackUrl: '/' })
      } else {
        const error = await response.json()
        toast.error(error.message || 'Ошибка при удалении аккаунта')
      }
    } catch (error) {
      toast.error('Ошибка при удалении аккаунта')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
          <p className="mt-2 text-gray-600">
            Управление аккаунтом и безопасностью
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Информация об аккаунте</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Имя</p>
                  <p className="text-sm text-gray-500">{session?.user?.name || 'Не указано'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white shadow rounded-lg border border-red-200">
            <div className="px-6 py-4 border-b border-red-200 bg-red-50">
              <h2 className="text-lg font-medium text-red-900">Опасная зона</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Удалить аккаунт</h3>
                  <p className="text-sm text-gray-500">
                    Это действие нельзя отменить. Все ваши данные будут удалены навсегда.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  Удалить аккаунт?
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Это действие нельзя отменить. Все ваши данные, включая профиль и ссылки, будут удалены навсегда.
                  </p>
                </div>
                <div className="flex justify-center space-x-3 mt-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleteLoading ? 'Удаление...' : 'Удалить'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
