import axiosClient from "./axiosClient"; // Giả sử axiosClient ở thư mục gốc /api

const notificationApi = {
  /**
   * [USER] Lấy tất cả thông báo của user đang đăng nhập
   * GET /api/v1/notifications
   */
  getMyNotifications: () => {
    return axiosClient.get("/notification");
  },

  /**
   * [ADMIN] Tạo thông báo cho 1 user
   * POST /api/v1/notifications/user
   */
  createForUser: (data) => {
    // data = { userId, title, content }
    return axiosClient.post("/notification/user", data);
  },

  /**
   * [ADMIN] Tạo thông báo cho tất cả user
   * POST /api/v1/notifications/all-users
   */
  createForAll: (data) => {
    // data = { title, content }
    return axiosClient.post("/notification/all-users", data);
  },

  /**
   * [USER] Đánh dấu 1 thông báo là đã đọc
   * PATCH /api/v1/notifications/read/:id
   */
  markAsRead: (id) => {
    return axiosClient.patch(`/notification/read/${id}`);
  },

  /**
   * [USER] Đánh dấu tất cả thông báo là đã đọc
   * PATCH /api/v1/notifications/read-all
   */
  markAllAsRead: () => {
    return axiosClient.patch("/notification/read-all");
  },
};

export default notificationApi;
