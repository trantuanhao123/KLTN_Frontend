// src/pages/incidents/IncidentUpdateForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIncidentDetail } from "../../hooks/useIncident";

import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import MediaViewer from "../../components/ui/MediaViewer"; // Import MediaViewer

// Map trạng thái Tiếng Việt
const statusMap = {
  NEW: "Mới",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã giải quyết",
  CLOSED: "Đã đóng",
};

// Mảng options cho <select>
const statusOptions = [
  { value: "NEW", label: "Mới" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "RESOLVED", label: "Đã giải quyết" },
  { value: "CLOSED", label: "Đã đóng" },
];

// TÁCH RA: Component Form Cập nhật (Cho Cột Phụ)
const UpdateStatusForm = ({
  currentStatus,
  onSubmit,
  isUpdating,
  onCancel,
}) => {
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(status);
  };

  return (
    <Card title="Cập nhật Trạng thái">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? "Đang lưu..." : "Lưu Thay Đổi"}
          </Button>

          <Button
            type="button"
            className="w-full bg-gray-500 hover:bg-gray-600"
            onClick={onCancel}
          >
            Quay lại
          </Button>
        </div>
      </form>
    </Card>
  );
};

// TÁCH RA: Component Thông tin chi tiết (Cho Cột Phụ)
const IncidentInfoCard = ({ incident }) => (
  <Card title="Thông tin chi tiết">
    <div className="space-y-2 text-sm">
      <p>
        <strong>ID Sự cố:</strong> {incident.INCIDENT_ID}
      </p>
      <p>
        <strong>Mã Đơn hàng:</strong> {incident.ORDER_ID}
      </p>
      <p>
        <strong>User ID:</strong> {incident.USER_ID}
      </p>
      <p>
        <strong>Car ID:</strong> {incident.CAR_ID}
      </p>
      <p>
        <strong>Trạng thái hiện tại:</strong>{" "}
        {statusMap[incident.STATUS] || incident.STATUS}
      </p>
      <p>
        <strong>Ngày tạo:</strong>{" "}
        {new Date(incident.CREATED_AT).toLocaleString("vi-VN")}
      </p>
      {incident.RESOLVED_AT && (
        <p>
          <strong>Ngày xử lý:</strong>{" "}
          {new Date(incident.RESOLVED_AT).toLocaleString("vi-VN")}
        </p>
      )}
    </div>
  </Card>
);

// TÁCH RA: Component Mô tả (Cho Cột Phụ)
const IncidentDescriptionCard = ({ description }) => (
  <Card title="Mô tả sự cố">
    <p className="p-2 bg-gray-50 rounded border whitespace-pre-wrap text-sm">
      {description}
    </p>
  </Card>
);

// COMPONENT CHÍNH (Đã tối ưu bố cục)
export default function IncidentUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incident, loading, error, handleUpdateStatus } =
    useIncidentDetail(id);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (newStatus) => {
    setIsUpdating(true);
    try {
      await handleUpdateStatus(newStatus);
      navigate("/incidents");
    } catch (err) {
      alert(err.message);
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <p>Đang tải...</p>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <p className="text-red-500">Lỗi: {error.message}</p>
      </Layout>
    );
  if (!incident)
    return (
      <Layout>
        <p>Không tìm thấy sự cố.</p>
      </Layout>
    );

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Cập nhật Sự cố #{incident.INCIDENT_ID}
      </h1>

      {/* BỐ CỤC MỚI */}
      <div className="grid grid-cols-3 gap-6">
        {/* CỘT CHÍNH (Media) - (col-span-2) */}
        <div className="col-span-2">
          <Card title="Media đính kèm">
            <MediaViewer media={incident.media} />
          </Card>
        </div>

        {/* CỘT PHỤ (Actions & Info) - (col-span-1) */}
        <div className="col-span-1 space-y-6">
          {/* 1. Form Cập nhật (Lên đầu) */}
          <UpdateStatusForm
            currentStatus={incident.STATUS}
            onSubmit={handleSubmit}
            isUpdating={isUpdating}
            onCancel={() => navigate("/incidents")}
          />

          {/* 2. Thông tin chi tiết */}
          <IncidentInfoCard incident={incident} />

          {/* 3. Mô tả */}
          <IncidentDescriptionCard description={incident.DESCRIPTION} />
        </div>
      </div>
    </Layout>
  );
}
