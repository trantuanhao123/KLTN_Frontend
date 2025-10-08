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
    const serviceId = serviceData.SERVICE_ID || serviceData.id;
    const payload = {
      name: serviceData.NAME || serviceData.name,
      description: serviceData.DESCRIPTION || serviceData.description,
    };
    if (serviceId) {
      // UPDATE (PUT)
      return axiosClient.put(`/service/${serviceId}`, payload);
    } else {
      // CREATE (POST)
      return axiosClient.post("/service", payload);
    }
  },

  // DELETE (Xóa) - NEW
  deleteService: (id) => {
    return axiosClient.delete(`/service/${id}`);
  },
};

export default servicesApi;
