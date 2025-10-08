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

  // Render mỗi row của table
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

  return (
    <Layout title="Danh sách dịch vụ">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Danh sách dịch vụ</h2>
          <Link to="/services/new">
            <Button className="bg-green-600 hover:bg-green-700">
              Thêm dịch vụ
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
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
