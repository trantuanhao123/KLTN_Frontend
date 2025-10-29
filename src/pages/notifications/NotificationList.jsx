import React, { useState } from "react";
import useNotifications from "../../hooks/useNotification";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table"; // 1. Import Table
import { Link } from "react-router-dom";
// 2. Không cần import NotificationForm nữa

export default function NotificationList() {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    // refetch không cần nữa nếu bỏ form modal
  } = useNotifications();

  const [filter, setFilter] = useState("unread"); // "all" | "unread" | "read"
  // 3. Loại bỏ state showForm

  // Lọc danh sách dựa theo trạng thái đọc
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return n.IS_READ === 0;
    if (filter === "read") return n.IS_READ === 1;
    return true;
  });

  // 4. Định nghĩa headers cho bảng
  const headers = [
    "Trạng thái",
    "Tiêu đề",
    "Nội dung",
    "Thời gian",
    "Hành động",
  ];

  return (
    <Layout>
      {/* 5. Tiêu đề và Nút Thêm Mới - GIỐNG VehicleList */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Thông Báo ({unreadCount} chưa đọc)
        </h1>
        <Link to="/notifications/new">
          <Button>+ Tạo thông báo</Button>
        </Link>
      </div>

      {/* 6. Bộ lọc và Nút Hành Động - GIỐNG VehicleList */}
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
          <Button
            onClick={markAllAsRead}
            className="bg-green-600 text-white text-sm"
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* 7. Card chỉ chứa Bảng hoặc các trạng thái */}
      <Card>
        {loading ? (
          <p className="p-4 text-gray-500">Đang tải thông báo...</p>
        ) : error ? (
          <p className="p-4 text-red-500">Lỗi: {error}</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="p-4 text-gray-500">Không có thông báo nào phù hợp.</p>
        ) : (
          // 8. Sử dụng Table thay vì <ul>
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
                    <Button
                      onClick={() => markAsRead(n.NOTIFICATION_ID)}
                      size="sm"
                      className="text-xs bg-green-600 text-white"
                    >
                      Đã đọc
                    </Button>
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
