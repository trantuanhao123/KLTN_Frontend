// src/services/incidentApi.js
import axiosClient from "./axiosClient";

const BASE_PATH = "/incident";

/**
 * incidentApi
 * Object chứa tất cả các hàm gọi API liên quan đến Incidents,
 * theo style của discountApi.
 * * Các hàm này là async và trả về dữ liệu cuối cùng (data),
 * không phải là toàn bộ response của axios.
 */
const incidentApi = {
  /**
   * [GET /incidents]
   * (Admin) Lấy danh sách tất cả sự cố
   */
  getIncidents: async () => {
    // Giả sử response.data là mảng [...]
    const { data } = await axiosClient.get(BASE_PATH);
    return data;
  },

  /**
   * [GET /incidents/:id]
   * (Admin) Lấy chi tiết 1 sự cố
   */
  getIncidentById: async (id) => {
    // Giả sử response.data là object {...}
    const { data } = await axiosClient.get(`${BASE_PATH}/${id}`);
    return data;
  },

  /**
   * [PATCH /incidents/:id/status]
   * (Admin) Cập nhật trạng thái sự cố
   */
  updateIncidentStatus: async (id, status) => {
    // Body là { status: "NEW_STATUS" }
    // Giả sử response.data là object đã cập nhật {...}
    const { data } = await axiosClient.patch(`${BASE_PATH}/status/${id}`, {
      status,
    });
    return data;
  },

  /**
   * [DELETE /incidents/:id]
   * (Admin/User) Xóa một sự cố
   */
  deleteIncident: async (id) => {
    // Theo style của discountApi, chúng ta trả về id
    await axiosClient.delete(`${BASE_PATH}/${id}`);
    return id;
  },
};

export default incidentApi;
