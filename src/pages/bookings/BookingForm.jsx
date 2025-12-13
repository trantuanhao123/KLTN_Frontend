import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAdminCreateOrder } from "../../hooks/useOrder";
import useCars from "../../hooks/useCar";
import useAdminUsers from "../../hooks/useCustomer";
import { useAuth } from "../../hooks/AuthContext";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

// --- 🟢 LOGIC TÍNH GIÁ STRICT (ĐỒNG BỘ VỚI BACKEND) ---
const calculateStrictPrice = (car, startDate, endDate, mode) => {
  if (!car || !startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return 0;
  }

  const totalMilliseconds = end - start;
  const totalHours = totalMilliseconds / (1000 * 60 * 60);

  if (mode === "hour") {
    // Logic Theo Giờ: Làm tròn lên từng giờ
    const chargedHours = Math.ceil(totalHours);
    const pricePerHour = parseFloat(car.PRICE_PER_HOUR) || 0;
    return Math.round(chargedHours * pricePerHour);
  } else {
    // Logic Theo Ngày:
    // Tính trọn ngày (làm tròn lên). Tối thiểu 1 ngày.
    const chargedDays = Math.max(Math.ceil(totalHours / 24), 1);
    const pricePerDay = parseFloat(car.PRICE_PER_DAY) || 0;
    return Math.round(chargedDays * pricePerDay);
  }
};

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#D1D5DB",
    borderRadius: "0.375rem",
    padding: "2px",
    boxShadow: "none",
    "&:hover": { borderColor: "#3B82F6" },
  }),
};

const inputBaseStyle =
  "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100";
const labelBaseStyle = "block text-sm font-medium text-gray-700 mb-1";

