// src/pages/incidents/IncidentList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useIncidentsList } from "../../hooks/useIncident";

import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Layout from "../../components/layouts/Layout";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

// [SỬA] 1. Tạo bản đồ tra cứu Tiếng Việt
const statusMap = {
  NEW: "Mới",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã giải quyết",
  CLOSED: "Đã đóng",
};

// [SỬA] 2. Cập nhật hàm getStatusBadge
const getStatusBadge = (status) => {
  const styles = {
    NEW: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
  };

  // Lấy tên Tiếng Việt, nếu không có thì dùng tên gốc
  const vietnameseStatus = statusMap[status] || status;

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        styles[status] || styles["CLOSED"]
      }`}
    >
      {/* Hiển thị tên Tiếng Việt */}
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

  const headers = [
    "ID",
    "Mã Đơn",
    "User ID",
    "Mô tả",
    "Trạng thái", // Đã là tiếng việt
    "Ngày tạo",
    "Hành động",
  ];

  const selectedIncidentIdentifier = `Sự cố #${selectedIncidentId}`;

  const renderRow = (item) => (
    <>
      <td className="px-4 py-2 ">{item.INCIDENT_ID}</td>
      <td className="px-4 py-2 font-medium">{item.ORDER_ID}</td>
      <td className="px-4 py-2 ">{item.USER_ID}</td>
      <td className="px-4 py-2 max-w-xs truncate">{item.DESCRIPTION}</td>
      <td className="px-4 py-2">
        {/* Hàm này giờ sẽ trả về Tiếng Việt */}
        {getStatusBadge(item.STATUS)}
      </td>
      <td className="px-4 py-2">
        {new Date(item.CREATED_AT).toLocaleString("vi-VN")}
      </td>
      <td className="px-4 py-2 flex gap-2">
        <Link to={`/incidents/edit/${item.INCIDENT_ID}`}>
          <Button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm">
            Chi Tiết Và Xử Lý
          </Button>
        </Link>
        <Button
          className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm"
          onClick={() => handleDeleteClick(item.INCIDENT_ID)}
        >
          Xóa
        </Button>
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
