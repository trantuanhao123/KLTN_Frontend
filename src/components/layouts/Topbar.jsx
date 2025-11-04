import React from "react";
import { Link } from "react-router-dom"; // Import Link
import { useAuth } from "../../hooks/AuthContext";
import Button from "../../components/ui/Button";

export default function Topbar() {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b">
      <div>
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 hover:text-primary"
        >
          Trang Quản Trị
        </Link>
      </div>

      {/* Cập nhật: Div bên phải */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-700">
            Chào bạn, <strong className="font-medium">{user.FULLNAME}</strong>
          </span>
        )}

        <Button onClick={logout} className="px-3 py-1 text-sm">
          Đăng xuất
        </Button>
      </div>
    </header>
  );
}
