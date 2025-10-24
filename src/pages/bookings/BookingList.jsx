import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useAdminGetAllOrders,
  useAdminDeleteOrder,
} from "../../hooks/useOrder";

// Import các component UI của bạn
import Layout from "../../components/layouts/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";

// -----------------------------------------------------------------
// Dữ liệu map và bộ lọc (Giữ nguyên)
// -----------------------------------------------------------------
const STATUS_MAP = {
  PENDING_PAYMENT: "Chờ thanh toán",
  CONFIRMED: "Đã xác nhận",
  IN_PROGRESS: "Đang thuê",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};

const FILTER_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PENDING_PAYMENT", label: "Chờ thanh toán" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "IN_PROGRESS", label: "Đang thuê" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const PAYMENT_STATUS_MAP = {
  UNPAID: "Chưa thanh toán",
  PARTIAL: "Đã cọc",
  PAID: "Đã thanh toán",
};

const PAYMENT_FILTER_OPTIONS = [
  { value: "ALL", label: "Tất cả (Thanh toán)" },
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "PARTIAL", label: "Đã cọc" },
  { value: "PAID", label: "Đã thanh toán" },
];

const getVietnameseStatus = (status) => STATUS_MAP[status] || status;
const getVietnamesePaymentStatus = (status) =>
  PAYMENT_STATUS_MAP[status] || status;

// -----------------------------------------------------------------
// Component chính: Trang danh sách đơn hàng
// -----------------------------------------------------------------
export default function BookingList() {
  // --- State quản lý Modal (Chỉ còn giữ lại cho Delete) ---
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // --- State cho bộ lọc (Giữ nguyên) ---
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("ALL");

  // --- Hooks Lấy Dữ Liệu ---
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useAdminGetAllOrders();

  // --- Hooks Thay Đổi Dữ Liệu (Mutations) ---
  const [deleteOrder, { loading: deleteLoading, error: deleteError }] =
    useAdminDeleteOrder();

  // Tải dữ liệu lần đầu khi component mount
  useEffect(() => {
    refetchOrders();
  }, [refetchOrders]);

  // --- Lọc danh sách đơn hàng (Giữ nguyên) ---
  const filteredOrders = useMemo(() => {
    let tempOrders = orders;
    if (selectedStatus !== "ALL") {
      tempOrders = tempOrders.filter(
        (order) => order.STATUS === selectedStatus
      );
    }
    if (selectedPaymentStatus !== "ALL") {
      tempOrders = tempOrders.filter(
        (order) => order.PAYMENT_STATUS === selectedPaymentStatus
      );
    }
    return tempOrders;
  }, [orders, selectedStatus, selectedPaymentStatus]);

  // --- Xử lý sự kiện ---
  const handleDelete = (id) => {
    setSelectedOrderId(id);
    setDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedOrderId) return;
    try {
      await deleteOrder(selectedOrderId);
      setDeleteModalOpen(false);
      setSelectedOrderId(null);
      refetchOrders();
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
  };

  // --- Cấu hình Bảng ---
  const tableHeaders = [
    "Mã đơn",
    "Trạng thái",
    "Thanh toán",
    "Tổng tiền",
    "Ngày tạo",
    "Hành động",
  ];

  // =================================================================
  // [SỬA ĐỔI] CẬP NHẬT HÀM RENDERROW
  // =================================================================
  const renderRow = (order) => (
    <>
      <td className="px-4 py-2 font-medium">{order.ORDER_CODE}</td>
      <td className="px-4 py-2">{getVietnameseStatus(order.STATUS)}</td>
      <td className="px-4 py-2">
        {getVietnamesePaymentStatus(order.PAYMENT_STATUS)}
      </td>
      <td className="px-4 py-2">
        {Number(order.FINAL_AMOUNT).toLocaleString("vi-VN")} VNĐ
      </td>
      <td className="px-4 py-2">
        {new Date(order.CREATED_AT).toLocaleDateString("vi-VN")}
      </td>
      <td className="px-4 py-2">
        <div className="flex flex-wrap gap-2">
          {/* Nút Xem (Chi tiết) */}
          <Link to={`/bookings/${order.ORDER_ID}`}>
            <Button className="bg-blue-500 text-white text-xs">Xem</Button>
          </Link>

          {/* Nút Gia Hạn (Sửa) */}
          <Link to={`/bookings/edit/${order.ORDER_ID}`}>
            <Button className="bg-yellow-500 text-white text-xs">
              Gia Hạn
            </Button>
          </Link>

          {/* [MỚI] Nút Bàn Giao Xe */}
          {/* Chỉ hiển thị khi đơn đã "Đã xác nhận" */}
          {order.STATUS === "CONFIRMED" && (
            <Link to={`/bookings/pickup/${order.ORDER_ID}`}>
              <Button className="bg-green-500 text-white text-xs">
                Bàn Giao
              </Button>
            </Link>
          )}

          {/* [MỚI] Nút Xác Nhận Trả Xe */}
          {/* Chỉ hiển thị khi đơn "Đang thuê" */}
          {order.STATUS === "IN_PROGRESS" && (
            <Link to={`/bookings/complete/${order.ORDER_ID}`}>
              <Button className="bg-indigo-600 text-white text-xs">
                Trả Xe
              </Button>
            </Link>
          )}

          {/* Nút Xóa */}
          <Button
            className="bg-red-600 text-white text-xs"
            onClick={() => handleDelete(order.ORDER_ID)}
          >
            Xóa
          </Button>
        </div>
      </td>
    </>
  );
  // =================================================================
  // KẾT THÚC SỬA ĐỔI
  // =================================================================

  return (
    <Layout>
      {/* --- Tiêu đề và Nút tạo mới --- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <Link to="/bookings/new">
          <Button>Tạo đơn</Button>
        </Link>
      </div>

      {/* --- Hiển thị lỗi chung --- */}
      {ordersError && (
        <Card className="bg-red-100 text-red-700 mb-4">
          <p>Lỗi khi tải danh sách: {ordersError.message}</p>
        </Card>
      )}

      {/* --- Bảng dữ liệu --- */}
      <Card>
        {/* --- Bộ lọc (Filter) --- */}
        <div className="flex space-x-4 mb-4">
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lọc theo trạng thái:
            </label>
            <select
              id="status-filter"
              className="block w-full min-w-[200px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="payment-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lọc theo thanh toán:
            </label>
            <select
              id="payment-filter"
              className="block w-full min-w-[200px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            >
              {PAYMENT_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* --- Hết Bộ lọc --- */}

        {ordersLoading ? (
          <p>Đang tải danh sách đơn hàng...</p>
        ) : (
          <Table
            headers={tableHeaders}
            data={filteredOrders}
            renderRow={renderRow}
          />
        )}
      </Card>

      {/* --- CÁC MODAL --- */}
      <Modal
        title="Xác nhận Xóa"
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        className="max-w-md"
      >
        <p className="mb-4">
          Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này không? Hành động này
          không thể hoàn tác.
        </p>
        {deleteError && (
          <p className="text-red-600 text-sm mb-2">
            Lỗi: {deleteError.response?.data?.error || deleteError.message}
          </p>
        )}
        <div className="flex justify-end space-x-3">
          <Button
            className="bg-gray-200 text-gray-700"
            onClick={() => setDeleteModalOpen(false)}
          >
            Hủy
          </Button>
          <Button
            className="bg-red-600 text-white"
            onClick={onConfirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Đang xóa..." : "Xác nhận Xóa"}
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}
