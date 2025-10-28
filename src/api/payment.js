import axiosClient from "./axiosClient";

// 1. Lấy danh sách chờ hoàn tiền
// GET /api/payments/refunds-pending
export const adminGetPendingRefunds = () => {
  // Thay đổi: Xóa "/admin"
  return axiosClient.get("/payment/refunds-pending");
};

// 2. Xác nhận đã hoàn tiền
// PATCH /api/payments/confirm-refund/:paymentId
export const adminConfirmRefund = (paymentId) => {
  // Thay đổi: Xóa "/admin"
  return axiosClient.patch(`/payment/confirm-refund/${paymentId}`);
};
