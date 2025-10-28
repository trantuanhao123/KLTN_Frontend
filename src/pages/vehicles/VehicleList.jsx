import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { Link } from "react-router-dom";
import useCars from "../../hooks/useCar";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

const BACKEND_URL = import.meta.env.BACKEND_URL || "http://localhost:8080";

export default function VehicleList() {
  const { cars, loading, error, deleteCar } = useCars();

  // ✅ Local state để lưu danh sách hiển thị (đã lọc)
  const [filteredCars, setFilteredCars] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");

  // ✅ State modal xác nhận xóa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Cập nhật filteredCars mỗi khi cars hoặc filterStatus thay đổi
  useEffect(() => {
    if (!cars) return;
    if (filterStatus === "ALL") setFilteredCars(cars);
    else setFilteredCars(cars.filter((car) => car.STATUS === filterStatus));
  }, [cars, filterStatus]);

  const headers = [
    "STT",
    "Hình ảnh",
    "Loại / Model",
    "Trạng thái",
    "Giá (VNĐ/ngày)",
    "Hành động",
  ];

  // 🆕 Mở modal xác nhận xóa
  const handleDeleteClick = (car) => {
    setCarToDelete(car);
    setIsModalOpen(true);
    setDeleteError(null);
  };

  // 🆕 Xác nhận xóa (soft delete)
  const handleConfirmDelete = async () => {
    if (!carToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteCar(carToDelete.CAR_ID);

      // ✅ Thay vì xóa hẳn, ta cập nhật STATUS trong state:
      setFilteredCars((prev) =>
        prev.map((c) =>
          c.CAR_ID === carToDelete.CAR_ID ? { ...c, STATUS: "DELETED" } : c
        )
      );

      setIsModalOpen(false);
      setCarToDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Lỗi không xác định khi xóa xe.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setCarToDelete(null);
    setDeleteError(null);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý xe</h1>
        <Link to="/vehicles/new">
          <Button>Thêm xe</Button>
        </Link>
      </div>

      {/* 🆕 Bộ lọc trạng thái */}
      <div className="flex items-center gap-3 mb-4">
        <label className="font-medium text-gray-700">
          Lọc theo trạng thái:
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="ALL">Tất cả</option>
          <option value="AVAILABLE">Sẵn sàng</option>
          <option value="RESERVED">Đã đặt trước</option>
          <option value="RENTED">Đang thuê</option>
          <option value="MAINTENANCE">Đang bảo trì</option>
          <option value="DELETED">Đã xóa</option>
        </select>
      </div>

      <Card>
        {loading ? (
          <p className="p-4 text-gray-500">Đang tải danh sách xe...</p>
        ) : error ? (
          <p className="p-4 text-red-500">Lỗi: {error}</p>
        ) : filteredCars.length === 0 ? (
          <p className="p-4 text-gray-500">Không có xe phù hợp với bộ lọc.</p>
        ) : (
          <Table
            headers={headers}
            data={filteredCars}
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
                        : row.STATUS === "RENTED"
                        ? "bg-blue-100 text-blue-700"
                        : row.STATUS === "MAINTENANCE"
                        ? "bg-yellow-100 text-yellow-700"
                        : row.STATUS === "RESERVED"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-200 text-gray-700"
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
                    <Link to={`/vehicles/editImage/${row.CAR_ID}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1">
                        Sửa Hình
                      </Button>
                    </Link>
                    <Link to={`/vehicles/edit/${row.CAR_ID}`}>
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-3 py-1">
                        Sửa Thông Tin
                      </Button>
                    </Link>
                    {row.STATUS !== "DELETED" && (
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
                        onClick={() => handleDeleteClick(row)}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                </td>
              </>
            )}
          />
        )}
      </Card>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        error={deleteError}
        carName={carToDelete ? `${carToDelete.BRAND} ${carToDelete.MODEL}` : ""}
      />
    </Layout>
  );
}
