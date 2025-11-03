// src/pages/services/ServiceList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useServices from "../../hooks/useService";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
// [THAY ĐỔI] Import các biến thể Button
import Button, {
  ButtonCreate,
  ButtonEdit,
  ButtonDelete,
} from "../../components/ui/Button";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

function ServiceList() {
  // --- Logic không đổi ---
  const { services, isLoading, error, removeService } = useServices();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    try {
      await removeService(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
  };

  // [THAY ĐỔI] Style button nhỏ
  const tableButtonStyles = "text-sm px-3 py-1";

  // Render mỗi row của table
  const renderRow = (service) => (
    <>
      {/* [FIX] Đổi py-3 -> py-2 cho đồng bộ */}
      <td className="px-4 py-2">{service.SERVICE_ID}</td>
      <td className="px-4 py-2 font-medium">{service.NAME}</td>
      <td className="px-4 py-2 text-gray-600">{service.DESCRIPTION || "—"}</td>
      <td className="px-4 py-2">
        {/* [FIX] Bọc nút trong <div> để căn giữa */}
        <div className="flex gap-2">
          {/* [THAY ĐỔI] Sử dụng ButtonEdit */}
          <Link to={`/services/edit/${service.SERVICE_ID}`}>
            <ButtonEdit className={tableButtonStyles}>Sửa</ButtonEdit>
          </Link>

          {/* [THAY ĐỔI] Sử dụng ButtonDelete */}
          <ButtonDelete
            onClick={() => setDeleteId(service.SERVICE_ID)}
            className={tableButtonStyles}
          >
            Xóa
          </ButtonDelete>
        </div>
      </td>
    </>
  );
  // --- Hết logic không đổi ---

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h1>
        <Link to="/services/new">
          {/* [THAY ĐỔI] Sử dụng ButtonCreate */}
          <ButtonCreate>Thêm dịch vụ</ButtonCreate>
        </Link>
      </div>

      <Card>
        {isLoading ? (
          <p className="p-4 text-gray-500">Đang tải dữ liệu...</p>
        ) : error ? (
          <div className="p-4">
            <p className="text-red-500">{error}</p>
            {/* [THAY ĐỔI] Nút "Thử lại" (màu xám) */}
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Thử lại
            </Button>
          </div>
        ) : (
          <Table
            headers={["ID", "Tên dịch vụ", "Mô tả", "Hành động"]}
            data={services}
            renderRow={renderRow}
          />
        )}
      </Card>

      {/* Modal giữ nguyên, đã đồng bộ */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        carName={services.find((s) => s.SERVICE_ID === deleteId)?.NAME}
      >
        Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không thể
        hoàn tác.
      </ConfirmDeleteModal>
    </Layout>
  );
}

export default ServiceList;
