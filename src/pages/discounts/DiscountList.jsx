// src/pages/discounts/DiscountList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDiscountManagement } from "../../hooks/useDiscount";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
// [THAY ĐỔI] Import các biến thể Button
import Button, {
  ButtonCreate,
  ButtonEdit,
  ButtonDelete,
} from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

export default function DiscountList() {
  const { discounts, isLoading, error, fetchDiscounts, removeDiscount } =
    useDiscountManagement();

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDeleteClick = (discount) => {
    setSelectedDiscount(discount);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const closeModal = () => {
    setDeleteModalOpen(false);
    setSelectedDiscount(null);
    setIsDeleting(false);
  };

  // ... (Các hàm getTypeLabel, getStatusLabel giữ nguyên) ...
  const getTypeLabel = (type) => {
    switch (type) {
      case "PERCENT":
        return "Theo %";
      case "AMOUNT":
        return "Theo tiền";
      default:
        return type;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Đang hoạt động";
      case "INACTIVE":
        return "Ngừng hoạt động";
      case "EXPIRED":
        return "Đã hết hạn";
      default:
        return status;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDiscount) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await removeDiscount(selectedDiscount.DISCOUNT_ID);
      closeModal();
    } catch (err) {
      closeModal();
      setDeleteError(err.message || "Lỗi không xác định khi xóa mã giảm giá.");
    } finally {
      setIsDeleting(false);
    }
  };

  const headers = [
    "Mã giảm giá",
    "Tên chương trình",
    "Loại giảm",
    "Giá trị",
    "Ngày bắt đầu",
    "Ngày kết thúc",
    "Số lượng",
    "Đã dùng",
    "Trạng thái",
    "Hành động",
  ];

  // [THAY ĐỔI] Thêm style cho button nhỏ
  const tableButtonStyles = "text-sm px-3 py-1";

  const renderRow = (discount) => (
    <>
      <td className="px-4 py-2 font-medium">{discount.CODE}</td>
      <td className="px-4 py-2">{discount.NAME || "N/A"}</td>
      <td className="px-4 py-2">{getTypeLabel(discount.TYPE)}</td>
      <td className="px-4 py-2">
        {discount.TYPE === "PERCENT"
          ? `${discount.VALUE}%`
          : `${Number(discount.VALUE).toLocaleString("vi-VN")} đ`}
      </td>
      <td className="px-4 py-2">{formatDisplayDate(discount.START_DATE)}</td>
      <td className="px-4 py-2">{formatDisplayDate(discount.END_DATE)}</td>
      <td className="px-4 py-2">{discount.QUANTITY ?? "Không giới hạn"}</td>
      <td className="px-4 py-2">{discount.USED_COUNT}</td>
      <td className="px-4 py-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            discount.STATUS === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : discount.STATUS === "EXPIRED"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {getStatusLabel(discount.STATUS)}
        </span>
      </td>
      <td className="px-4 py-2">
        <div className="flex gap-2">
          {/* [THAY ĐỔI] Sử dụng ButtonEdit */}
          <Link to={`/discounts/edit/${discount.DISCOUNT_ID}`}>
            <ButtonEdit className={tableButtonStyles}>Sửa</ButtonEdit>
          </Link>

          {/* [THAY ĐỔI] Sử dụng ButtonDelete */}
          <ButtonDelete
            onClick={() => handleDeleteClick(discount)}
            className={tableButtonStyles}
            disabled={isDeleting}
          >
            Xóa
          </ButtonDelete>
        </div>
      </td>
    </>
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý Mã giảm giá
        </h1>
        <Link to="/discounts/new">
          {/* [THAY ĐỔI] Sử dụng ButtonCreate */}
          <ButtonCreate>Thêm mã giảm giá</ButtonCreate>
        </Link>
      </div>

      {/* ... (Phần hiển thị lỗi giữ nguyên) ... */}
      {deleteError && (
        <div className="mb-4 p-3 rounded text-sm bg-red-100 text-red-700 flex justify-between items-center">
          <span>{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="ml-2 text-red-900 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <Card>
        {/* ... (Phần Loading/Error/Table giữ nguyên) ... */}
        {error && discounts.length === 0 ? (
          <div className="text-center text-red-600 py-6">
            Lỗi khi tải dữ liệu: {error.message || "Không thể kết nối máy chủ"}
          </div>
        ) : isLoading && discounts.length === 0 ? (
          <div className="text-center p-6">Đang tải dữ liệu...</div>
        ) : discounts.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            Không có mã giảm giá nào.
          </div>
        ) : (
          <Table headers={headers} data={discounts} renderRow={renderRow} />
        )}
      </Card>

      {/* [THAY ĐỔI] Cập nhật button trong Modal */}
      {selectedDiscount && (
        <Modal
          open={isDeleteModalOpen}
          onClose={closeModal}
          title="Xác nhận xóa"
        >
          <p>
            Bạn có chắc chắn muốn xóa mã{" "}
            <strong>{selectedDiscount.CODE}</strong> không?
          </p>
          <p className="text-sm text-red-600">
            Lưu ý: Bạn không thể xóa mã đã được áp dụng cho đơn hàng.
          </p>

          <div className="flex justify-end gap-2 pt-4">
            {/* [THAY ĐỔI] Nút Hủy (màu xám) */}
            <Button
              onClick={closeModal}
              disabled={isDeleting}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Hủy
            </Button>

            {/* [THAY ĐỔI] Nút Xóa (màu đỏ) */}
            <ButtonDelete onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
            </ButtonDelete>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
