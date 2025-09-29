import React from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar() {
  const { user, logout } = useAuth()
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-gray-100">☰</button>
        <h2 className="text-lg font-semibold text-primary">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <button onClick={logout} className="px-3 py-1 rounded-md border text-sm">
          Đăng xuất
        </button>
      </div>
    </header>
  )
}