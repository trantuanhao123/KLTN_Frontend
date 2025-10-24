// src/pages/bookings/BookingPickup.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useAdminGetOrderById,
  useAdminConfirmPickup,
} from "../../hooks/useOrder";

// Import UI của bạn
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// --- THÀNH PHẦN UI TẠM THỜI ---
// (Vì bạn chưa cung cấp, tôi tạm định nghĩa Input ở đây)
const Input = (props) => (
  <input
    {...props}
    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
  />
);
// ------------------------------

// Hàm helper (bạn có thể import từ file utils)
const formatCurrency = (value) => {
  if (value === null || value === undefined) return "0 VNĐ";
  return Number(value).toLocaleString("vi-VN") + " VNĐ";
};

export default function BookingPickup() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Lấy thông tin đơn hàng
  const {
    data: order,
    loading: fetchLoading,
    error: fetchError,
  } = useAdminGetOrderById(id);

  // 2. Hook xử lý mutation
  const [confirmPickup, { loading: updateLoading, error: updateError }] =
    useAdminConfirmPickup();

  // 3. State cho form
  const [cashAmount, setCashAmount] = useState(0);

  // 4. Cập nhật state nếu order đã cọc
  useEffect(() => {
    if (order && order.remainingAmount > 0) {
      setCashAmount(order.remainingAmount);
    }
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {};
      if (order && order.remainingAmount > 0) {
        payload.cashAmount = cashAmount;
      }

      await confirmPickup(id, payload);
      alert("Bàn giao xe thành công!");
      navigate("/bookings"); // Quay về trang danh sách
    } catch (err) {
      console.error(err);
    }
  };

  const renderFormContent = () => {
    if (fetchLoading) return <p>Đang tải thông tin đơn hàng...</p>;
    if (fetchError)
      return (
        <p className="text-red-500">
          Lỗi: {fetchError.response?.data?.error || fetchError.message}
        </p>
      );
    if (!order) return <p>Không tìm thấy đơn hàng.</p>;

    if (order.STATUS !== "CONFIRMED") {
      return (
        <div>
          <p className="text-red-500 font-semibold">Không thể bàn giao.</p>
          <p>
            Đơn hàng không ở trạng thái "Đã xác nhận" (mà là: {order.STATUS}).
          </p>
        </div>
      );
    }

    // === UI chính ===
    return (
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <p>
            <strong>Mã đơn hàng:</strong> {order.ORDER_CODE}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {formatCurrency(order.FINAL_AMOUNT)}
          </p>
          <hr />

          {order.remainingAmount > 0 ? (
            // Case 2: Đơn cọc (PARTIAL)
            <div>
              <label
                htmlFor="remaining"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số tiền mặt CẦN THU (90% còn lại):
              </label>
              <p className="text-2xl font-bold text-blue-600 mb-3">
                {formatCurrency(order.remainingAmount)}
              </p>

              <label
                htmlFor="cashAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nhập số tiền thực tế đã thu:
              </label>
              <Input
                type="number"
                id="cashAmount"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                required
              />
            </div>
          ) : (
            // Case 1: Đơn đã trả đủ (PAID)
            <p className="text-green-600 font-semibold">
              Đơn hàng này đã thanh toán 100%. Không cần thu thêm tiền.
            </p>
          )}

          {/* Nút bấm sử dụng component Button của bạn */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-green-600 text-white" // Ghi đè màu bg-primary
              disabled={updateLoading}
            >
              {updateLoading ? "Đang xử lý..." : "Xác nhận Bàn Giao Xe"}
            </Button>
          </div>

          {updateError && (
            <p className="text-red-500 mt-4">
              Lỗi khi cập nhật:{" "}
              {updateError.response?.data?.error || updateError.message}
            </p>
          )}
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Xác nhận Bàn Giao Xe
        </h1>
        <Link to="/bookings">
          {/* Sử dụng Button của bạn và ghi đè màu */}
          <Button className="bg-gray-500 hover:bg-gray-600 text-white">
            ← Quay lại
          </Button>
        </Link>
      </div>

      {/* Sử dụng Card của bạn (nó đã có p-4) */}
      <Card>{renderFormContent()}</Card>
    </Layout>
  );
}
