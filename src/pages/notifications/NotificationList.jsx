import React, { useState } from "react";
// [THAY ĐỔI] Import ButtonCreate
import Button, { ButtonCreate } from "../../components/ui/Button";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { Link } from "react-router-dom";
import useNotifications from "../../hooks/useNotification";
export default function NotificationList() {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [filter, setFilter] = useState("unread"); // "all" | "unread" | "read"

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return n.IS_READ === 0;
    if (filter === "read") return n.IS_READ === 1;
    return true;
  });

  const headers = [
    "Trạng thái",
    "Tiêu đề",
    "Nội dung",
    "Thời gian",
    "Hành động",
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Thông Báo ({unreadCount} chưa đọc)
        </h1>
        <Link to="/notifications/new">
          {/* [THAY ĐỔI] Sử dụng ButtonCreate */}
          <ButtonCreate>Thêm thông báo</ButtonCreate>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <label className="font-medium text-gray-700">
            Lọc theo trạng thái:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="unread">Chưa đọc</option>
            <option value="read">Đã đọc</option>
            <option value="all">Tất cả</option>
          </select>
        </div>

        {unreadCount > 0 && (
          // [THAY ĐỔI] Sử dụng ButtonCreate
          <ButtonCreate
            onClick={markAllAsRead}
            className="text-sm" // Giữ nguyên style text-sm từ code cũ
          >
            Đánh dấu tất cả đã đọc
          </ButtonCreate>
        )}
      </div>

      <Card>
        {loading ? (
          <p className="p-4 text-gray-500">Đang tải thông báo...</p>
        ) : error ? (
          <p className="p-4 text-red-500">Lỗi: {error}</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="p-4 text-gray-500">Không có thông báo nào phù hợp.</p>
        ) : (
          <Table
            headers={headers}
            data={filteredNotifications}
            renderRow={(n) => (
              <>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      n.IS_READ
                        ? "bg-gray-200 text-gray-700"
                        : "bg-blue-100 text-blue-700 font-semibold"
                    }`}
                  >
                    {n.IS_READ ? "Đã đọc" : "Chưa đọc"}
                  </span>
                </td>
                <td
                  className={`px-4 py-2 ${
                    !n.IS_READ ? "font-bold text-gray-900" : "text-gray-700"
                  }`}
                >
                  {n.TITLE}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{n.CONTENT}</td>
                <td className="px-4 py-2 text-xs text-gray-500">
                  {new Date(n.CREATED_AT).toLocaleString("vi-VN")}
                </td>
                <td className="px-4 py-2">
                  {!n.IS_READ && (
                    // [THAY ĐỔI] Sử dụng ButtonCreate + style button nhỏ
                    <ButtonCreate
                      onClick={() => markAsRead(n.NOTIFICATION_ID)}
                      className="text-sm px-3 py-1" // Style đồng bộ
                    >
                      Đã đọc
                    </ButtonCreate>
                  )}
                </td>
              </>
            )}
          />
        )}
      </Card>
    </Layout>
  );
}
