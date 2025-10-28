// src/pages/services/ServiceList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useServices from "../../hooks/useService";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
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

  // Render mỗi row của table (không đổi)
  const renderRow = (service) => (
    <>
      <td className="px-4 py-3">{service.SERVICE_ID}</td>
      <td className="px-4 py-3 font-medium">{service.NAME}</td>
      <td className="px-4 py-3 text-gray-600">{service.DESCRIPTION || "—"}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link to={`/services/edit/${service.SERVICE_ID}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1">
              Sửa
            </Button>
          </Link>
          <Button
            onClick={() => setDeleteId(service.SERVICE_ID)}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
          >
            Xóa
          </Button>
        </div>
      </td>
    </>
  );
  // --- Hết logic không đổi ---

  return (
    // Bỏ prop 'title' không cần thiết
    <Layout>
      {/* 1. Đưa Tiêu đề và Nút Thêm Mới ra ngoài Card */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h1>
        <Link to="/services/new">
          {/* Bỏ class màu để dùng Button default (đồng bộ) */}
          <Button>Thêm dịch vụ</Button>
        </Link>
      </div>

      {/* 2. Card chỉ chứa nội dung (Table hoặc trạng thái) */}
      <Card>
        {/* Xóa div header bên trong Card */}

        {isLoading ? (
          // 3. Đồng bộ style Loading/Error
          <p className="p-4 text-gray-500">Đang tải dữ liệu...</p>
        ) : error ? (
          // Đồng bộ style (giữ logic nút "Thử lại" vì hook không cấp refetch)
          <div className="p-4">
            <p className="text-red-500">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gray-600 hover:bg-gray-700"
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

      {/* Modal giữ nguyên */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        // Prop 'carName' được giữ nguyên để không phá vỡ logic
        carName={services.find((s) => s.SERVICE_ID === deleteId)?.NAME}
      >
        Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không thể
        hoàn tác.
      </ConfirmDeleteModal>
    </Layout>
  );
}

export default ServiceList;
