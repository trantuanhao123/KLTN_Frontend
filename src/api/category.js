import axiosClient from "./axiosClient";

const categoriesApi = {
  // READ: Lấy danh sách tất cả danh mục (GET /category)
  getAllCategories: () => {
    return axiosClient.get("/category");
  },

  // READ: Lấy chi tiết danh mục theo ID (GET /category/:id)
  getCategoryById: (id) => {
    return axiosClient.get(`/category/${id}`);
  },
  createUpdateCategory: (categoryData) => {
    // Kiểm tra xem có ID (hoặc CATEGORY_ID) để xác định là UPDATE hay CREATE
    const id = categoryData.id || categoryData.CATEGORY_ID;

    if (id) {
      // UPDATE (PUT)
      // Loại bỏ ID khỏi data gửi đi (nếu cần thiết, tùy thuộc backend)
      const { id: categoryId, CATEGORY_ID, ...data } = categoryData;
      return axiosClient.put(`/category/${id}`, data);
    } else {
      // CREATE (POST)
      return axiosClient.post("/category", categoryData);
    }
  },

  // DELETE: Xóa danh mục theo ID (DELETE /category/:id)
  deleteCategory: (id) => {
    return axiosClient.delete(`/category/${id}`);
  },
};

export default categoriesApi;
