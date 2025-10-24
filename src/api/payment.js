import axiosClient from "./axiosClient";

// 1. Lấy danh sách chờ hoàn tiền
// GET /api/payments/refunds-pending
export const adminGetPendingRefunds = () => {
  // Thay đổi: Xóa "/admin"
  return axiosClient.get("/api/payments/refunds-pending");
};

// 2. Xác nhận đã hoàn tiền
// PATCH /api/payments/confirm-refund/:paymentId
export const adminConfirmRefund = (paymentId) => {
  // Thay đổi: Xóa "/admin"
  return axiosClient.patch(`/api/payments/confirm-refund/${paymentId}`);
};
