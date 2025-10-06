import React, { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import useCars from "../../hooks/useCar";

const BACKEND_URL = "http://localhost:8080";

export default function VehicleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedCar: car, fetchCarById, loading, error } = useCars();
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (id) fetchCarById(id);
  }, [id]);

  if (loading)
    return (
      <Layout>
        <p className="p-4 text-gray-500">Đang tải chi tiết xe...</p>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <p className="p-4 text-red-500">Lỗi: {error}</p>
      </Layout>
    );

  if (!car)
    return (
      <Layout>
        <p className="p-4 text-gray-500">Không tìm thấy xe.</p>
      </Layout>
    );

  const mainImage =
    car.images?.find((img) => img.IS_MAIN === 1)?.URL || car.mainImageUrl;
  const mainImageUrl = mainImage
    ? `${BACKEND_URL}/images/${mainImage}`
    : "/no-image.jpg";

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {car.BRAND} {car.MODEL}
        </h2>
        <Button
          className="bg-gray-500 hover:bg-gray-600 text-white"
          onClick={() => navigate("/vehicles")}
        >
          ← Quay lại danh sách
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Cột trái: Hình ảnh */}
          <div>
            <img
              src={mainImageUrl}
              alt={car.MODEL}
              className="rounded-lg shadow w-full max-h-96 object-cover mb-4 cursor-pointer hover:opacity-90 transition"
              onClick={() => setPreviewImage(mainImageUrl)}
            />
            {car.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {car.images
                  .filter((img) => img.IS_MAIN === 0)
                  .map((img) => {
                    const imgUrl = `${BACKEND_URL}/images/${img.URL}`;
                    return (
                      <img
                        key={img.IMAGE_ID}
                        src={imgUrl}
                        alt={img.URL}
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition"
                        onClick={() => setPreviewImage(imgUrl)}
                      />
                    );
                  })}
              </div>
            )}
          </div>

          {/* Cột phải: Thông tin chi tiết */}
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                <p>
                  <strong>Biển số:</strong> {car.LICENSE_PLATE}
                </p>
                <p>
                  <strong>Loại xe:</strong> {car.CATEGORY_NAME}
                </p>
                <p>
                  <strong>Chi nhánh:</strong> {car.BRANCH_NAME}
                </p>
                <p>
                  <strong>Màu sắc:</strong> {car.COLOR}
                </p>
                <p>
                  <strong>Truyền động:</strong> {car.TRANSMISSION}
                </p>
                <p>
                  <strong>Nhiên liệu:</strong> {car.FUEL_TYPE}
                </p>
                <p>
                  <strong>Odo hiện tại:</strong> {car.CURRENT_MILEAGE} km
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      car.STATUS === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {car.STATUS}
                  </span>
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(car.CREATED_AT).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Giá thuê
              </h3>
              <div className="text-sm mt-2">
                <p>
                  <strong>Giá theo giờ:</strong>{" "}
                  {Number(car.PRICE_PER_HOUR).toLocaleString("vi-VN")} ₫
                </p>
                <p>
                  <strong>Giá theo ngày:</strong>{" "}
                  {Number(car.PRICE_PER_DAY).toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Mô tả & Dịch vụ
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-line mt-1">
                {car.DESCRIPTION || "Không có mô tả."}
              </p>

              {car.services?.length > 0 && (
                <ul className="flex flex-wrap gap-2 mt-2">
                  {car.services.map((srv) => (
                    <li
                      key={srv.SERVICE_ID}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                    >
                      {srv.SERVICE_NAME}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Bảo hiểm
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                {car.INSURANCE_INFO || "Không có thông tin bảo hiểm."}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 🖼️ Modal xem hình lớn */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />
        </div>
      )}
    </Layout>
  );
}
