// src/pages/discounts/DiscountUpdateForm.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDiscountManagement } from "../../hooks/useDiscount";
import Layout from "../../components/layouts/Layout.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

const formatDate = (date) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

export default function DiscountUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    loadDiscount,
    saveDiscount,
    selectedDiscount,
    isLoading,
    error: hookError,
  } = useDiscountManagement();

  const [formData, setFormData] = useState(null); // ❗Ban đầu null -> chờ load
  const [formError, setFormError] = useState(null);
  const [isPageReady, setIsPageReady] = useState(false);

  // 1️⃣ Lấy dữ liệu từ server
  useEffect(() => {
    let mounted = true;
    setIsPageReady(false);
    setFormError(null);

    (async () => {
      try {
        const data = await loadDiscount(id);
        if (mounted && data) {
          setFormData({
            ...data,
            VALUE: Number(data.VALUE),
            START_DATE: formatDate(data.START_DATE),
            END_DATE: formatDate(data.END_DATE),
            QUANTITY: data.QUANTITY ?? "",
          });
        }
      } catch (err) {
        if (mounted) setFormError(err.message);
      } finally {
        if (mounted) setIsPageReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, loadDiscount]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await saveDiscount({
        ...formData,
        QUANTITY: formData.QUANTITY || null,
        START_DATE: formData.START_DATE || null,
        END_DATE: formData.END_DATE || null,
      });
      alert("Cập nhật thành công!");
      navigate("/discounts");
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    }
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary";
  const selectClass = inputClass;

  // 🚀 Loading & error state gọn, không chớp
  if (!isPageReady) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500 animate-pulse">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (formError || hookError) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-600">
        {formError || hookError?.message || "Không thể tải dữ liệu"}
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Không tìm thấy dữ liệu giảm giá.
      </div>
    );
  }

  // ✅ Giao diện form mượt, không chớp
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Cập nhật mã giảm giá
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hàng 1 */}
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
                disabled
              />
            </div>
            <div>
              <label htmlFor="NAME" className={labelClass}>
                Tên chương trình
              </label>
              <input
                id="NAME"
                name="NAME"
                value={formData.NAME || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Hàng 2 */}
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
                className={selectClass}
              >
                <option value="PERCENT">Giảm theo phần trăm</option>
                <option value="AMOUNT">Giảm theo số tiền</option>
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
                value={formData.VALUE}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Hàng 3 */}
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
              />
            </div>
          </div>

          {/* Hàng 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="QUANTITY" className={labelClass}>
                Số lượng (bỏ trống = vô hạn)
              </label>
              <input
                id="QUANTITY"
                name="QUANTITY"
                type="number"
                min="0"
                value={formData.QUANTITY}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="STATUS" className={labelClass}>
                Trạng thái *
              </label>
              <select
                id="STATUS"
                name="STATUS"
                value={formData.STATUS}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
                <option value="EXPIRED">Hết hạn</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Link to="/discounts">
              <Button
                type="button"
                className="bg-gray-200 text-gray-800 hover:opacity-90"
              >
                Hủy
              </Button>
            </Link>
            <Button type="submit">
              {isLoading ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