export default function BookingForm() {
  const navigate = useNavigate();
  const [createOrder, { loading, error: apiError }] = useAdminCreateOrder();
  const [formError, setFormError] = useState(null);
  const { user: authUser } = useAuth();
  const { availableCars, loading: carsLoading, fetchAvailableCars } = useCars();
  const {
    users: customers,
    loading: customersLoading,
    fetchAllUsers,
  } = useAdminUsers();

  // --- STATE QUẢN LÝ RIÊNG CHO UI ---
  // Mặc định là 'day' (Theo Ngày)
  const [rentalMode, setRentalMode] = useState("day");

  // State tạm cho UI (để render input tách rời)
  const [uiState, setUiState] = useState({
    dateOnlyStart: "", // Dùng cho mode Day
    dateOnlyEnd: "", // Dùng cho mode Day
    singleDate: "", // Dùng cho mode Hour
    timeStart: "", // Dùng cho mode Hour
    timeEnd: "", // Dùng cho mode Hour
  });

  // State chính để gửi Backend (Chỉ chứa format chuẩn ISO)
  const [formData, setFormData] = useState({
    userId: null,
    carId: null,
    startDate: "", // Format: YYYY-MM-DDTHH:mm
    endDate: "", // Format: YYYY-MM-DDTHH:mm
    paymentMethod: "CASH",
    paymentStatus: "PARTIAL", // Mặc định là cọc
    amountPaid: 0,
    note: "",
  });

  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [selectedCarData, setSelectedCarData] = useState(null);

  useEffect(() => {
    if (authUser?.token) {
      fetchAllUsers();
      fetchAvailableCars();
    }
  }, [authUser, fetchAllUsers, fetchAvailableCars]);

  // --- 🟢 1. ĐỒNG BỘ UI STATE -> FORM DATA ---
  // Mỗi khi user nhập ngày/giờ lẻ, code này tự ghép thành chuỗi ISO chuẩn
  useEffect(() => {
    let finalStartDate = "";
    let finalEndDate = "";

    if (rentalMode === "day") {
      // Mode Ngày: Fix cứng giờ nhận là 00:00 và trả là 23:59 (hoặc giờ hiện tại tùy nhu cầu)
      // Ở đây fix cứng để đảm bảo tính trọn ngày
      if (uiState.dateOnlyStart)
        finalStartDate = `${uiState.dateOnlyStart}T00:00`;
      if (uiState.dateOnlyEnd) finalEndDate = `${uiState.dateOnlyEnd}T23:59`;
    } else {
      // Mode Giờ: Ghép Ngày + Giờ
      if (uiState.singleDate && uiState.timeStart)
        finalStartDate = `${uiState.singleDate}T${uiState.timeStart}`;
      if (uiState.singleDate && uiState.timeEnd)
        finalEndDate = `${uiState.singleDate}T${uiState.timeEnd}`;
    }

    setFormData((prev) => ({
      ...prev,
      startDate: finalStartDate,
      endDate: finalEndDate,
    }));
  }, [uiState, rentalMode]);

  // --- 🟢 2. TỰ ĐỘNG TÍNH GIÁ (PREVIEW) ---
  useEffect(() => {
    if (selectedCarData && formData.startDate && formData.endDate) {
      const price = calculateStrictPrice(
        selectedCarData,
        formData.startDate,
        formData.endDate,
        rentalMode
      );
      setEstimatedPrice(price);
    } else {
      setEstimatedPrice(0);
    }
  }, [selectedCarData, formData.startDate, formData.endDate, rentalMode]);

  // --- 🟢 3. TỰ ĐỘNG TÍNH TIỀN CỌC (10%) ---
  useEffect(() => {
    if (estimatedPrice > 0) {
      if (formData.paymentStatus === "PAID") {
        // Thanh toán hết
        setFormData((prev) => ({ ...prev, amountPaid: estimatedPrice }));
      } else if (formData.paymentStatus === "PARTIAL") {
        // Cọc 10%
        const depositAmount = Math.round(estimatedPrice * 0.1);
        setFormData((prev) => ({ ...prev, amountPaid: depositAmount }));
      } else if (formData.paymentStatus === "UNPAID") {
        setFormData((prev) => ({ ...prev, amountPaid: 0 }));
      }
    } else {
      // Nếu chưa có giá, reset về 0
      setFormData((prev) => ({ ...prev, amountPaid: 0 }));
    }
  }, [formData.paymentStatus, estimatedPrice]);

  // Handler nhập liệu UI
  const handleUiChange = (e) => {
    const { name, value } = e.target;
    setUiState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));
    if (field === "carId") {
      setSelectedCarData(selectedOption ? selectedOption.carData : null);
    }
  };

  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const { userId, carId, startDate, endDate, amountPaid, ...rest } = formData;

    // Validate Form
    if (!userId || !carId) {
      setFormError("Vui lòng chọn khách hàng và xe.");
      return;
    }
    if (!startDate || !endDate) {
      setFormError("Vui lòng chọn thời gian thuê đầy đủ.");
      return;
    }

    // Validate Logic Ngày Giờ
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setFormError(
        rentalMode === "hour"
          ? "Giờ trả xe phải sau giờ nhận xe."
          : "Ngày trả xe phải sau hoặc bằng ngày nhận xe."
      );
      return;
    }

    // Prepare Payload
    const payload = {
      ...rest,
      userId: parseInt(userId, 10),
      carId: parseInt(carId, 10),
      startDate,
      endDate,

      // 👇 QUAN TRỌNG: Gửi rentalType để Backend tính giá chuẩn
      rentalType: rentalMode,

      amountPaid: parseFloat(amountPaid) || 0,
    };

    try {
      await createOrder(payload);
      navigate("/bookings"); // Thành công thì chuyển trang
    } catch (err) {
      console.error("Lỗi submit:", err);
    }
  };

  // Prepare Options cho Select
  const customerOptions = customers.map((u) => ({
    value: u.USER_ID,
    label: `${u.FULLNAME || "Khách"} - ${u.PHONE || u.EMAIL}`,
  }));

  const carOptions = availableCars.map((car) => ({
    value: car.CAR_ID,
    label: `${car.BRAND} ${car.MODEL} - ${car.LICENSE_PLATE}`,
    carData: car,
  }));

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
            <div className="p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
              ⚠ {formError}
            </div>
          )}
          {apiError && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              Lỗi API: {apiError.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- CỘT TRÁI: KHÁCH HÀNG & XE --- */}
            <div className="space-y-4">
              <div>
                <label className={labelBaseStyle}>Khách hàng *</label>
                <Select
                  options={customerOptions}
                  isLoading={customersLoading}
                  onChange={(opt) => handleSelectChange("userId", opt)}
                  placeholder="Tìm kiếm..."
                  styles={customSelectStyles}
                  required
                />
              </div>

              <div>
                <label className={labelBaseStyle}>Xe khả dụng *</label>
                <Select
                  options={carOptions}
                  isLoading={carsLoading}
                  onChange={(opt) => handleSelectChange("carId", opt)}
                  placeholder="Tìm kiếm xe..."
                  styles={customSelectStyles}
                  required
                />
              </div>

              {/* Box Hiển Thị Giá & Mode */}
              <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                <span className="block text-sm text-blue-600 font-semibold">
                  TỔNG TIỀN DỰ KIẾN:
                </span>
                <span className="text-2xl font-bold text-blue-800">
                  {formatCurrency(estimatedPrice)}
                </span>

                {selectedCarData && estimatedPrice > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      Hình thức:{" "}
                      <span className="font-bold text-blue-700 uppercase">
                        {rentalMode === "hour" ? "THEO GIỜ" : "THEO NGÀY"}
                      </span>
                    </p>
                    <div className="text-xs text-gray-500 mt-1 p-2 bg-white rounded border border-blue-100">
                      {rentalMode === "hour" ? (
                        <span>
                          Đơn giá:{" "}
                          <b>
                            {formatCurrency(selectedCarData.PRICE_PER_HOUR)}/giờ
                          </b>
                        </span>
                      ) : (
                        <span>
                          Đơn giá:{" "}
                          <b>
                            {formatCurrency(selectedCarData.PRICE_PER_DAY)}/ngày
                          </b>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- CỘT PHẢI: THỜI GIAN & THANH TOÁN --- */}
            <div className="space-y-4">
              {/* 🟢 Select Mode Thuê */}
              <div>
                <label className={labelBaseStyle}>Loại hình thuê *</label>
                <select
                  value={rentalMode}
                  onChange={(e) => {
                    setRentalMode(e.target.value);
                    // Reset input ngày giờ khi đổi mode để tránh lỗi logic
                    setUiState({
                      dateOnlyStart: "",
                      dateOnlyEnd: "",
                      singleDate: "",
                      timeStart: "",
                      timeEnd: "",
                    });
                  }}
                  className={`${inputBaseStyle} font-bold text-blue-600`}
                >
                  <option value="day">Thuê Theo Ngày (Tính trọn ngày)</option>
                  <option value="hour">Thuê Theo Giờ (Tính theo giờ)</option>
                </select>
              </div>

              {/* 🟢 Render UI Theo Ngày */}
              {rentalMode === "day" && (
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border border-gray-200">
                  <div>
                    <label className={labelBaseStyle}>Ngày bắt đầu</label>
                    <input
                      type="date"
                      name="dateOnlyStart"
                      value={uiState.dateOnlyStart}
                      onChange={handleUiChange}
                      className={inputBaseStyle}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelBaseStyle}>Ngày kết thúc</label>
                    <input
                      type="date"
                      name="dateOnlyEnd"
                      value={uiState.dateOnlyEnd}
                      onChange={handleUiChange}
                      className={inputBaseStyle}
                      required
                    />
                  </div>
                  <div className="col-span-2 text-[11px] text-gray-500 italic">
                    *Hệ thống tự tính: 00:00 ngày đầu đến 23:59 ngày cuối.
                  </div>
                </div>
              )}

              {/* 🟢 Render UI Theo Giờ */}
              {rentalMode === "hour" && (
                <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-200">
                  <div>
                    <label className={labelBaseStyle}>Ngày thuê</label>
                    <input
                      type="date"
                      name="singleDate"
                      value={uiState.singleDate}
                      onChange={handleUiChange}
                      className={inputBaseStyle}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelBaseStyle}>Giờ nhận xe</label>
                      <input
                        type="time"
                        name="timeStart"
                        value={uiState.timeStart}
                        onChange={handleUiChange}
                        className={inputBaseStyle}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelBaseStyle}>Giờ trả xe</label>
                      <input
                        type="time"
                        name="timeEnd"
                        value={uiState.timeEnd}
                        onChange={handleUiChange}
                        className={inputBaseStyle}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- Phần Thanh Toán --- */}
              <div>
                <label className={labelBaseStyle}>Phương thức thanh toán</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleCommonChange}
                  className={inputBaseStyle}
                >
                  <option value="CASH">Tiền mặt</option>
                  <option value="BANK_TRANSFER">Chuyển khoản</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border">
                <div>
                  <label className={labelBaseStyle}>Trạng thái</label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleCommonChange}
                    className={inputBaseStyle}
                  >
                    <option value="UNPAID">Chưa thanh toán</option>
                    <option value="PARTIAL">Đặt cọc (10%)</option>
                    <option value="PAID">Thanh toán hết (100%)</option>
                  </select>
                </div>
                <div>
                  <label className={labelBaseStyle}>
                    Số tiền thực thu (VNĐ)
                  </label>
                  <input
                    type="text"
                    name="amountPaid"
                    // Format tiền hiển thị, bỏ ký hiệu đ để user dễ nhìn số
                    value={formatCurrency(formData.amountPaid)
                      .replace("₫", "")
                      .trim()}
                    readOnly
                    className={`${inputBaseStyle} bg-gray-200 text-gray-600 font-bold cursor-not-allowed`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.paymentStatus === "PARTIAL"
                      ? "*Hệ thống tự tính 10%"
                      : "*Hệ thống tự tính"}
                  </p>
                </div>
              </div>

              <div>
                <label className={labelBaseStyle}>Ghi chú</label>
                <textarea
                  name="note"
                  rows="2"
                  value={formData.note}
                  onChange={handleCommonChange}
                  className={inputBaseStyle}
                  placeholder="Ghi chú thêm..."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={loading} className="min-w-[200px]">
              {loading
                ? "Đang xử lý..."
                : `Tạo Đơn Hàng (${formatCurrency(formData.amountPaid)})`}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
