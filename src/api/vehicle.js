import axiosClient from "./axiosClient";

const carApi = {
  createCar: (formData) => {
    return axiosClient.post("/car", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAllCars: () => {
    return axiosClient.get("/car");
  },

  getCarById: (id) => {
    // GET /api/car/:id
    return axiosClient.get(`/car/${id}`);
  },

  // 4️⃣ Xóa Car theo ID
  deleteCar: (id) => {
    // DELETE /api/car/:id
    return axiosClient.delete(`/car/${id}`);
  },
};

export default carApi;
