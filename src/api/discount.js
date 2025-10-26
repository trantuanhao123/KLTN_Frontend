// src/api/discount.js
// (Giả sử file này tên là discountApi.js hoặc discount.js)

import axiosClient from "./axiosClient";

// Base path cho tất cả các route discount
const BASE_PATH = "/discount";

/**
 * discountApi
 * * Object chứa tất cả các hàm gọi API liên quan đến Discount,
 * theo cấu trúc giống carApi.
 * * Các hàm này đều là async và đã tự xử lý lấy `data.data`
 * để tương thích với hook useDiscount.
 */
const discountApi = {
  /**
   * [GET /discount]
   * Lấy toàn bộ danh sách mã giảm giá
   */
  getAllDiscounts: async () => {
    // axiosClient.get trả về { data: { status: "success", data: [...] } }
    const { data } = await axiosClient.get(BASE_PATH);
    return data; // Trả về mảng [...]
  },

  /**
   * [GET /discount/:id]
   * Lấy chi tiết 1 mã giảm giá
   * (Hàm này bị thiếu trong file cũ của bạn, nhưng hook cần)
   */
  getDiscountById: async (id) => {
    const { data } = await axiosClient.get(`${BASE_PATH}/${id}`);
    return data; // Trả về object {...}
  },

  /**
   * [POST /discount]
   * Tạo một mã giảm giá mới
   */
  createDiscount: async (discountData) => {
    const { data } = await axiosClient.post(BASE_PATH, discountData);
    return data.data; // Trả về object mới {...}
  },

  /**
   * [PUT /discount/:id]
   * Cập nhật một mã giảm giá
   * (Sửa lại signature để nhận (id, data) cho đúng)
   */
  updateDiscount: async (id, discountData) => {
    const { data } = await axiosClient.put(`${BASE_PATH}/${id}`, discountData);
    return data.data; // Trả về object đã cập nhật {...}
  },

  /**
   * [DELETE /discount/:id]
   * Xóa một mã giảm giá
   */
  deleteDiscount: async (id) => {
    // Giữ nguyên logic cũ là return id
    await axiosClient.delete(`${BASE_PATH}/${id}`);
    return id;
  },

  /**
   * [POST /discount/check]
   * Kiểm tra tính hợp lệ của mã cho người dùng
   * (Hàm này có trong route, bổ sung vào file API)
   */
  checkDiscountCode: async (codeString) => {
    const { data } = await axiosClient.post(`${BASE_PATH}/check`, {
      code: codeString,
    });
    return data.data; // Trả về object mã giảm giá hợp lệ {...}
  },
};

export default discountApi;
