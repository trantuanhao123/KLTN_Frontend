import { useState, useEffect, useCallback } from "react";
import carImageApi from "../api/carImage";

/**
 * Hook quản lý hình ảnh của xe (get, add, delete, preview)
 *
 * @param {number|string} carId
 */
export default function useCarImage(carId) {
  const [images, setImages] = useState([]); // hình đang có trong DB
  const [newFiles, setNewFiles] = useState([]); // file mới chọn
  const [previewUrls, setPreviewUrls] = useState([]); // link preview local
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Lấy danh sách ảnh trong DB
  const fetchImages = useCallback(async () => {
    if (!carId) return;
    try {
      setLoading(true);
      const data = await carImageApi.getImagesByCarId(carId);
      setImages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [carId]);

  // 🔹 Khi chọn file mới → tạo preview local
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    setNewFiles(fileArray);

    const previews = fileArray.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPreviewUrls(previews);
  };

  // 🔹 Thêm ảnh mới (TH1 / TH3)
  const addImages = useCallback(async () => {
    if (!newFiles.length) return alert("Chưa chọn hình nào!");
    try {
      setLoading(true);
      await carImageApi.addCarImages(carId, newFiles);
      await fetchImages();
      // Xóa preview sau khi upload
      setNewFiles([]);
      setPreviewUrls([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [carId, newFiles, fetchImages]);

  // 🔹 Xóa ảnh cũ (TH2 / TH3)
  const deleteImage = useCallback(async (imageId) => {
    try {
      setLoading(true);
      await carImageApi.deleteCarImage(imageId);
      setImages((prev) => prev.filter((img) => img.IMAGE_ID !== imageId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cleanup blob URL tránh memory leak
  useEffect(() => {
    return () => {
      previewUrls.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previewUrls]);

  // Fetch danh sách ảnh khi mount
  useEffect(() => {
    if (carId) fetchImages();
  }, [carId, fetchImages]);

  return {
    images,
    newFiles,
    previewUrls,
    loading,
    error,
    handleFileSelect,
    addImages,
    deleteImage,
    fetchImages,
  };
}
