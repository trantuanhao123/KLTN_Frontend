import axiosClient from "./axiosClient";

const authApi = {
  /**
   * Gọi API đăng nhập cho Admin.
   * Endpoint: POST /user/loginAdmin
   * @param {object} credentials - { email, password }
   * @returns {Promise<AxiosResponse>} Trả về response từ axios.
   */
  loginAdmin: (credentials) => {
    const url = "/user/loginAdmin";
    return axiosClient.post(url, credentials);
  },

  // Có thể thêm các API khác như logout, forgotPassword... tại đây
};

export default authApi;
