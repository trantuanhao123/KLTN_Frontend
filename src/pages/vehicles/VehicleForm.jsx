import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import axios from "axios";

const BACKEND_URL = "http://localhost:8080";

export default function VehicleForm() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
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

  // Lấy danh sách dịch vụ từ API
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/service`)
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Lỗi tải dịch vụ:", err));
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn nhiều service
  const handleServiceChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setFormData((prev) => ({ ...prev, serviceIds: selectedOptions }));
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
          data.append("serviceIds", value.join(","));
        } else {
          data.append(key, value);
        }
      });

      const res = await axios.post(`${BACKEND_URL}/cars`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Thêm xe thành công! Mã xe: " + res.data.carId);
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
      console.error(err);
      alert("Lỗi khi gửi dữ liệu!");
    }
  };

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
            <div>
              <label className="block text-sm mb-1">Mã danh mục</label>
              <input
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
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

          <div>
            <label className="block text-sm mb-1">Chi nhánh</label>
            <input
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
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
            <select
              multiple
              name="serviceIds"
              value={formData.serviceIds}
              onChange={handleServiceChange}
              className="w-full border rounded px-3 py-2"
            >
              {services.map((s) => (
                <option key={s.SERVICE_ID} value={s.SERVICE_ID}>
                  {s.NAME}
                </option>
              ))}
            </select>
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
