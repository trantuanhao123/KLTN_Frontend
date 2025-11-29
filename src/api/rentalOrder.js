import axiosClient from "./axiosClient";

// 1. Lấy tất cả đơn hàng
// GET /api/orders/
export const adminGetAllOrders = () => {
  // Thay đổi: Xóa "/admin/all", dùng "/"
  return axiosClient.get("/order/");
};

// 2. Lấy chi tiết 1 đơn hàng
// GET /api/orders/:id
export const adminGetOrderById = (orderId) => {
  // Thay đổi: Xóa "/admin"
  return axiosClient.get(`/order/${orderId}`);
};

// 3. Xóa cứng 1 đơn hàng
// DELETE /api/orders/:id
export const adminHardDeleteOrder = (orderId) => {
  // Thay đổi: Xóa "/admin"
  return axiosClient.delete(`/order/${orderId}`);
};

// 4. Lấy lịch sử thuê của 1 user
// GET /api/orders/user/:userId
export const adminGetUserOrders = (userId) => {
  // Thay đổi: Xóa "/admin"
  return axiosClient.get(`/order/user/${userId}`);
};

// 5. Admin tự tạo đơn (Manual Order)
// POST /api/orders/admin/create
export const adminCreateManualOrder = (orderDetails) => {
  // Thay đổi: Sửa lại route
  return axiosClient.post("/order/admin/create", orderDetails);
};

// 6. Admin cập nhật đơn hàng
// PATCH /api/orders/admin/update/:id
export const adminUpdateOrder = (orderId, updateData) => {
  // Thay đổi: Sửa lại route
  return axiosClient.patch(`/order/admin/update/${orderId}`, updateData);
};
// 7. Admin xác nhận bàn giao xe (Pickup)
// PATCH /api/orders/pickup/:id
export const adminConfirmPickup = (orderId, pickupData) => {
  return axiosClient.patch(`/order/pickup/${orderId}`, pickupData);
};

// 8. Admin xác nhận trả xe (Complete)
// PATCH /api/orders/:id/complete
export const adminCompleteOrder = (orderId, completeData) => {
  return axiosClient.patch(`/order/${orderId}/complete`, completeData);
};
