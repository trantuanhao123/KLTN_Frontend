import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// Import Custom Hooks
import useServices from "../../hooks/useService";
import useBranches from "../../hooks/useBranch";
import useCategory from "../../hooks/useCategory";
import useCars from "../../hooks/useCar";

export default function VehicleUpdateForm() {
  const { id: carId } = useParams();
  const { fetchCarById, updateCar, error: carError } = useCars();

  const {
    services,
    isLoading: isLoadingServices,
    error: servicesError,
  } = useServices();

  const {
    branches,
    isLoading: isLoadingBranches,
    error: branchesError,
  } = useBranches();

  const {
    categories,
    isLoading: isLoadingCategories,
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
    carImages: [],
  });

  const [currentImages, setCurrentImages] = useState([]);
  const [isFetchingCar, setIsFetchingCar] = useState(true);

  // 🟢 DEBUG: Log để kiểm tra dữ liệu
  useEffect(() => {
    console.log("🔍 Current formData.serviceIds:", formData.serviceIds);
    console.log("🔍 Available services:", services);
  }, [formData.serviceIds, services]);

  useEffect(() => {
    if (!carId) {
      setIsFetchingCar(false);
      return;
    }

    const loadCarData = async () => {
      setIsFetchingCar(true);
      try {
        const carData = await fetchCarById(carId);

        if (carData) {
          // 🟢 LOG: Kiểm tra dữ liệu trả về
          console.log("📦 Full Car Data:", carData);
          console.log("🔧 Services from API:", carData.services);
          console.log("🖼️ Images from API:", carData.images);

          // 🟢 XỬ LÝ SERVICE IDS - Từ API trả về 'services' (chữ thường)
          let serviceIdsArray = [];
          const servicesData = carData.services || carData.Services || [];

          if (Array.isArray(servicesData)) {
            serviceIdsArray = servicesData.map((s) => {
              // API trả về SERVICE_ID
              const id = s.SERVICE_ID || s.serviceId || s.id;
              return String(id);
            });
          }

          console.log("✅ Converted serviceIds:", serviceIdsArray);

          const initialData = {
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
            carImages: [],
          };

          setFormData(initialData);

          // 🟢 XỬ LÝ IMAGES - API trả về 'images' (chữ thường)
          const imagesData =
            carData.images || carData.CarImages || carData.carImages || [];
          console.log("✅ Processed images:", imagesData);
          setCurrentImages(imagesData);
        } else {
          console.warn(`⚠️ Không tìm thấy xe với ID: ${carId}`);
        }
      } catch (e) {
        console.error("❌ Lỗi khi tải chi tiết xe:", e);
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

    // 🟢 LOG: Debug checkbox change
    console.log(`🔘 Checkbox changed: ${value}, Checked: ${checked}`);

    setFormData((prev) => {
      let newServiceIds;
      if (checked) {
        newServiceIds = [...prev.serviceIds, value];
      } else {
        newServiceIds = prev.serviceIds.filter((id) => id !== value);
      }

      console.log("✅ New serviceIds:", newServiceIds);
      return { ...prev, serviceIds: newServiceIds };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, carImages: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carId) {
      alert("Không tìm thấy ID xe để cập nhật.");
      return;
    }

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

      const res = await updateCar(carId, data);
      alert("Cập nhật xe thành công! Mã xe: " + res.CAR_ID);
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi cập nhật dữ liệu!");
    }
  };

  const isGlobalLoading =
    isFetchingCar ||
    isLoadingServices ||
    isLoadingBranches ||
    isLoadingCategories;

  if (isGlobalLoading) {
    return (
      <Layout>
        <Card title="Cập nhật Xe">
          <p>Đang tải dữ liệu xe và các tùy chọn...</p>
        </Card>
      </Layout>
    );
  }

  const combinedError =
    carError || servicesError || branchesError || categoriesError;
  if (combinedError) {
    return (
      <Layout>
        <Card title="Cập nhật Xe">
          <p className="text-red-500">
            Lỗi tải dữ liệu: {combinedError.message || combinedError}
          </p>
        </Card>
      </Layout>
    );
  }

  if (!carId || (!isFetchingCar && !formData.licensePlate)) {
    return (
      <Layout>
        <Card title="Cập nhật Xe">
          <p className="text-red-500">
            Không tìm thấy xe cần cập nhật hoặc ID không hợp lệ. Vui lòng kiểm
            tra lại đường dẫn.
          </p>
        </Card>
      </Layout>
    );
  }

  const getImageUrl = (img) => {
    const rawUrl = img.URL || img.url || img.IMAGE_URL || img.image_url || "";

    // Nếu là relative path, cần thêm base URL
    if (rawUrl && !rawUrl.startsWith("http")) {
      const baseUrl = import.meta.env.BACKEND_URL || "http://localhost:8080";
      return `${baseUrl}/images/${rawUrl}`;
    }

    return rawUrl;
  };

  return (
    <Layout>
      <Card title={`Cập nhật Xe: ${formData.licensePlate || "Đang tải..."}`}>
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
                  <option key={c.CATEGORY_ID} value={String(c.CATEGORY_ID)}>
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
                <option key={b.BRANCH_ID} value={String(b.BRANCH_ID)}>
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

          {/* 🟢 DỊCH VỤ - Có debug info */}
          <div>
            <label className="block text-sm mb-1">
              Dịch vụ đi kèm
              <span className="text-xs text-gray-500 ml-2">
                (Đã chọn: {formData.serviceIds.length})
              </span>
            </label>
            <div className="border rounded p-3 space-y-2">
              {services.length === 0 ? (
                <p className="text-sm text-gray-500">Không có dịch vụ nào</p>
              ) : (
                services.map((s) => {
                  const serviceIdStr = String(s.SERVICE_ID);
                  const isChecked = formData.serviceIds.includes(serviceIdStr);

                  return (
                    <div key={s.SERVICE_ID} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`service-${s.SERVICE_ID}`}
                        name="serviceIds"
                        value={serviceIdStr}
                        checked={isChecked}
                        onChange={handleServiceChange}
                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`service-${s.SERVICE_ID}`}
                        className="text-sm cursor-pointer"
                      >
                        {s.NAME}
                        <span className="text-xs text-gray-400 ml-1">
                          (ID: {serviceIdStr})
                        </span>
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 🟢 HÌNH ẢNH - Có xử lý nhiều trường hợp URL */}
          <div>
            <label className="block text-sm mb-1">Hình ảnh hiện tại</label>
            {currentImages.length > 0 ? (
              <div className="mt-2 flex gap-2 flex-wrap">
                {currentImages.map((img, index) => {
                  const imageUrl = getImageUrl(img);
                  const imageId =
                    img.IMAGE_ID || img.imageId || img.id || index;

                  return (
                    <div key={imageId} className="relative w-24 h-24">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`current-${imageId}`}
                          className="w-full h-full object-cover rounded border border-yellow-500"
                          onError={(e) => {
                            console.error("❌ Lỗi load ảnh:", imageUrl);
                            e.target.src =
                              "https://via.placeholder.com/96?text=Error";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded border border-red-500">
                          <span className="text-xs text-gray-500">No URL</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        ID: {imageId}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa có ảnh nào.</p>
            )}

            <label className="block text-sm mt-4 mb-1">
              Thêm/Thay thế Hình ảnh mới
            </label>
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
                    alt={`preview-new-${idx}`}
                    className="w-24 h-24 object-cover rounded border border-green-500"
                  />
                ))}
              </div>
            )}
          </div>
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold text-lg">⚠️ CẢNH BÁO MẤT DỮ LIỆU!</p>
            <p className="text-base">
              Vui lòng điền đầy đủ và chính xác các trường dữ liệu
              <span className="text-red-600"></span>. Nếu không, dữ liệu có thể
              không được cập nhật hoặc bị mất sau khi lưu.
            </p>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Cập nhật Xe</Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
