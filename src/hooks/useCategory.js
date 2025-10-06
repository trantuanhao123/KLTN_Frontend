// src/hooks/useCategory.js (Không sử dụng mapping)

import { useState, useEffect } from "react";
import categoriesApi from "../api/category";

const useCategory = () => {
  // Lưu ý: State sẽ chứa dữ liệu với key viết hoa (CATEGORY_ID, NAME)
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // READ (Lấy danh sách)
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await categoriesApi.getAllCategories();
      // >>> LƯU TRỰC TIẾP DỮ LIỆU THÔ TỪ API <<<
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
      setError("Không thể tải danh sách danh mục.");
    } finally {
      setIsLoading(false);
    }
  };

  // READ (Lấy chi tiết theo ID)
  const loadCategory = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await categoriesApi.getCategoryById(id);
      // >>> LƯU TRỰC TIẾP DỮ LIỆU THÔ TỪ API <<<
      setSelectedCategory(response.data);
      return response.data;
    } catch (err) {
      console.error(`Lỗi tải danh mục ID ${id}:`, err);
      setError("Không thể tải chi tiết danh mục.");
      throw new Error("Không thể tải chi tiết danh mục.");
    } finally {
      setIsLoading(false);
    }
  };

  // CREATE / UPDATE (Lưu)
  const saveCategory = async (categoryData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Phải sử dụng CATEGORY_ID để kiểm tra nếu là cập nhật
      const isUpdate = !!categoryData.CATEGORY_ID;
      const response = await categoriesApi.createUpdateCategory(categoryData);

      await fetchCategories();

      if (isUpdate) {
        setSelectedCategory(null);
      }
      return response.data;
    } catch (err) {
      console.error("Lỗi lưu danh mục:", err);
      setError("Lưu danh mục thất bại.");
      throw new Error("Lưu danh mục thất bại.");
    }
  };

  // DELETE (Xóa)
  const removeCategory = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?"))
      return;

    setIsLoading(true);
    setError(null);
    try {
      await categoriesApi.deleteCategory(id);

      // Lọc bỏ dựa trên CATEGORY_ID
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c.CATEGORY_ID !== id)
      );
      if (selectedCategory && selectedCategory.CATEGORY_ID === id) {
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error(`Lỗi xóa danh mục ID ${id}:`, err);
      setError("Xóa danh mục thất bại.");
      throw new Error("Xóa danh mục thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelectedCategory = () => setSelectedCategory(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    selectedCategory,
    isLoading,
    error,
    fetchCategories,
    loadCategory,
    saveCategory,
    removeCategory,
    clearSelectedCategory,
  };
};

export default useCategory;
