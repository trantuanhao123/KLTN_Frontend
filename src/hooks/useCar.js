// src/hooks/useCars.js
import { useEffect, useState, useCallback } from "react";
import carApi from "../api/vehicle";

export default function useCars() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 Lấy danh sách xe
  useEffect(() => {
    fetchAllCars();
  }, []);

  async function fetchAllCars() {
    try {
      setLoading(true);
      const res = await carApi.getAllCars();
      setCars(res.data || []);
    } catch (err) {
      setError(err.message || "Lỗi khi tải danh sách xe");
    } finally {
      setLoading(false);
    }
  }
  const fetchCarById = useCallback(async (id) => {
    try {
      // ❌ BỎ setLoading(true) để component cha tự quản lý loading ❌
      const res = await carApi.getCarById(id);
      setSelectedCar(res.data);
      return res.data;
    } catch (err) {
      // ✅ Giữ lại setError để ghi nhận lỗi (nếu cần)
      setError(err.message || "Không tải được thông tin xe");
      throw err; // Ném lỗi để component sử dụng có thể bắt được
    } finally {
      // ❌ BỎ setLoading(false) ❌
    }
  }, []);
  async function createCar(formData) {
    try {
      const res = await carApi.createCar(formData);
      await fetchAllCars();
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Không thể tạo xe");
    }
  }
  async function updateCar(id, formData) {
    try {
      const res = await carApi.updateCar(id, formData);
      const updatedCar = res.data;

      // Cập nhật lại danh sách xe
      await fetchAllCars();

      // Cập nhật selectedCar nếu nó là xe vừa được sửa
      if (selectedCar && selectedCar.CAR_ID === id) {
        setSelectedCar(updatedCar);
      }

      return updatedCar;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Không thể cập nhật xe");
    }
  }
  async function deleteCar(id) {
    try {
      await carApi.deleteCar(id);
      await fetchAllCars();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Không thể xóa xe");
    }
  }

  return {
    cars,
    selectedCar,
    loading,
    error,
    fetchAllCars,
    fetchCarById,
    createCar,
    updateCar,
    deleteCar,
  };
}
