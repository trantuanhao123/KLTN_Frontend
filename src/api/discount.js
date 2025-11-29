import axiosClient from "./axiosClient";

// Base path cho tất cả các route discount
const BASE_PATH = "/discount";

const discountApi = {
  getAllDiscounts: async () => {
    const { data } = await axiosClient.get(BASE_PATH);
    return data; // Trả về mảng [...]
  },

  getDiscountById: async (id) => {
    const { data } = await axiosClient.get(`${BASE_PATH}/${id}`);
    return data;
  },

  createDiscount: async (discountData) => {
    const { data } = await axiosClient.post(BASE_PATH, discountData);
    return data.data; // Trả về object mới {...}
  },

  updateDiscount: async (id, discountData) => {
    const { data } = await axiosClient.put(`${BASE_PATH}/${id}`, discountData);
    return data.data;
  },
  deleteDiscount: async (id) => {
    // Giữ nguyên logic cũ là return id
    await axiosClient.delete(`${BASE_PATH}/${id}`);
    return id;
  },
  checkDiscountCode: async (codeString) => {
    const { data } = await axiosClient.post(`${BASE_PATH}/check`, {
      code: codeString,
    });
    return data.data;
  },
};

export default discountApi;
