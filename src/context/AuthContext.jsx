import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// SỬA LỖI: Đảm bảo đường dẫn import rõ ràng để tránh lỗi resolution
import authApi from "../api/auth.js";

const AuthContext = createContext();

// Hướng dẫn sử dụng: Trong các component con, sử dụng const { user, login, logout, loading } = useAuth();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      // Lấy user từ localStorage khi khởi tạo
      // Lưu ý: Trong ứng dụng thực tế, bạn nên lưu token, không lưu toàn bộ user object
      return JSON.parse(localStorage.getItem("admin_user")) || null;
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return null;
    }
  });
  // State để quản lý trạng thái loading khi gọi API
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Đồng bộ user state với localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("admin_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("admin_user");
    }
    // LƯU Ý: Nếu user có, nhưng trang hiện tại là /login, bạn có thể thêm logic navigate ở đây.
    // Ví dụ: if (user && window.location.pathname === '/login') navigate('/dashboard');
  }, [user]);

  const login = async ({ email, password }) => {
    setLoading(true);
    let success = false;
    let message = "Đã xảy ra lỗi không xác định.";
    let loggedInUser = null; // Biến lưu trữ thông tin user sau khi đăng nhập

    try {
      const payload = { email, password };
      const apiResponse = await authApi.loginAdmin(payload);

      // Ghi log phản hồi API để kiểm tra cấu trúc
      console.log("Server Response Data:", apiResponse);

      // Kiểm tra linh hoạt dữ liệu từ response.data hoặc response trực tiếp
      const dataToProcess = apiResponse.data || apiResponse;

      // Kiểm tra an toàn trước khi destructure
      if (dataToProcess && dataToProcess.user && dataToProcess.token) {
        const { user: apiUser, token } = dataToProcess;

        loggedInUser = { ...apiUser, token }; // Lưu user vào biến tạm
        setUser(loggedInUser); // Cập nhật state Context

        success = true;
        message = "Đăng nhập thành công!";

        // ***** QUAN TRỌNG: Xóa lệnh navigate ở đây *****
        // navigate('/dashboard');
        // Lệnh điều hướng phải được thực hiện trong component Login.jsx sau khi nhận được kết quả ok: true
      } else {
        // Trường hợp API trả về thành công (200) nhưng cấu trúc dữ liệu thiếu (user/token)
        message =
          dataToProcess.message ||
          dataToProcess.msg ||
          "Lỗi cấu trúc dữ liệu phản hồi từ server. Thiếu thông tin User/Token.";
      }
    } catch (e) {
      console.error("Login API Call Failed:", e);
      console.log("Error response:", e.response); // Debug log
      console.log("Error response data:", e.response?.data); // Debug log

      // Ưu tiên lấy error/message từ backend trước
      if (e.response?.data) {
        // Backend trả về error object
        message =
          e.response.data.error ||
          e.response.data.message ||
          "Đăng nhập thất bại.";
      } else if (e.request) {
        // Request được gửi nhưng không nhận được response
        message = "Không thể kết nối đến server. Vui lòng thử lại.";
      } else {
        // Lỗi khác
        message = "Đã xảy ra lỗi. Vui lòng thử lại.";
      }
    } finally {
      setLoading(false);
    }

    // Trả về thông tin đăng nhập, bao gồm user nếu thành công
    return {
      ok: success,
      message,
      user: loggedInUser,
    };
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook tiện ích để sử dụng Context
export function useAuth() {
  return useContext(AuthContext);
}
