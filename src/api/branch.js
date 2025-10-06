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
    if (branchData.id) {
      // UPDATE (PUT)
      const { id, ...data } = branchData;
      return axiosClient.put(`/branch/${id}`, data);
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
