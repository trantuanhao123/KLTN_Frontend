import React from 'react'
import { NavLink } from 'react-router-dom'

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-md ${isActive ? 'bg-white shadow text-primary' : 'text-white/90'}`

export default function Sidebar() {
  return (
    <aside className="w-64 bg-primary text-white p-4 flex flex-col">
      <div className="mb-6">
        <div className="font-bold text-xl">Rentify</div>
        <div className="text-sm opacity-90">Admin Panel</div>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink to="/" className={navItemClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/vehicles" className={navItemClass}>
          Quản lý xe
        </NavLink>
        <NavLink to="/bookings" className={navItemClass}>
          Lịch thuê
        </NavLink>
        <NavLink to="/customers" className={navItemClass}>
          Khách hàng
        </NavLink>
        <NavLink to="/reports" className={navItemClass}>
          Báo cáo
        </NavLink>
      </nav>

      <div className="mt-6 text-sm opacity-90">© {new Date().getFullYear()} Rentify</div>
    </aside>
  )
}