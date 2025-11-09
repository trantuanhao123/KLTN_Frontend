import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIncidentDetail } from "../../hooks/useIncident";

import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import MediaViewer from "../../components/ui/MediaViewer";

const statusMap = {
  NEW: "Mới",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã giải quyết",
  CLOSED: "Đã đóng",
};

const statusOptions = [
  { value: "NEW", label: "Mới" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "RESOLVED", label: "Đã giải quyết" },
  { value: "CLOSED", label: "Đã đóng" },
];

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

// [CẬP NHẬT] Hiển thị thông tin chi tiết hơn từ API
const IncidentInfoCard = ({ incident }) => (
  <Card title="Thông tin chi tiết">
    <div className="space-y-3 text-sm">
      <div>
        <span className="font-semibold text-gray-600">Mã Sự cố:</span>
        <span className="ml-2">#{incident.INCIDENT_ID}</span>
      </div>

      <div className="border-t pt-2">
        <span className="font-semibold text-gray-600 block mb-1">
          Đơn hàng:
        </span>
        <div className="ml-2">
          <p>
            Mã:{" "}
            <span className="font-medium text-600">{incident.order_code}</span>
          </p>
          <p className="text-xs text-gray-500">(ID: {incident.ORDER_ID})</p>
        </div>
      </div>

      <div className="border-t pt-2">
        <span className="font-semibold text-gray-600 block mb-1">
          Khách hàng:
        </span>
        <div className="ml-2">
          <p className="font-medium">{incident.customer_name}</p>
          <p>SĐT: {incident.customer_phone}</p>
          {/* <p className="text-xs text-gray-500">(ID: {incident.USER_ID})</p> */}
        </div>
      </div>

      <div className="border-t pt-2">
        <span className="font-semibold text-gray-600 block mb-1">Xe:</span>
        <div className="ml-2">
          <p>
            {incident.car_brand} {incident.car_model}
          </p>
          <p className="font-mono bg-gray-100 px-1 rounded inline-block mt-1">
            {incident.car_license_plate}
          </p>
          {/* <p className="text-xs text-gray-500 mt-1">(ID: {incident.CAR_ID})</p> */}
        </div>
      </div>

      <div className="border-t pt-2">
        <span className="font-semibold text-gray-600">Ngày tạo:</span>
        <span className="ml-2">
          {new Date(incident.CREATED_AT).toLocaleString("vi-VN")}
        </span>
      </div>

      {incident.RESOLVED_AT && (
        <div>
          <span className="font-semibold text-gray-600">Ngày xử lý:</span>
          <span className="ml-2">
            {new Date(incident.RESOLVED_AT).toLocaleString("vi-VN")}
          </span>
        </div>
      )}
    </div>
  </Card>
);

const IncidentDescriptionCard = ({ description }) => (
  <Card title="Mô tả sự cố">
    <p className="p-3 bg-gray-50 rounded border whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
      {description}
    </p>
  </Card>
);

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cập nhật Sự cố</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT CHÍNH (Media & Mô tả) - (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Đưa Mô tả sang cột chính cho rộng rãi */}
          <IncidentDescriptionCard description={incident.DESCRIPTION} />

          <Card title="Media đính kèm">
            {incident.media && incident.media.length > 0 ? (
              <MediaViewer media={incident.media} />
            ) : (
              <p className="text-gray-500 text-sm italic p-4 text-center bg-gray-50 rounded">
                Không có media đính kèm.
              </p>
            )}
          </Card>
        </div>

        {/* CỘT PHỤ (Actions & Info) - (col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          <UpdateStatusForm
            currentStatus={incident.STATUS}
            onSubmit={handleSubmit}
            isUpdating={isUpdating}
            onCancel={() => navigate("/incidents")}
          />

          <IncidentInfoCard incident={incident} />
        </div>
      </div>
    </Layout>
  );
}
