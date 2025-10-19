import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
// Import Custom Hooks
import useServices from "../../hooks/useService";
import useBranches from "../../hooks/useBranch";
import useCategory from "../../hooks/useCategory";
import useCars from "../../hooks/useCar";

export default function VehicleForm() {
  const { createCar } = useCars();

  // Lấy dữ liệu Service
  const {
    services,
    isLoading: isLoadingServices,
    error: servicesError,
  } = useServices();

  // Lấy dữ liệu Branch (Chi nhánh)
  const {
    branches,
    isLoading: isLoadingBranches,
    error: branchesError,
  } = useBranches();

  // Lấy dữ liệu Category (Danh mục)
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategory();

  // ✅ CẢI TIẾN: Tách state cho dễ quản lý
  const initialFormData = {
    licensePlate: "",
    categoryId: "",
    brand: "",
    model: "",
    color: "",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    status: "AVAILABLE",
    pricePerHour: "",
    pricePerDay: "",
    branchId: "",
    description: "",
    insuranceInfo: "",
    currentMileage: "",
    serviceIds: [],
    carImages: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  // ✅ CẢI TIẾN: Thêm state cho xem trước ảnh và dọn dẹp memory leak
  const [previewUrls, setPreviewUrls] = useState([]);

  // ✅ CẢI TIẾN: Thêm state quản lý việc gửi form (submit)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn nhiều service
  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      let newServiceIds;
      if (checked) {
        newServiceIds = [...prev.serviceIds, value];
      } else {
        newServiceIds = prev.serviceIds.filter((id) => id !== value);
      }
      return { ...prev, serviceIds: newServiceIds };
    });
  };

  // ✅ CẢI TIẾN: Xử lý file và tạo URL xem trước
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, carImages: files }));

    // Dọn dẹp các URL xem trước cũ
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    // Tạo URL xem trước mới
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newUrls);
  };

  // ✅ CẢI TIẾN: Dọn dẹp URL xem trước khi component unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // ✅ CẢI TIẾN: Gửi form-data với quản lý state (loading, error, success)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "carImages") {
          value.forEach((file) => data.append("carImages", file));
        } else if (key === "serviceIds") {
          data.append("serviceIds", value.join(","));
        } else {
          data.append(key, value);
        }
      });

      const res = await createCar(data);

      // ✅ CẢI TIẾN: Hiển thị thông báo thành công (thay vì alert)
      setSubmitSuccess("Thêm xe thành công! Mã xe: " + (res.CAR_ID || res.id)); // Điều chỉnh field tùy theo API
      setFormData(initialFormData); // Reset form
      setPreviewUrls([]); // Reset ảnh xem trước

      // Tùy chọn: Xóa thông báo thành công sau vài giây
      setTimeout(() => setSubmitSuccess(null), 5000);
    } catch (err) {
      console.error(err);
      // ✅ CẢI TIẾN: Hiển thị thông báo lỗi cụ thể theo yêu cầu (thay vì alert)
      setSubmitError(
        "Không thể thêm xe. Vui lòng kiểm tra lại biển số xe hoặc dữ liệu nhập liệu không đúng định dạng."
      );
    } finally {
      setIsSubmitting(false); // Dừng trạng thái loading
    }
  };

  // Xử lý trạng thái tải dữ liệu ban đầu (services, branches...)
  if (isLoadingServices || isLoadingBranches || isLoadingCategories) {
    return (
      <Layout>
        <Card title="Thêm / Chỉnh sửa Xe">
          <p>Đang tải dữ liệu cần thiết...</p>
        </Card>
      </Layout>
    );
  }

  // Xử lý lỗi tải dữ liệu ban đầu
  if (servicesError || branchesError || categoriesError) {
    return (
      <Layout>
        <Card title="Thêm / Chỉnh sửa Xe">
          <p className="text-red-500">
            Lỗi tải dữ liệu: {servicesError || branchesError || categoriesError}
          </p>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card title="Thêm / Chỉnh sửa Xe">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* ... (Các trường input không đổi) ... */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Biển số</label>
              <input
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Mã danh mục</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="" disabled>
                  -- Chọn danh mục --
                </option>
                {categories.map((c) => (
                  <option key={c.CATEGORY_ID} value={c.CATEGORY_ID}>
                    {c.NAME} ({c.CODE})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Hãng xe</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Mẫu xe</label>
              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Màu sắc</label>
              <input
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Truyền động</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="AUTOMATIC">Tự động</option>
                <option value="MANUAL">Số sàn</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Nhiên liệu</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="PETROL">Xăng</option>
                <option value="DIESEL">Dầu</option>
                <option value="ELECTRIC">Điện</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Giá / giờ</label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0" // ✅ CẢI TIẾN: Ngăn số âm
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Giá / ngày</label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0" // ✅ CẢI TIẾN: Ngăn số âm
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Chi nhánh</label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="" disabled>
                -- Chọn chi nhánh --
              </option>
              {branches.map((b) => (
                <option key={b.BRANCH_ID} value={b.BRANCH_ID}>
                  {b.NAME}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Thông tin bảo hiểm</label>
            <input
              name="insuranceInfo"
              value={formData.insuranceInfo}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Số km hiện tại</label>
            <input
              type="number"
              name="currentMileage"
              value={formData.currentMileage}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min="0" // ✅ CẢI TIẾN: Ngăn số âm
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Dịch vụ đi kèm</label>
            <div className="border rounded p-3 space-y-2">
              {services.map((s) => (
                <div key={s.SERVICE_ID} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`service-${s.SERVICE_ID}`}
                    name="serviceIds"
                    value={String(s.SERVICE_ID)} // Chuyển sang string cho nhất quán
                    checked={formData.serviceIds.includes(String(s.SERVICE_ID))}
                    onChange={handleServiceChange}
                    className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`service-${s.SERVICE_ID}`}
                    className="text-sm cursor-pointer"
                  >
                    {s.NAME}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Hình ảnh xe</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {/* ✅ CẢI TIẾN: Hiển thị ảnh xem trước từ state `previewUrls` */}
            {previewUrls.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {previewUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`preview-${idx}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end items-center space-x-4">
            {/* ✅ CẢI TIẾN: Hiển thị thông báo thành công hoặc lỗi */}
            {submitSuccess && (
              <p className="text-sm text-green-600">{submitSuccess}</p>
            )}
            {submitError && (
              <p className="text-sm text-red-600">{submitError}</p>
            )}

            {/* ✅ CẢI TIẾN: Vô hiệu hóa nút và hiển thị loading text */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu xe"}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
