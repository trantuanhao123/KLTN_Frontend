import axiosClient from "./axiosClient";

const adminUserApi = {
  // 👤 Lấy danh sách tất cả user (chỉ Admin mới có quyền)
  getAll: () => axiosClient.get("/user"),

  // 🔎 Lấy chi tiết user theo ID
  getById: (id) => axiosClient.get(`/user/${id}`),

  // ✏️ Cập nhật thông tin user
  update: (id, data) => axiosClient.patch(`/user/${id}`, data),

  // ❌ Xóa user (update is_deleted hoặc xóa cứng tuỳ backend)
  delete: (id) => axiosClient.delete(`/user/${id}`),

  // ✅ Đánh dấu user đã xác minh
  verify: (id) => axiosClient.patch(`/user/${id}/verify`),

  reactivate: (id) => axiosClient.patch(`/user/unban/${id}`),
};

export default adminUserApi;
