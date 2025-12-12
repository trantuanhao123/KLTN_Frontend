import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useAdminGetAllOrders,
  useAdminDeleteOrder,
} from "../../hooks/useOrder";

import Layout from "../../components/layouts/Layout";
import Button, {
  ButtonCreate,
  ButtonRead,
  ButtonEdit,
  ButtonDelete,
} from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";

const STATUS_MAP = {
  PENDING_PAYMENT: "Chờ thanh toán",
  CONFIRMED: "Đã xác nhận",
  IN_PROGRESS: "Đang thuê",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};

const PAYMENT_STATUS_MAP = {
  UNPAID: "Chưa thanh toán",
  PARTIAL: "Đã cọc",
  PAID: "Đã thanh toán",
};

const FILTER_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  ...Object.entries(STATUS_MAP).map(([v, l]) => ({ value: v, label: l })),
];

const PAYMENT_FILTER_OPTIONS = [
  { value: "ALL", label: "Tất cả (Thanh toán)" },
  ...Object.entries(PAYMENT_STATUS_MAP).map(([v, l]) => ({
    value: v,
    label: l,
  })),
];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 border border-blue-300";
    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800 border border-purple-300";
    case "COMPLETED":
      return "bg-green-100 text-green-800 border border-green-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};

const getPaymentBadgeClass = (status) => {
  switch (status) {
    case "UNPAID":
      return "bg-red-100 text-red-800 border border-red-300";
    case "PARTIAL":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "PAID":
      return "bg-green-100 text-green-800 border border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};

export default function BookingList() {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("ALL");

  const {
    data: orders = [],
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useAdminGetAllOrders();

  const [deleteOrder, { loading: deleteLoading, error: deleteError }] =
    useAdminDeleteOrder();

  useEffect(() => {
    refetchOrders();
  }, [refetchOrders]);

  const filteredOrders = useMemo(() => {
    let tempOrders = orders;
    if (selectedStatus !== "ALL") {
      tempOrders = tempOrders.filter((o) => o.STATUS === selectedStatus);
    }
    if (selectedPaymentStatus !== "ALL") {
      tempOrders = tempOrders.filter(
        (o) => o.PAYMENT_STATUS === selectedPaymentStatus
      );
    }
    return tempOrders;
  }, [orders, selectedStatus, selectedPaymentStatus]);

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

  const tableHeaders = [
    "Mã đơn",
    "Trạng thái",
    "Thanh toán",
    "Tổng tiền",
    "Ngày tạo",
    "Hành động",
  ];

  const renderRow = (order) => {
    // Logic kiểm tra điều kiện ẩn nút xóa
    const shouldHideDelete =
      order.STATUS === "COMPLETED" && order.PAYMENT_STATUS === "PAID";

    return (
      <>
        <td className="px-4 py-2 font-medium">{order.ORDER_CODE}</td>
        <td className="px-4 py-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
              order.STATUS
            )}`}
          >
            {STATUS_MAP[order.STATUS] || order.STATUS}
          </span>
        </td>
        <td className="px-4 py-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getPaymentBadgeClass(
              order.PAYMENT_STATUS
            )}`}
          >
            {PAYMENT_STATUS_MAP[order.PAYMENT_STATUS] || order.PAYMENT_STATUS}
          </span>
        </td>
        <td className="px-4 py-2">
          {Number(order.FINAL_AMOUNT).toLocaleString("vi-VN")} VNĐ
        </td>
        <td className="px-4 py-2">
          {new Date(order.CREATED_AT).toLocaleDateString("vi-VN")}
        </td>
        <td className="px-4 py-2">
          <div className="flex flex-wrap gap-2">
            <Link to={`/bookings/${order.ORDER_ID}`}>
              <ButtonRead className="text-xs px-3 py-1">Chi Tiết</ButtonRead>
            </Link>

            <Link to={`/bookings/edit/${order.ORDER_ID}`}>
              <ButtonEdit className="text-xs px-3 py-1">Gia Hạn</ButtonEdit>
            </Link>

            {order.STATUS === "CONFIRMED" && (
              <Link to={`/bookings/pickup/${order.ORDER_ID}`}>
                <ButtonCreate className="text-xs px-3 py-1">
                  Bàn Giao
                </ButtonCreate>
              </Link>
            )}

            {order.STATUS === "IN_PROGRESS" && (
              <Link to={`/bookings/complete/${order.ORDER_ID}`}>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-xs px-3 py-1">
                  Trả Xe
                </Button>
              </Link>
            )}

            {/* Chỉ hiện nút Xóa nếu KHÔNG thỏa mãn cả 2 điều kiện (Completed + Paid) */}
            {!shouldHideDelete && (
              <ButtonDelete
                className="text-xs px-3 py-1"
                onClick={() => handleDelete(order.ORDER_ID)}
              >
                Xóa
              </ButtonDelete>
            )}
          </div>
        </td>
      </>
    );
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <Link to="/bookings/new">
          <ButtonCreate>Thêm đơn</ButtonCreate>
        </Link>
      </div>

      {ordersError && (
        <Card className="bg-red-100 text-red-700 mb-4">
          <p>Lỗi khi tải danh sách: {ordersError.message}</p>
        </Card>
      )}

      <Card>
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lọc theo trạng thái:
            </label>
            <select
              className="block w-full min-w-[200px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lọc theo thanh toán:
            </label>
            <select
              className="block w-full min-w-[200px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            >
              {PAYMENT_FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            onClick={() => setDeleteModalOpen(false)}
          >
            Hủy
          </Button>

          <ButtonDelete onClick={onConfirmDelete} disabled={deleteLoading}>
            {deleteLoading ? "Đang xóa..." : "Xác nhận Xóa"}
          </ButtonDelete>
        </div>
      </Modal>
    </Layout>
  );
}
