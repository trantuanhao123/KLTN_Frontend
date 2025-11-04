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
  updateCar: (id, formData) => {
    // PUT /api/car/:id
    return axiosClient.put(`/car/${id}`, formData);
  },
  getAvailableCars: () => {
    return axiosClient.get("/car/available");
  },
};

export default carApi;
