import axiosClient from "./axiosClient";

const BASE_PATH = "/incident";

const incidentApi = {
  getIncidents: async () => {
    // Giả sử response.data là mảng [...]
    const { data } = await axiosClient.get(BASE_PATH);
    return data;
  },

  getIncidentById: async (id) => {
    // Giả sử response.data là object {...}
    const { data } = await axiosClient.get(`${BASE_PATH}/${id}`);
    return data;
  },

  updateIncidentStatus: async (id, status) => {
    const { data } = await axiosClient.patch(`${BASE_PATH}/status/${id}`, {
      status,
    });
    return data;
  },
  deleteIncident: async (id) => {
    await axiosClient.delete(`${BASE_PATH}/${id}`);
    return id;
  },
};

export default incidentApi;
