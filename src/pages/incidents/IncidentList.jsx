import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useIncidentsList } from "../../hooks/useIncident";

import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
// [THAY ĐỔI] Import các biến thể Button
import Button, { ButtonRead, ButtonDelete } from "../../components/ui/Button";
import Layout from "../../components/layouts/Layout";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

// ... (Các hàm statusMap, getStatusBadge giữ nguyên) ...
const statusMap = {
  NEW: "Mới",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã giải quyết",
  CLOSED: "Đã đóng",
};

const getStatusBadge = (status) => {
  const styles = {
    NEW: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
  };
  const vietnameseStatus = statusMap[status] || status;
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        styles[status] || styles["CLOSED"]
      }`}
    >
      {vietnameseStatus}
    </span>
  );
};

export default function IncidentList() {
  const { incidents, loading, error, handleDeleteIncident } =
    useIncidentsList();

  const [showModal, setShowModal] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id) => {
    setSelectedIncidentId(id);
    setShowModal(true);
  };

  const handleCancelDelete = () => {
    setSelectedIncidentId(null);
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedIncidentId) return;

    setIsDeleting(true);
    try {
      await handleDeleteIncident(selectedIncidentId);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
      handleCancelDelete();
    }
  };

  // [CẬP NHẬT HEADERS] Thêm các cột mới
  const headers = [
    "ID",
    "Mã Đơn Hàng",
    "Khách Hàng",
    "Xe",
    "Biển Số",
    "Trạng Thái",
    "Ngày Tạo",
    "Hành động",
  ];

  const selectedIncidentIdentifier = `Sự cố #${selectedIncidentId}`;
  const tableButtonStyles = "text-sm px-3 py-1";

  // [CẬP NHẬT RENDER ROW] Hiển thị dữ liệu chi tiết
  const renderRow = (item) => (
    <>
      <td className="px-4 py-2 text-sm text-gray-500">{item.INCIDENT_ID}</td>

      {/* Mã Đơn Hàng */}
      <td className="px-4 py-2 font-medium text-600">
        {item.order_code || item.ORDER_ID}
      </td>

      {/* Khách Hàng */}
      <td className="px-4 py-2">
        <div className="text-sm font-medium text-900">{item.customer_name}</div>
      </td>

      {/* Xe */}
      <td className="px-4 py-2 text-sm">
        {item.car_brand} {item.car_model}
      </td>

      {/* Biển Số */}
      <td className="px-4 py-2 font-mono text-sm">{item.car_license_plate}</td>

      {/* Trạng Thái */}
      <td className="px-4 py-2">{getStatusBadge(item.STATUS)}</td>

      {/* Ngày Tạo */}
      <td className="px-4 py-2 text-sm text-gray-500">
        {new Date(item.CREATED_AT).toLocaleString("vi-VN")}
      </td>

      {/* Hành Động */}
      <td className="px-4 py-2">
        <div className="flex gap-2">
          <Link to={`/incidents/edit/${item.INCIDENT_ID}`}>
            <ButtonRead className={tableButtonStyles}>
              Chi Tiết Và Xử Lý
            </ButtonRead>
          </Link>

          <ButtonDelete
            className={tableButtonStyles}
            onClick={() => handleDeleteClick(item.INCIDENT_ID)}
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
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sự cố</h1>
      </div>

      <Card>
        {loading ? (
          <p className="p-4 text-gray-500">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="p-4 text-red-500">{error.message}</p>
        ) : (
          <Table headers={headers} data={incidents} renderRow={renderRow} />
        )}
      </Card>

      <ConfirmDeleteModal
        isOpen={showModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        carName={selectedIncidentIdentifier}
        isLoading={isDeleting}
      >
        Bạn có chắc chắn muốn xóa
        <strong> {selectedIncidentIdentifier} </strong>
        không? Hành động này không thể hoàn tác.
      </ConfirmDeleteModal>
    </Layout>
  );
}
