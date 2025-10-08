import axiosClient from "./axiosClient"; // Import client đã cấu hình

const branchesApi = {
  // READ: Lấy danh sách tất cả chi nhánh (GET /branch)
  getAllBranches: () => {
    return axiosClient.get("/branch");
  },

  // READ: Lấy chi tiết chi nhánh theo ID (GET /branch/:id)
  getBranchById: (id) => {
    return axiosClient.get(`/branch/${id}`);
  },
  createUpdateBranch: (branchData) => {
    // Kiểm tra nếu có branchData.id hoặc branchData.BRANCH_ID => UPDATE
    const branchId = branchData.id || branchData.BRANCH_ID;

    if (branchId) {
      // UPDATE (PUT)
      const { id, BRANCH_ID, ...data } = branchData; // loại bỏ key id/BRANCH_ID khỏi body
      return axiosClient.put(`/branch/${branchId}`, data);
    } else {
      // CREATE (POST)
      return axiosClient.post("/branch", branchData);
    }
  },

  deleteBranch: (id) => {
    return axiosClient.delete(`/branch/${id}`);
  },
};

export default branchesApi;
