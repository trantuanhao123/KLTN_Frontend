import React, { useState } from "react"; // 👈 Thêm useState
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { Link } from "react-router-dom";
import useCars from "../../hooks/useCar";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal"; // 👈 Import modal mới

const BACKEND_URL = import.meta.env.BACKEND_URL || "http://localhost:8080";

export default function VehicleList() {
  const { cars, loading, error, deleteCar } = useCars(); // 👈 Lấy hàm deleteCar

  // 🆕 STATE QUẢN LÝ MODAL XÁC NHẬN
  const [isModalOpen, setIsModalOpen] = useState(false);
  // carToDelete sẽ chứa toàn bộ thông tin xe (hoặc ít nhất là ID và Tên/Model)
  const [carToDelete, setCarToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // State cho trạng thái xóa
  const [deleteError, setDeleteError] = useState(null);

  const headers = [
    "STT",
    "Hình ảnh",
    "Loại / Model",
    "Trạng thái",
    "Giá (VNĐ/ngày)",
    "Hành động",
  ];

  // 🆕 HÀM MỞ MODAL
  // Nhận vào đối tượng xe để có thể hiển thị thông tin chi tiết trong modal
  const handleDeleteClick = (car) => {
    setCarToDelete(car);
    setIsModalOpen(true);
    setDeleteError(null);
  };

  // 🆕 HÀM XỬ LÝ XÓA KHI ĐÃ XÁC NHẬN
  const handleConfirmDelete = async () => {
    if (!carToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteCar(carToDelete.CAR_ID); // Gọi hàm xóa từ hook

      // Xóa thành công
      setIsModalOpen(false);
      setCarToDelete(null);
      // Bạn có thể thêm thông báo "Xóa thành công" ở đây (ví dụ: Toast)
    } catch (err) {
      // Xóa thất bại
      setDeleteError(err.message || "Lỗi không xác định khi xóa xe.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 🆕 HÀM ĐÓNG MODAL
  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setCarToDelete(null);
    setDeleteError(null);
  };

  return (
    <Layout>
      {/* ... (Phần tiêu đề và nút Thêm xe) ... */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Quản lý xe</h3>
        <Link to="/vehicles/new">
          <Button>Thêm xe</Button>
        </Link>
      </div>

      <Card>
        {/* ... (Phần Loading/Error/No data) ... */}
        {loading ? (
          <p className="p-4 text-gray-500">Đang tải danh sách xe...</p>
        ) : error ? (
          <p className="p-4 text-red-500">Lỗi: {error}</p>
        ) : cars.length === 0 ? (
          <p className="p-4 text-gray-500">Chưa có xe nào trong hệ thống.</p>
        ) : (
          <Table
            headers={headers}
            data={cars}
            renderRow={(row, idx) => (
              <>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={
                      row.mainImageUrl
                        ? `${BACKEND_URL}/images/${row.mainImageUrl}`
                        : "/no-image.jpg"
                    }
                    alt={`${row.BRAND} ${row.MODEL}`}
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <div>
                    {row.BRAND} {row.MODEL}
                    <div className="text-xs text-gray-500">
                      Biển số: {row.LICENSE_PLATE}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      row.STATUS === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.STATUS}
                  </span>
                </td>
                <td className="px-4 py-2 font-medium">
                  {Number(row.PRICE_PER_DAY).toLocaleString("vi-VN")}₫
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Link to={`/vehicles/${row.CAR_ID}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1">
                        Chi tiết
                      </Button>
                    </Link>
                    <Link to={`/vehicles/edit/${row.CAR_ID}`}>
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-3 py-1">
                        Sửa
                      </Button>
                    </Link>
                    {/* 🆕 GỌI HÀM MỞ MODAL, truyền đối tượng xe (row) */}
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
                      onClick={() => handleDeleteClick(row)}
                    >
                      Xóa
                    </Button>
                  </div>
                </td>
              </>
            )}
          />
        )}
      </Card>

      {/* 🆕 COMPONENT MODAL XÁC NHẬN */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        error={deleteError}
        // Truyền tên xe để hiển thị rõ trong modal
        carName={carToDelete ? `${carToDelete.BRAND} ${carToDelete.MODEL}` : ""}
      />
    </Layout>
  );
}
