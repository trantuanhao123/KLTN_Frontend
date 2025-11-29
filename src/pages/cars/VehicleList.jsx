import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
// [THAY ĐỔI] Import tất cả các biến thể Button
import Button, {
  ButtonCreate,
  ButtonRead,
  ButtonEdit,
  ButtonDelete,
} from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { Link } from "react-router-dom";
import useCars from "../../hooks/useCar";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// ... (Giữ nguyên các hàm getStatusClass và translateStatus) ...
const getStatusClass = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700";
    case "RENTED":
      return "bg-blue-100 text-blue-700";
    case "MAINTENANCE":
      return "bg-yellow-100 text-yellow-700";
    case "RESERVED":
      return "bg-purple-100 text-purple-700";
    case "DELETED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};
const translateStatus = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "Khả dụng";
    case "RESERVED":
      return "Đang được đặt";
    case "RENTED":
      return "Đang thuê";
    case "MAINTENANCE":
      return "Đang bảo trì";
    case "DELETED":
      return "Đã xóa";
    default:
      return status;
  }
};
// ...

export default function VehicleList() {
  const { cars, loading, error, deleteCar, fetchAllCars } = useCars();
  const [filteredCars, setFilteredCars] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (!cars) return;
    if (filterStatus === "ALL") {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter((car) => car.STATUS === filterStatus));
    }
  }, [cars, filterStatus]);

  const headers = [
    "STT",
    "Hình ảnh",
    "Loại / Model",
    "Trạng thái",
    "Giá (VNĐ/ngày)",
    "Hành động",
  ];

  const handleDeleteClick = (car) => {
    setCarToDelete(car);
    setIsModalOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!carToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteCar(carToDelete.CAR_ID);
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
          {/* [THAY ĐỔI] Sử dụng ButtonCreate */}
          <ButtonCreate>Thêm xe</ButtonCreate>
        </Link>
      </div>

      {/* Bộ lọc trạng thái (giữ nguyên) */}
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
          <option value="AVAILABLE">Khả dụng</option>
          <option value="RESERVED">Đang được đặt</option>
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
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(
                      row.STATUS
                    )}`}
                  >
                    {translateStatus(row.STATUS)}
                  </span>
                </td>
                <td className="px-4 py-2 font-medium">
                  {Number(row.PRICE_PER_DAY).toLocaleString("vi-VN")}₫
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    {/* [THAY ĐỔI] Sử dụng ButtonRead */}
                    {/* Vẫn truyền className cho kích thước, các biến thể sẽ tự động merge vào */}
                    <Link to={`/vehicles/${row.CAR_ID}`}>
                      <ButtonRead className="text-sm px-3 py-1">
                        Chi tiết
                      </ButtonRead>
                    </Link>

                    {/* [THAY ĐỔI] Sử dụng ButtonEdit */}
                    <Link to={`/vehicles/editImage/${row.CAR_ID}`}>
                      <ButtonEdit className="text-sm px-3 py-1">
                        Sửa Hình
                      </ButtonEdit>
                    </Link>

                    {/* [THAY ĐỔI] Sử dụng ButtonEdit */}
                    <Link to={`/vehicles/edit/${row.CAR_ID}`}>
                      <ButtonEdit className="text-sm px-3 py-1">
                        Sửa Thông Tin
                      </ButtonEdit>
                    </Link>

                    {/* [THAY ĐỔI] Sử dụng ButtonDelete */}
                    {row.STATUS !== "DELETED" && (
                      <ButtonDelete
                        className="text-sm px-3 py-1"
                        onClick={() => handleDeleteClick(row)}
                      >
                        Xóa
                      </ButtonDelete>
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
