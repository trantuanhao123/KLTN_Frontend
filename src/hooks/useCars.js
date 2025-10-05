// src/hooks/useCars.js
import { useEffect, useState } from "react";
import carApi from "../api/vehicles";

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

  // 🟡 Lấy chi tiết xe theo ID
  async function fetchCarById(id) {
    try {
      setLoading(true);
      const res = await carApi.getCarById(id);
      setSelectedCar(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || "Không tải được thông tin xe");
    } finally {
      setLoading(false);
    }
  }

  // 🟠 Thêm xe mới
  async function createCar(formData) {
    try {
      const res = await carApi.createCar(formData);
      await fetchAllCars();
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Không thể tạo xe");
    }
  }

  // 🔴 Xóa xe
  async function deleteCar(id) {
    try {
      await carApi.deleteCar(id);
      setCars((prev) => prev.filter((c) => c.CAR_ID !== id));
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
    deleteCar,
  };
}
