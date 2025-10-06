import axios from "axios";

const BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor (trình chặn) Request: Thêm Authorization Header
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy thông tin user (bao gồm token) từ localStorage
    const storedUser = localStorage.getItem("admin_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token;

    // Nếu có token, đính kèm vào header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor Response (có thể dùng để xử lý lỗi 401/403 chung)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu server trả về lỗi, chuyển Promise.reject để component gọi handle
    return Promise.reject(error);
  }
);

export default axiosClient;
