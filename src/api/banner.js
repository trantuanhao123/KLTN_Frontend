import axiosClient from "./axiosClient";

const bannerApi = {
  async getAll() {
    const res = await axiosClient.get("/banner");
    return res.data;
  },

  async getBannerById(id) {
    const res = await axiosClient.get(`/banner/${id}`);
    return res.data;
  },

  async createBanner(formData) {
    const res = await axiosClient.post("/banner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async updateBanner(id, formData) {
    const res = await axiosClient.patch(`/banner/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async deleteBanner(id) {
    const res = await axiosClient.delete(`/banner/${id}`);
    return res.data;
  },

  async toggleStatus(id) {
    const res = await axiosClient.patch(`/banner/updateStatus/${id}`);
    return res.data;
  },
};

export default bannerApi;
