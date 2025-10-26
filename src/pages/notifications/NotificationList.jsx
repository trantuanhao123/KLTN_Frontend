import React, { useState } from "react";
import useNotifications from "../../hooks/useNotification";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import NotificationForm from "./NotificationForm";
import { Link } from "react-router-dom";

export default function NotificationList() {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotifications();

  const [filter, setFilter] = useState("unread"); // "all" | "unread" | "read"
  const [showForm, setShowForm] = useState(false);

  // Lọc danh sách dựa theo trạng thái đọc
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return n.IS_READ === 0;
    if (filter === "read") return n.IS_READ === 1;
    return true;
  });

  return (
    <Layout>
      <Card title={`Thông Báo (${unreadCount} chưa đọc)`} className="relative">
        {/* Bộ lọc + Nút thêm */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Lọc:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="unread">Chưa đọc</option>
              <option value="read">Đã đọc</option>
              <option value="all">Tất cả</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                className="bg-green-600 text-white text-sm"
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
            <Link
              to="/notifications/new"
              className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              + Tạo thông báo
            </Link>
          </div>
        </div>

        {/* Nội dung danh sách */}
        {loading && <p>Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && filteredNotifications.length === 0 && (
          <p className="text-gray-500">Không có thông báo nào phù hợp.</p>
        )}

        {filteredNotifications.length > 0 && (
          <ul className="space-y-3">
            {filteredNotifications.map((n) => (
              <li
                key={n.NOTIFICATION_ID}
                className={`p-4 rounded-lg border transition-all ${
                  n.IS_READ
                    ? "bg-white text-gray-600"
                    : "bg-blue-50 border-blue-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className={`font-semibold ${
                        n.IS_READ ? "text-gray-800" : "text-blue-700"
                      }`}
                    >
                      {n.TITLE}
                    </h3>
                    <p className="text-sm mt-1">{n.CONTENT}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.CREATED_AT).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  {!n.IS_READ && (
                    <Button
                      onClick={() => markAsRead(n.NOTIFICATION_ID)}
                      size="sm"
                      className="text-xs bg-green-600 text-white"
                    >
                      Đã đọc
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Form tạo thông báo */}
      {showForm && (
        <NotificationForm
          onClose={() => setShowForm(false)}
          onCreated={() => {
            refetch();
            setShowForm(false);
          }}
        />
      )}
    </Layout>
  );
}
