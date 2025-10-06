import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
// Import Custom Hooks
import useServices from "../../hooks/useService";
import useBranches from "../../hooks/useBranch";
import useCategory from "../../hooks/useCategory";
import useCars from "../../hooks/useCar"; // ✅ Đã thêm import useCars

export default function VehicleForm() {
  const { createCar } = useCars(); // ✅ Sử dụng hook để lấy hàm createCar

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

  const [formData, setFormData] = useState({
    licensePlate: "",
    categoryId: "", // Trường này sẽ chứa CATEGORY_ID được chọn
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
  });

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
        // Thêm ID vào mảng nếu checkbox được chọn
        newServiceIds = [...prev.serviceIds, value];
      } else {
        // Lọc bỏ ID khỏi mảng nếu checkbox bị bỏ chọn
        newServiceIds = prev.serviceIds.filter((id) => id !== value);
      }
      return { ...prev, serviceIds: newServiceIds };
    });
  };

  // Xử lý chọn nhiều file ảnh
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, carImages: files }));
  };

  // Gửi form-data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "carImages") {
          value.forEach((file) => data.append("carImages", file));
        } else if (key === "serviceIds") {
          // Vẫn append serviceIds dưới dạng chuỗi ngăn cách bằng dấu phẩy
          data.append("serviceIds", value.join(","));
        } else {
          data.append(key, value);
        }
      });

      // ✅ Đã sửa: Gọi hàm createCar từ hook, hàm này sẽ sử dụng carApi.post("/car")
      const res = await createCar(data);

      // Dòng này cần được kiểm tra lại field trả về từ API
      alert("Thêm xe thành công! Mã xe: " + res.CAR_ID);

      // Reset form data
      setFormData({
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
      });
    } catch (err) {
      // Bắt lỗi được throw từ createCar hook
      console.error(err);
      alert(err.message || "Lỗi khi gửi dữ liệu!");
    }
  };

  // Xử lý trạng thái tải và lỗi
  if (isLoadingServices || isLoadingBranches || isLoadingCategories) {
    return (
      <Layout>
        <Card title="Thêm / Chỉnh sửa Xe">
          <p>Đang tải dữ liệu cần thiết...</p>
        </Card>
      </Layout>
    );
  }

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
            {/* TRƯỜNG DANH MỤC XE ĐÃ THAY ĐỔI */}
            <div>
              <label className="block text-sm mb-1">Mã danh mục</label>
              <select // Thay thế input bằng select
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
                  <option
                    key={c.CATEGORY_ID}
                    value={c.CATEGORY_ID} // Truyền CATEGORY_ID
                  >
                    {c.NAME} ({c.CODE}) {/* Hiển thị Tên và Mã CODE */}
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
            <div>
              <label className="block text-sm mb-1">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RENTED">Rented</option>
                <option value="MAINTENANCE">Maintenance</option>
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
              />
            </div>
          </div>

          {/* TRƯỜNG CHI NHÁNH */}
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
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Dịch vụ đi kèm</label>
            <div className="border rounded p-3 space-y-2">
              {" "}
              {/* Thêm div bọc để định dạng */}
              {services.map((s) => (
                <div key={s.SERVICE_ID} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`service-${s.SERVICE_ID}`}
                    name="serviceIds"
                    value={s.SERVICE_ID}
                    checked={formData.serviceIds.includes(String(s.SERVICE_ID))} // Kiểm tra xem ID có trong mảng không
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
            {formData.carImages.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {formData.carImages.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Lưu xe</Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
