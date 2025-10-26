import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminCreateOrder } from "../../hooks/useOrder";
import useCars from "../../hooks/useCar";
import useAdminUsers from "../../hooks/useCustomer";
import { useAuth } from "../../hooks/AuthContext";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const PAYMENT_METHOD_OPTIONS = [
  { label: "Tiền mặt", value: "CASH" },
  { label: "VNPAY", value: "VNPAY" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "Chưa thanh toán", value: "UNPAID" },
  { label: "Đã cọc", value: "PARTIAL" },
  { label: "Đã thanh toán", value: "PAID" },
];

const inputBaseStyle =
  "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100";
const labelBaseStyle = "block text-sm font-medium text-gray-700 mb-1";

export default function BookingForm() {
  const navigate = useNavigate();
  const [createOrder, { loading, error: apiError }] = useAdminCreateOrder();
  const [formError, setFormError] = useState(null);

  const { user: authUser } = useAuth();

  // 🟢 Lấy danh sách xe khả dụng
  const { availableCars, loading: carsLoading, fetchAvailableCars } = useCars();

  // 🟢 Lấy danh sách khách hàng
  const {
    users: customers,
    loading: customersLoading,
    fetchAllUsers,
  } = useAdminUsers();

  // 🟢 Khi load form thì tự fetch dữ liệu
  useEffect(() => {
    if (authUser?.token) {
      fetchAllUsers();
      fetchAvailableCars(); // 🔥 Gọi API lấy xe khả dụng thay vì getAllCars
    }
  }, [authUser, fetchAllUsers, fetchAvailableCars]);

  const [formData, setFormData] = useState({
    userId: "",
    carId: "",
    startDate: "",
    endDate: "",
    paymentMethod: "CASH",
    paymentStatus: "PARTIAL",
    amountPaid: 0,
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const { userId, carId, startDate, endDate, amountPaid, ...rest } = formData;

    if (!userId || !carId || !startDate || !endDate) {
      setFormError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    const payload = {
      ...rest,
      userId: parseInt(userId, 10),
      carId: parseInt(carId, 10),
      startDate,
      endDate,
      amountPaid: parseFloat(amountPaid) || 0,
    };

    try {
      await createOrder(payload);
      navigate("/bookings");
    } catch (err) {
      console.error("Lỗi khi tạo đơn:", err);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Tạo Đơn hàng Thủ công
        </h1>
        <Link to="/bookings">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white">
            Hủy
          </Button>
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formError && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              {formError}
            </div>
          )}
          {apiError && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              Lỗi từ API: {apiError.response?.data?.error || apiError.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- Cột 1 --- */}
            <div className="space-y-4">
              {/* Chọn khách hàng */}
              <div>
                <label htmlFor="userId" className={labelBaseStyle}>
                  Khách hàng (USER_ID) *
                </label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className={inputBaseStyle}
                  required
                  disabled={customersLoading}
                >
                  <option value="">
                    {customersLoading
                      ? "Đang tải khách hàng..."
                      : "Vui lòng chọn khách hàng"}
                  </option>
                  {customers.map((user) => (
                    <option key={user.USER_ID} value={user.USER_ID}>
                      {user.USER_ID} - {user.FULLNAME || user.EMAIL}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn xe khả dụng */}
              <div>
                <label htmlFor="carId" className={labelBaseStyle}>
                  Xe khả dụng *
                </label>
                <select
                  id="carId"
                  name="carId"
                  value={formData.carId}
                  onChange={handleChange}
                  className={inputBaseStyle}
                  required
                  disabled={carsLoading}
                >
                  <option value="">
                    {carsLoading
                      ? "Đang tải xe..."
                      : "Vui lòng chọn xe khả dụng"}
                  </option>
                  {availableCars.map((car) => (
                    <option key={car.CAR_ID} value={car.CAR_ID}>
                      {car.CAR_ID} - {car.BRAND} {car.MODEL} (
                      {car.LICENSE_PLATE})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amountPaid" className={labelBaseStyle}>
                  Số tiền đã trả (VNĐ)
                </label>
                <input
                  type="number"
                  id="amountPaid"
                  name="amountPaid"
                  min="0"
                  step="1000"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  className={inputBaseStyle}
                />
              </div>
            </div>

            {/* --- Cột 2 --- */}
            <div className="space-y-4">
              <div>
                <label htmlFor="startDate" className={labelBaseStyle}>
                  Ngày bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={inputBaseStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className={labelBaseStyle}>
                  Ngày kết thúc *
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={inputBaseStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="paymentMethod" className={labelBaseStyle}>
                  Phương thức thanh toán
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={inputBaseStyle}
                >
                  {PAYMENT_METHOD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="paymentStatus" className={labelBaseStyle}>
                  Trạng thái thanh toán
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className={inputBaseStyle}
                >
                  {PAYMENT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label htmlFor="note" className={labelBaseStyle}>
              Ghi chú
            </label>
            <textarea
              id="note"
              name="note"
              rows="3"
              value={formData.note}
              onChange={handleChange}
              className={inputBaseStyle}
              placeholder="Khách đặt qua điện thoại,..."
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading ? "Đang tạo..." : "Tạo đơn hàng"}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
