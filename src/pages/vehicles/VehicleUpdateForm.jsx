import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import useServices from "../../hooks/useService";
import useBranches from "../../hooks/useBranch";
import useCategory from "../../hooks/useCategory";
import useCars from "../../hooks/useCar";

export default function VehicleUpdateForm() {
  const { id: carId } = useParams();
  const { fetchCarById, updateCar, error: carError } = useCars();
  const {
    services,
    isLoading: loadingServices,
    error: servicesError,
  } = useServices();
  const {
    branches,
    isLoading: loadingBranches,
    error: branchesError,
  } = useBranches();
  const {
    categories,
    isLoading: loadingCategories,
    error: categoriesError,
  } = useCategory();

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
  });

  const [isFetchingCar, setIsFetchingCar] = useState(true);

  useEffect(() => {
    if (!carId) {
      setIsFetchingCar(false);
      return;
    }

    const loadCarData = async () => {
      try {
        const carData = await fetchCarById(carId);
        if (!carData) return;

        const serviceIdsArray = (carData.services || []).map((s) =>
          String(s.SERVICE_ID || s.serviceId || s.id)
        );

        setFormData({
          licensePlate: carData.LICENSE_PLATE || "",
          categoryId: String(carData.CATEGORY_ID || ""),
          brand: carData.BRAND || "",
          model: carData.MODEL || "",
          color: carData.COLOR || "",
          transmission: carData.TRANSMISSION || "AUTOMATIC",
          fuelType: carData.FUEL_TYPE || "PETROL",
          status: carData.STATUS || "AVAILABLE",
          pricePerHour: carData.PRICE_PER_HOUR || "",
          pricePerDay: carData.PRICE_PER_DAY || "",
          branchId: String(carData.BRANCH_ID || ""),
          description: carData.DESCRIPTION || "",
          insuranceInfo: carData.INSURANCE_INFO || "",
          currentMileage: carData.CURRENT_MILEAGE || "",
          serviceIds: serviceIdsArray,
        });
      } catch (e) {
        console.error("❌ Lỗi tải chi tiết xe:", e);
      } finally {
        setIsFetchingCar(false);
      }
    };

    loadCarData();
  }, [carId, fetchCarById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      serviceIds: checked
        ? [...prev.serviceIds, value]
        : prev.serviceIds.filter((id) => id !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carId) return alert("Không tìm thấy ID xe để cập nhật.");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "serviceIds") {
          data.append(key, value.join(","));
        } else {
          data.append(key, value);
        }
      });
      console.log(data);
      const res = await updateCar(carId, data);
      alert(`✅ Cập nhật xe thành công (ID: ${res.CAR_ID || carId})`);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật dữ liệu!");
    }
  };

  const isLoading =
    isFetchingCar || loadingServices || loadingBranches || loadingCategories;
  const hasError =
    carError || servicesError || branchesError || categoriesError;

  if (isLoading) {
    return (
      <Layout>
        <Card title="Cập nhật Xe">
          <p>Đang tải dữ liệu xe...</p>
        </Card>
      </Layout>
    );
  }

  if (hasError) {
    return (
      <Layout>
        <Card title="Cập nhật Xe">
          <p className="text-red-500">
            Lỗi tải dữ liệu: {hasError.message || hasError}
          </p>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card title={`Cập nhật Xe: ${formData.licensePlate || "Đang tải..."}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- GRID 1 --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Biển số</label>
              <input
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-sm">Danh mục</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.CATEGORY_ID} value={String(c.CATEGORY_ID)}>
                    {c.NAME} ({c.CODE})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- GRID 2 --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Hãng xe</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm">Mẫu xe</label>
              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* --- GRID 3 --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Màu sắc</label>
              <input
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm">Truyền động</label>
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

          {/* --- GRID 4 --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Nhiên liệu</label>
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
              <label className="text-sm">Trạng thái</label>
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

          {/* --- GIÁ --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Giá / giờ</label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm">Giá / ngày</label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* --- BRANCH --- */}
          <div>
            <label className="text-sm">Chi nhánh</label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Chọn chi nhánh --</option>
              {branches.map((b) => (
                <option key={b.BRANCH_ID} value={String(b.BRANCH_ID)}>
                  {b.NAME}
                </option>
              ))}
            </select>
          </div>

          {/* --- DỊCH VỤ --- */}
          <div>
            <label className="text-sm">Dịch vụ đi kèm</label>
            <div className="border rounded p-3 space-y-2">
              {services.map((s) => {
                const serviceId = String(s.SERVICE_ID);
                return (
                  <div key={s.SERVICE_ID} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`service-${s.SERVICE_ID}`}
                      checked={formData.serviceIds.includes(serviceId)}
                      onChange={handleServiceChange}
                      value={serviceId}
                      className="mr-2 h-4 w-4"
                    />
                    <label
                      htmlFor={`service-${s.SERVICE_ID}`}
                      className="text-sm"
                    >
                      {s.NAME}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- MÔ TẢ --- */}
          <div>
            <label className="text-sm">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Lưu Cập nhật</Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
