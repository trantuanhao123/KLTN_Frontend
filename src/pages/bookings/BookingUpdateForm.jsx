import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useAdminGetOrderById,
  useAdminUpdateOrder,
} from "../../hooks/useOrder";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// -----------------------------------------------------------------
// [THÊM LẠI] Dữ liệu map cho các trường disabled
// -----------------------------------------------------------------
const STATUS_OPTIONS = [
  { value: "PENDING_PAYMENT", label: "Chờ thanh toán" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "IN_PROGRESS", label: "Đang thuê" },
  { value: "COMPLETED", label: "Đã hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "PARTIAL", label: "Đã cọc" },
  { value: "PAID", label: "Đã thanh toán" },
];

// Style chung cho các input
// [CẬP NHẬT] Thêm style cho trường bị disabled
const inputBaseStyle =
  "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
const labelBaseStyle = "block text-sm font-medium text-gray-700 mb-1";
const readOnlyStyle =
  "block w-full p-2 border-gray-200 bg-gray-100 rounded-md sm:text-sm text-gray-600";

// Helper để định dạng ngày giờ (Giữ nguyên)
const formatDateTimeLocal = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  } catch (e) {
    console.error("Lỗi định dạng ngày:", e);
    return "";
  }
};

// -----------------------------------------------------------------
// Component Cập nhật Đơn hàng
// -----------------------------------------------------------------
export default function BookingUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Lấy dữ liệu cũ
  const {
    data: orderData,
    loading: getLoading,
    error: getError,
  } = useAdminGetOrderById(id);

  // 2. Hook để cập nhật
  const [updateOrder, { loading: updateLoading, error: updateError }] =
    useAdminUpdateOrder();

  // 3. State (Thêm lại 2 trường status)
  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
    endDate: "",
    note: "",
  });

  // 4. useEffect (Thêm lại 2 trường status)
  useEffect(() => {
    if (orderData) {
      setFormData({
        status: orderData.STATUS || "",
        paymentStatus: orderData.PAYMENT_STATUS || "",
        endDate: formatDateTimeLocal(orderData.END_DATE),
        note: orderData.NOTE || "",
      });
    }
  }, [orderData]);

  // 5. Hàm xử lý thay đổi input (Giữ nguyên)
  // (Sẽ chỉ chạy cho 2 trường endDate và note)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 6. Hàm handleSubmit (QUAN TRỌNG: Vẫn chỉ gửi 2 trường)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload CHỈ chứa 2 trường theo sample,
    // bỏ qua 'status' và 'paymentStatus' trong state
    const payload = {
      newEndDate: formData.endDate,
      newNote: formData.note,
    };

    try {
      await updateOrder(id, payload);
      navigate("/bookings");
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
    }
  };

  // --- Render ---

  if (getLoading) {
    return (
      <Layout>
        <p>Đang tải dữ liệu đơn hàng...</p>
      </Layout>
    );
  }

  if (getError) {
    return (
      <Layout>
        <p className="text-red-500">Lỗi khi tải dữ liệu: {getError.message}</p>
      </Layout>
    );
  }

  if (!orderData) {
    return (
      <Layout>
        <p>Không tìm thấy đơn hàng.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Chỉnh sửa Đơn hàng: {orderData.ORDER_CODE}
        </h1>
        <Link to="/bookings">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white">
            Hủy
          </Button>
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {updateError && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              Lỗi khi cập nhật:{" "}
              {updateError.response?.data?.error || updateError.message}
            </div>
          )}

          {/* Khối 1: Thông tin chỉ đọc (Giữ nguyên) */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-600 px-2">
              Thông tin cố định
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ... (USER_ID, CAR_ID, START_DATE giữ nguyên) ... */}
              <div>
                <label className={labelBaseStyle}>Mã khách (USER_ID)</label>
                <input
                  type="text"
                  value={orderData.USER_ID}
                  className={readOnlyStyle}
                  readOnly
                />
              </div>
              <div>
                <label className={labelBaseStyle}>Mã xe (CAR_ID)</label>
                <input
                  type="text"
                  value={orderData.CAR_ID}
                  className={readOnlyStyle}
                  readOnly
                />
              </div>
              <div>
                <label className={labelBaseStyle}>Ngày bắt đầu</label>
                <input
                  type="text"
                  value={new Date(orderData.START_DATE).toLocaleString("vi-VN")}
                  className={readOnlyStyle}
                  readOnly
                />
              </div>
            </div>
          </fieldset>

          {/* Khối 2: Thông tin cập nhật */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-600 px-2">
              Thông tin cập nhật
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* [THÊM LẠI] Trạng thái (disabled) */}
              <div>
                <label htmlFor="status" className={labelBaseStyle}>
                  Trạng thái đơn (hiện tại)
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputBaseStyle}
                  disabled // <-- KHÓA CHỈNH SỬA
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* [THÊM LẠI] Thanh toán (disabled) */}
              <div>
                <label htmlFor="paymentStatus" className={labelBaseStyle}>
                  Trạng thái thanh toán (hiện tại)
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className={inputBaseStyle}
                  disabled // <-- KHÓA CHỈNH SỬA
                >
                  {PAYMENT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ngày kết thúc (Editable) */}
              <div>
                <label htmlFor="endDate" className={labelBaseStyle}>
                  Ngày kết thúc (mới)
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange} // <-- Sẽ chạy khi sửa
                  className={inputBaseStyle}
                  required
                />
              </div>
            </div>

            {/* Ghi chú (Editable) */}
            <div className="mt-6">
              <label htmlFor="note" className={labelBaseStyle}>
                Ghi chú (mới)
              </label>
              <textarea
                id="note"
                name="note"
                rows="3"
                value={formData.note}
                onChange={handleChange} // <-- Sẽ chạy khi sửa
                className={inputBaseStyle}
                placeholder="Admin đã gia hạn thêm..."
              ></textarea>
            </div>
          </fieldset>

          {/* Nút Submit (Giữ nguyên) */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={updateLoading}
              className="min-w-[150px]"
            >
              {updateLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
