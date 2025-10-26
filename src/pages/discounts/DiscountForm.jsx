// src/pages/discounts/DiscountForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import * as api from "../../api/discount.js"; // <-- KHÔNG CẦN NỮA
import { useDiscountManagement } from "../../hooks/useDiscount"; // <-- SỬ DỤNG HOOK

import Layout from "../../components/layouts/Layout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

export default function DiscountForm() {
  const navigate = useNavigate();
  // Lấy hàm save và isLoading từ hook
  const { saveDiscount, isLoading } = useDiscountManagement();

  // const [isSubmitting, setIsSubmitting] = useState(false); // <-- DÙNG isLoading CỦA HOOK
  const [formData, setFormData] = useState({
    CODE: "",
    NAME: "",
    TYPE: "PERCENT",
    VALUE: 0,
    START_DATE: "",
    END_DATE: "",
    QUANTITY: null,
  });
  // State lỗi riêng của form (do hook ném ra)
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : null) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null); // Xóa lỗi cũ

    // Chuẩn bị data (giữ nguyên)
    const dataToSubmit = { ...formData };
    if (!dataToSubmit.QUANTITY) dataToSubmit.QUANTITY = null;
    if (!dataToSubmit.START_DATE) dataToSubmit.START_DATE = null;
    if (!dataToSubmit.END_DATE) dataToSubmit.END_DATE = null;

    try {
      await saveDiscount(dataToSubmit); // <-- GỌI HÀM TỪ HOOK
      alert("Tạo mã giảm giá thành công!");
      navigate("/discounts"); // Điều hướng
    } catch (err) {
      // Lỗi (ví dụ: Trùng code) được ném ra từ hook
      console.error(err);
      setFormError(err.message); // Hiển thị lỗi trên form
    }
  };

  // --- Class CSS (giữ nguyên) ---
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary";
  const selectClass = inputClass;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Tạo mã giảm giá mới
      </h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hiển thị lỗi do hook ném ra */}
          {formError && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
              Lỗi: {formError}
            </div>
          )}

          {/* (Toàn bộ input fields giữ nguyên) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="CODE" className={labelClass}>
                Mã Code *
              </label>
              <input
                id="CODE"
                name="CODE"
                value={formData.CODE}
                onChange={handleChange}
                required
                className={inputClass}
                disabled={isLoading} // <-- Dùng isLoading của hook
              />
            </div>
            {/* ... các input khác cũng thêm disabled={isLoading} */}
            <div>
              <label htmlFor="NAME" className={labelClass}>
                Tên (Không bắt buộc)
              </label>
              <input
                id="NAME"
                name="NAME"
                value={formData.NAME}
                onChange={handleChange}
                className={inputClass}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="TYPE" className={labelClass}>
                Loại *
              </label>
              <select
                id="TYPE"
                name="TYPE"
                value={formData.TYPE}
                onChange={handleChange}
                required
                className={selectClass}
                disabled={isLoading}
              >
                <option value="PERCENT">PERCENT (Phần trăm)</option>
                <option value="AMOUNT">AMOUNT (Số tiền)</option>
              </select>
            </div>
            <div>
              <label htmlFor="VALUE" className={labelClass}>
                Giá trị *
              </label>
              <input
                id="VALUE"
                name="VALUE"
                type="number"
                step="0.01"
                min="0"
                value={formData.VALUE}
                onChange={handleChange}
                required
                className={inputClass}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="START_DATE" className={labelClass}>
                Ngày bắt đầu
              </label>
              <input
                id="START_DATE"
                name="START_DATE"
                type="date"
                value={formData.START_DATE}
                onChange={handleChange}
                className={inputClass}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="END_DATE" className={labelClass}>
                Ngày kết thúc
              </label>
              <input
                id="END_DATE"
                name="END_DATE"
                type="date"
                value={formData.END_DATE}
                onChange={handleChange}
                className={inputClass}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="QUANTITY" className={labelClass}>
              Số lượng (Bỏ trống = vô hạn)
            </label>
            <input
              id="QUANTITY"
              name="QUANTITY"
              type="number"
              min="0"
              value={formData.QUANTITY || ""}
              onChange={handleChange}
              className={inputClass}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Link to="/discounts">
              <Button
                type="button"
                className="bg-gray-200 text-gray-800 hover:opacity-90"
                disabled={isLoading} // <-- Dùng isLoading của hook
              >
                Hủy
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
