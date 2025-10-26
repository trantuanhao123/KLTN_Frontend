import { useState, useEffect, useCallback } from "react";
import notificationApi from "../api/notification";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Lấy danh sách thông báo
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getMyNotifications();
      setNotifications(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Tạo thông báo cho 1 user
  const createNotification = useCallback(
    async (data) => {
      try {
        await notificationApi.createForUser(data);
        await fetchNotifications();
      } catch (err) {
        setError(err.response?.data?.error || "Không thể tạo thông báo");
        throw err;
      }
    },
    [fetchNotifications]
  );

  // 🔹 Đánh dấu đã đọc
  const markAsRead = useCallback(
    async (id) => {
      await notificationApi.markAsRead(id);
      await fetchNotifications();
    },
    [fetchNotifications]
  );

  // 🔹 Đánh dấu tất cả đã đọc
  const markAllAsRead = useCallback(async () => {
    await notificationApi.markAllAsRead();
    await fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.IS_READ).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
  };
}
