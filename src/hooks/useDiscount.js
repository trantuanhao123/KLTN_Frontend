// src/hooks/useDiscount.js

import { useState, useEffect, useCallback } from "react";
import discountApi from "../api/discount";

// (Hàm createError giữ nguyên)
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const useDiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // READ (Lấy danh sách)
  const fetchDiscounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // SỬA LỖI:
      // Giả định api.getDiscounts() trả về mảng [...] trực tiếp
      const data = await discountApi.getAllDiscounts();

      // Kiểm tra xem 'data' có phải là mảng không
      if (Array.isArray(data)) {
        setDiscounts(data);
      } else {
        // Nếu API trả về 'undefined' (do lỗi bị catch)
        // hoặc một object (ví dụ: { message: "..."})
        console.error("API không trả về một mảng:", data);
        setDiscounts([]); // Set mảng rỗng để tránh crash Table
      }
    } catch (err) {
      // Bắt lỗi nếu api.getDiscounts() NÉM lỗi (thay vì trả undefined)
      console.error("Lỗi khi tải danh sách:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message || // Thêm err.message
        "Không thể tải danh sách mã giảm giá.";
      setError(createError(errMsg, err.response?.status || 500));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // READ (Lấy chi tiết theo ID)
  const loadDiscount = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      // SỬA LỖI: Giả định api.getDiscountById() trả về object {...} trực tiếp
      const data = await discountApi.getDiscountById(id);
      setSelectedDiscount(data);
      return data;
    } catch (err) {
      console.error(`Lỗi tải mã giảm giá ID ${id}:`, err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Không thể tải chi tiết mã giảm giá.";
      setError(createError(errMsg, err.response?.status || 404));
      throw createError(errMsg, err.response?.status || 404);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // CREATE / UPDATE (Lưu)
  const saveDiscount = async (discountData) => {
    setIsLoading(true);
    setError(null);
    const isUpdate = !!discountData.DISCOUNT_ID;

    try {
      let responseData;
      if (isUpdate) {
        const id = discountData.DISCOUNT_ID;
        const dataToUpdate = { ...discountData };
        delete dataToUpdate.DISCOUNT_ID;
        // SỬA LỖI: Giả định api.updateDiscount() trả về data đã update
        responseData = await discountApi.updateDiscount(id, dataToUpdate);
      } else {
        // SỬA LỖI: Giả định api.createDiscount() trả về data đã tạo
        responseData = await discountApi.createDiscount(discountData);
      }

      await fetchDiscounts(); // Tải lại list

      if (isUpdate) {
        setSelectedDiscount(null);
      }
      return responseData; // Trả về data
    } catch (err) {
      console.error("Lỗi lưu mã giảm giá:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Lưu mã giảm giá thất bại.";
      setError(createError(errMsg, err.response?.status || 400));
      throw createError(errMsg, err.response?.status || 400);
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE (Xóa) (Giữ nguyên, vì nó không truy cập .data)
  const removeDiscount = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await discountApi.deleteDiscount(id);
      setDiscounts((prevDiscounts) =>
        prevDiscounts.filter((d) => d.DISCOUNT_ID !== id)
      );
      if (selectedDiscount && selectedDiscount.DISCOUNT_ID === id) {
        setSelectedDiscount(null);
      }
    } catch (err) {
      console.error(`Lỗi xóa mã giảm giá ID ${id}:`, err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Xóa mã giảm giá thất bại.";
      setError(createError(errMsg, err.response?.status || 400));
      throw createError(errMsg, err.response?.status || 400);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm dọn dẹp state (Giữ nguyên)
  const clearSelectedDiscount = () => {
    setSelectedDiscount(null);
    setError(null);
  };

  return {
    discounts,
    selectedDiscount,
    isLoading,
    error,
    fetchDiscounts,
    loadDiscount,
    saveDiscount,
    removeDiscount,
    clearSelectedDiscount,
  };
};
