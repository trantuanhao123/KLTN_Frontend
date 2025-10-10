import axiosClient from "./axiosClient";

const carImageApi = {
  // 🔹 Lấy danh sách hình theo carId
  async getImagesByCarId(carId) {
    const res = await axiosClient.get(`/car-image/${carId}`);
    return res.data;
  },

  // 🔹 Upload hình mới (multipart/form-data)
  async addCarImages(carId, files) {
    const formData = new FormData();
    for (const file of files) {
      formData.append("carImages", file);
    }

    const res = await axiosClient.post(`/car-image/${carId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // 🔹 Xóa 1 hình (DB + file vật lý)
  async deleteCarImage(imageId) {
    const res = await axiosClient.delete(`/car-image/${imageId}`);
    return res.data;
  },
};

export default carImageApi;
