// src/pages/payment/RefundList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button, { ButtonCreate, ButtonRead } from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import {
  useAdminGetPendingRefunds,
  useAdminConfirmRefund,
} from "../../hooks/usePayment";

export default function RefundList() {
  const { data, loading, error, refetch } = useAdminGetPendingRefunds();
  const [confirmRefund, { loading: confirming }] = useAdminConfirmRefund();

  // ... (Toàn bộ logic state và hàm giữ nguyên) ...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [confirmError, setConfirmError] = useState(null);

  const handleOpenConfirmModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setConfirmError(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    if (confirming) return;
    setIsModalOpen(false);
    setSelectedPaymentId(null);
    setConfirmError(null);
  };
  const handleExecuteConfirm = async () => {
    if (!selectedPaymentId) return;
    setConfirmError(null);
    try {
      await confirmRefund(selectedPaymentId);
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error("Confirm refund error:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Có lỗi xảy ra";
      setConfirmError(errorMsg);
    }
  };

  const formatCurrency = (amount) => {
    return `${Number(amount).toLocaleString("vi-VN")}₫`;
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tableButtonStyles = "text-sm px-3 py-1";

  // [ĐÃ SỬA] Render mỗi row
  const renderRow = (item, idx) => (
    <>
      <td className="px-4 py-2">
        {/* [FIX] Bỏ text-sm, đổi font-mono -> font-medium */}
        <span className="font-medium">{item.PAYMENT_ID}</span>
      </td>
      <td className="px-4 py-2">
        {/* [FIX] Bỏ text-sm, đổi font-mono -> font-medium */}
        <span className="font-medium">{item.ORDER_CODE}</span>
      </td>
      <td className="px-4 py-2">
        <span className="font-semibold text-red-600">
          {formatCurrency(item.AMOUNT)}
        </span>
      </td>
      <td className="px-4 py-2">
        {/* (Giữ nguyên) text-xs là chuẩn cho badge */}
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          {item.METHOD}
        </span>
      </td>
      <td className="px-4 py-2">
        {/* (Giữ nguyên) font-mono, text-xs là hợp lý cho mã giao dịch phụ */}
        <span className="font-mono text-xs text-gray-600">
          {item.TRANSACTION_CODE}
        </span>
      </td>
      <td className="px-4 py-2">
        {/* (Giữ nguyên) text-sm là chuẩn cho ngày giờ */}
        <span className="text-sm text-gray-700">
          {formatDate(item.TRANSACTION_DATE)}
        </span>
      </td>
      <td className="px-4 py-2">
        {/* (Giữ nguyên) text-sm là chuẩn cho ghi chú */}
        <span
          className="text-sm text-gray-600 max-w-xs truncate block"
          title={item.NOTE}
        >
          {item.NOTE || "-"}
        </span>
      </td>
      <td className="px-4 py-2">
        {/* (Giữ nguyên) Phần button đã đồng bộ */}
        <div className="flex gap-2">
          {item.ORDER_ID && (
            <Link to={`/bookings/${item.ORDER_ID}`}>
              <ButtonRead className={tableButtonStyles}>Chi tiết</ButtonRead>
            </Link>
          )}
          <ButtonCreate
            className={tableButtonStyles}
            disabled={confirming}
            onClick={() => handleOpenConfirmModal(item.PAYMENT_ID)}
          >
            {confirming ? "Đang xử lý..." : "Xác nhận"}
          </ButtonCreate>
        </div>
      </td>
    </>
  );

  return (
    <Layout>
      {/* ... (Toàn bộ phần Header, Card, Modal giữ nguyên) ... */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý giao dịch cần hoàn tiền
        </h1>
        <Button
          onClick={refetch}
          className={`bg-gray-300 hover:bg-gray-400 text-gray-800 ${tableButtonStyles}`}
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </Button>
      </div>

      {!loading && !error && data && data.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm text-gray-700">
            Tìm thấy <strong className="text-blue-600">{data.length}</strong>{" "}
            giao dịch cần hoàn tiền.
          </p>
        </div>
      )}

      <Card>
        {loading ? (
          <p className="p-4 text-gray-500">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="p-4 text-red-500">
            Lỗi tải dữ liệu: {error.response?.data?.message || error.message}
          </p>
        ) : !data || data.length === 0 ? (
          <p className="p-4 text-gray-500">
            Không có giao dịch nào cần hoàn tiền.
          </p>
        ) : (
          <Table
            headers={[
              "Mã GD",
              "Mã Đơn hàng",
              "Số tiền",
              "Phương thức",
              "Mã giao dịch",
              "Ngày giao dịch",
              "Ghi chú",
              "Hành động",
            ]}
            data={data}
            renderRow={renderRow}
          />
        )}
      </Card>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Xác nhận hoàn tiền"
      >
        <div>
          <p className="text-gray-700 mb-3">
            Bạn có chắc chắn muốn xác nhận đã hoàn tiền cho giao dịch này?
          </p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">
            Mã GD: {selectedPaymentId}
          </p>
        </div>

        {confirmError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm">
            <strong>Xác nhận thất bại:</strong> {confirmError}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <Button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={handleCloseModal}
            disabled={confirming}
          >
            Hủy
          </Button>
          <ButtonCreate onClick={handleExecuteConfirm} disabled={confirming}>
            {confirming ? "Đang xử lý..." : "Xác nhận"}
          </ButtonCreate>
        </div>
      </Modal>
    </Layout>
  );
}
