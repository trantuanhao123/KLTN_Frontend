import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
    isActive
      ? "bg-white shadow text-primary font-semibold"
      : "text-white/90 hover:bg-white/10"
  }`;

export default function Sidebar() {
  const [isManageOpen, setIsManageOpen] = useState(false);

  return (
    <aside className="w-64 bg-primary text-white p-4 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="font-bold text-xl">QL Cho Thuê Xe - 103</div>
        <div className="text-sm opacity-90">GVHD: Cô Lữ Thị Cẩm Tú</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <NavLink to="/" className={navItemClass} end>
          Trang Chủ
        </NavLink>

        {/* Nhóm quản lý */}
        <button
          onClick={() => setIsManageOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-2 text-left rounded-md hover:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-3">
            <span>Quản lý</span>
          </span>
          {isManageOpen ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </button>

        {/* Menu con */}
        {isManageOpen && (
          <div className="ml-6 mt-1 space-y-1 border-l border-white/20 pl-3">
            <NavLink to="/vehicles" className={navItemClass}>
              Xe
            </NavLink>
            <NavLink to="/bookings" className={navItemClass}>
              Lịch thuê
            </NavLink>
            <NavLink to="/categories" className={navItemClass}>
              Danh mục xe
            </NavLink>
            <NavLink to="/services" className={navItemClass}>
              Dịch vụ xe
            </NavLink>
            <NavLink to="/incidents" className={navItemClass}>
              Sự cố
            </NavLink>
            <NavLink to="/branches" className={navItemClass}>
              Chi nhánh
            </NavLink>
            <NavLink to="/customers" className={navItemClass}>
              Khách hàng
            </NavLink>
          </div>
        )}
        {/* Các mục khác */}
        <NavLink to="/reports" className={navItemClass}>
          Báo cáo
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="mt-6 text-sm opacity-90">
        © {new Date().getFullYear()} Khóa Luận Tốt Nghiệp
      </div>
    </aside>
  );
}
