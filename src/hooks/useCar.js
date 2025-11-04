import { useEffect, useState, useCallback } from "react";
import carApi from "../api/car";

export default function useCars() {
  const [cars, setCars] = useState([]);
  const [availableCars, setAvailableCars] = useState([]); // 🆕 Thêm state cho xe khả dụng
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 🆕 Hàm mới lấy xe khả dụng
  const fetchAvailableCars = useCallback(async () => {
    try {
      const res = await carApi.getAvailableCars();
      setAvailableCars(res.data || []);
      return res.data;
    } catch (err) {
      setError(err.message || "Không tải được danh sách xe khả dụng");
      throw err;
    }
  }, []);

  const fetchCarById = useCallback(async (id) => {
    try {
      const res = await carApi.getCarById(id);
      setSelectedCar(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || "Không tải được thông tin xe");
      throw err;
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
      await fetchAllCars();

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
    availableCars,
    selectedCar,
    loading,
    error,
    fetchAllCars,
    fetchAvailableCars,
    fetchCarById,
    createCar,
    updateCar,
    deleteCar,
  };
}
