import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import useCars from "../../hooks/useCar";
import useCarImage from "../../hooks/useCarImage";

// Khai báo biến môi trường cho URL backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default function VehicleUpdateImage() {
  const { id } = useParams();
  const carId = id;

  const { fetchCarById, selectedCar, loading: carLoading } = useCars();

  const {
    images,
    previewUrls,
    loading: imageLoading,
    error,
    handleFileSelect,
    addImages,
    deleteImage,
    fetchImages,
  } = useCarImage(carId);

  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (carId) fetchCarById(carId);
  }, [carId, fetchCarById]);

  const toggleSelectDelete = (imageId) => {
    setSelectedForDelete((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  // TH1: Chỉ thêm ảnh mới
  const handleUploadImages = async () => {
    await addImages();
    setMessage("Tải hình mới thành công!");
    await fetchImages();
  };

  // TH2: Chỉ xóa ảnh cũ
  const handleDeleteImages = async () => {
    if (!selectedForDelete.length) {
      setMessage("Vui lòng chọn ít nhất một hình để xóa!");
      return;
    }
    try {
      await Promise.all(selectedForDelete.map((id) => deleteImage(id)));
      setMessage("Xóa hình thành công!");
      setSelectedForDelete([]);
      await fetchImages();
    } catch (err) {
      setMessage(`Có lỗi khi xóa hình: ${err.message}`);
    }
  };

  // TH3: Xóa cũ + Thêm mới
  const handleDeleteAndUpload = async () => {
    setMessage("Đang xử lý...");
    try {
      // Thực hiện xóa nếu có chọn
      if (selectedForDelete.length > 0) {
        await Promise.all(selectedForDelete.map((id) => deleteImage(id)));
        setSelectedForDelete([]);
      }

      // Thực hiện upload nếu có chọn file mới
      if (previewUrls.length > 0) {
        await addImages();
      }

      setMessage("Cập nhật hình ảnh thành công!");
      await fetchImages();
    } catch (err) {
      setMessage(`Có lỗi trong quá trình thao tác: ${err.message}`);
    }
  };

  const isLoading = carLoading || imageLoading;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <Card title={`Quản lý hình ảnh xe #${carId}`}>
          {isLoading ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : !selectedCar ? (
            <p className="text-gray-500">Không tìm thấy thông tin xe.</p>
          ) : (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  {selectedCar.BRAND} {selectedCar.MODEL}
                </h3>
                <p className="text-sm text-gray-600">
                  Biển số: <b>{selectedCar.LICENSE_PLATE}</b>
                </p>
              </div>
              {images && images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Hình hiện tại (chọn để xóa)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img) => (
                      <div
                        key={img.IMAGE_ID}
                        className={`relative border rounded-lg overflow-hidden shadow-sm ${
                          selectedForDelete.includes(img.IMAGE_ID)
                            ? "ring-2 ring-red-500"
                            : ""
                        }`}
                        onClick={() => toggleSelectDelete(img.IMAGE_ID)}
                      >
                        <img
                          // SỬ DỤNG BACKEND_URL Ở ĐÂY
                          src={`${BACKEND_URL}/images/${img.URL}`}
                          alt={img.URL}
                          className="w-full h-40 object-cover cursor-pointer"
                        />
                        {img.IS_MAIN === 1 && (
                          <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                            Ảnh chính
                          </div>
                        )}
                        {selectedForDelete.includes(img.IMAGE_ID) && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm">
                            Xóa
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thêm hình mới
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2"
                />
              </div>
              {previewUrls.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Xem trước hình mới
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewUrls.map((p, idx) => (
                      <div key={idx} className="border rounded-lg p-1">
                        <img
                          src={p.url}
                          alt={p.name}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <p className="text-xs mt-1 text-center text-gray-500 truncate">
                          {p.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-3 justify-end">
                <Button
                  onClick={handleDeleteImages}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={selectedForDelete.length === 0 || imageLoading}
                >
                  Xóa hình đã chọn
                </Button>
                <Button
                  onClick={handleUploadImages}
                  className="bg-green-600"
                  disabled={previewUrls.length === 0 || imageLoading}
                >
                  Thêm hình mới
                </Button>
                <Button
                  onClick={handleDeleteAndUpload}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={
                    (selectedForDelete.length === 0 &&
                      previewUrls.length === 0) ||
                    imageLoading
                  }
                >
                  Lưu thay đổi
                </Button>
              </div>
              {message && (
                <div className="text-center text-sm text-gray-700">
                  {message}
                </div>
              )}
              {error && (
                <div className="text-center text-sm text-red-500">
                  Lỗi: {error}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
