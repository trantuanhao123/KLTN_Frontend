// src/pages/payment/RefundList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal"; // Import Modal
import {
  useAdminGetPendingRefunds,
  useAdminConfirmRefund,
} from "../../hooks/usePayment";

export default function RefundList() {
  const { data, loading, error, refetch } = useAdminGetPendingRefunds();
  const [confirmRefund, { loading: confirming }] = useAdminConfirmRefund();

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [confirmError, setConfirmError] = useState(null); // State mới để lưu lỗi

  // Hàm mở modal và lưu ID
  const handleOpenConfirmModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setConfirmError(null); // Reset lỗi cũ khi mở modal
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    if (confirming) return; // Không cho đóng khi đang xử lý
    setIsModalOpen(false);
    setSelectedPaymentId(null);
    setConfirmError(null); // Dọn dẹp lỗi khi đóng
  };

  // Hàm thực thi xác nhận
  const handleExecuteConfirm = async () => {
    if (!selectedPaymentId) return;
    setConfirmError(null); // Xóa lỗi trước khi thử lại

    try {
      await confirmRefund(selectedPaymentId);
      refetch();
      handleCloseModal(); // Đóng modal sau khi thành công
    } catch (err) {
      console.error("Confirm refund error:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Có lỗi xảy ra";
      setConfirmError(errorMsg); // <-- THAY BẰNG SET STATE LỖI
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

  // Render mỗi row
  const renderRow = (item, idx) => (
    <>
      {/* Cập nhật: py-3 -> py-2 */}
      <td className="px-4 py-2">
        <span className="font-mono text-sm">{item.PAYMENT_ID}</span>
      </td>
      <td className="px-4 py-2">
        <span className="font-mono text-sm">{item.ORDER_CODE}</span>
      </td>
      <td className="px-4 py-2">
        <span className="font-semibold text-red-600">
          {formatCurrency(item.AMOUNT)}
        </span>
      </td>
      <td className="px-4 py-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          {item.METHOD}
        </span>
      </td>
      <td className="px-4 py-2">
        <span className="font-mono text-xs text-gray-600">
          {item.TRANSACTION_CODE}
        </span>
      </td>
      <td className="px-4 py-2">
        <span className="text-sm text-gray-700">
          {formatDate(item.TRANSACTION_DATE)}
        </span>
      </td>
      <td className="px-4 py-2">
        <span
          className="text-sm text-gray-600 max-w-xs truncate block"
          title={item.NOTE}
        >
          {item.NOTE || "-"}
        </span>
      </td>
      <td className="px-4 py-2">
        <div className="flex gap-2">
          {item.ORDER_ID && (
            <Link to={`/bookings/${item.ORDER_ID}`}>
              <Button variant="secondary" size="sm">
                Chi tiết
              </Button>
            </Link>
          )}
          <Button
            variant="primary"
            size="sm"
            disabled={confirming}
            onClick={() => handleOpenConfirmModal(item.PAYMENT_ID)} // Mở modal
          >
            {confirming ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </div>
      </td>
    </>
  );

  return (
    <Layout>
      {/* Cập nhật: Thêm tiêu đề h1 và nút Tải lại bên ngoài Card */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Danh sách giao dịch cần hoàn tiền
        </h1>
        <Button
          onClick={refetch}
          variant="secondary"
          size="sm"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </Button>
      </div>

      {/* Cập nhật: Thêm khu vực hiển thị số lượng (tương tự filter) */}
      {!loading && !error && data && data.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm text-gray-700">
            Tìm thấy <strong className="text-blue-600">{data.length}</strong>{" "}
            giao dịch cần hoàn tiền.
          </p>
        </div>
      )}

      {/* Cập nhật: Xóa prop 'title' khỏi Card */}
      <Card>
        {/* Cập nhật: Đơn giản hóa các trạng thái loading, error, empty */}
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
          // Cập nhật: Xóa div bao bọc count
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

      {/* Cập nhật Modal (giữ nguyên) */}
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

        {/* VÙNG HIỂN THỊ LỖI MỚI */}
        {confirmError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm">
            <strong>Xác nhận thất bại:</strong> {confirmError}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={confirming}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleExecuteConfirm}
            disabled={confirming}
          >
            {confirming ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}
