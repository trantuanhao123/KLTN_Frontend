// src/components/ui/ConfirmDeleteModal.jsx
import React from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  error,
  carName,
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Xác nhận xóa xe"
      className="max-w-md" // Thu nhỏ kích thước modal một chút
    >
      <p className="text-gray-600 mb-6">
        Bạn có chắc chắn muốn xóa {carName ? `"${carName}"` : "này"} không? Hành
        động này không thể hoàn tác.
      </p>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <p className="mb-4 p-2 text-sm bg-red-100 text-red-700 rounded">
          Lỗi xóa: {error}
        </p>
      )}

      {/* Các nút hành động */}
      <div className="flex justify-end gap-3">
        {/* Nút Hủy */}
        <Button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2"
        >
          Hủy bỏ
        </Button>

        {/* Nút Xác nhận (Xóa) */}
        <Button
          onClick={onConfirm}
          disabled={loading} // Vô hiệu hóa khi đang tải
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Đang xóa..." : "Xác nhận xóa"}
        </Button>
      </div>
    </Modal>
  );
}
