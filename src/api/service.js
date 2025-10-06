import axiosClient from "./axiosClient";

const servicesApi = {
  // READ (Lấy danh sách)
  getServices: () => {
    return axiosClient.get("/service");
  },

  // READ (Lấy chi tiết theo ID) - NEW
  getServiceById: (id) => {
    return axiosClient.get(`/service/${id}`);
  },

  createUpdateService: (serviceData) => {
    if (serviceData.id) {
      // UPDATE (PUT)
      const { id, ...data } = serviceData;
      return axiosClient.put(`/service/${id}`, data);
    } else {
      // CREATE (POST)
      return axiosClient.post("/service", serviceData);
    }
  },

  // DELETE (Xóa) - NEW
  deleteService: (id) => {
    return axiosClient.delete(`/service/${id}`);
  },
};

export default servicesApi;
