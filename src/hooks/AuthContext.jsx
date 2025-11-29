import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.js"; // API helper

function parseJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Lỗi giải mã JWT:", e);
    return null;
  }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("admin_user")) || null;
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) sessionStorage.setItem("admin_user", JSON.stringify(user));
    else sessionStorage.removeItem("admin_user");
  }, [user]);

  const login = async ({ email, password }) => {
    setLoading(true);
    let success = false;
    let message = "Đã xảy ra lỗi không xác định.";
    let loggedInUser = null;

    try {
      const apiResponse = await authApi.loginAdmin({ email, password });
      const dataToProcess = apiResponse.data || apiResponse;

      if (dataToProcess && dataToProcess.user && dataToProcess.token) {
        const token = dataToProcess.token;
        const payload = parseJwtPayload(token);
        const expiresAt =
          payload && payload.exp ? payload.exp * 1000 - 60000 : null;

        loggedInUser = {
          ...dataToProcess.user,
          token: token,
          expiresAt: expiresAt,
        };

        setUser(loggedInUser);
        success = true;
        message = "Đăng nhập thành công!";
      } else {
        message =
          dataToProcess.message ||
          dataToProcess.msg ||
          "Phản hồi server thiếu thông tin User/Token.";
      }
    } catch (e) {
      console.error("Login API Call Failed:", e);
      if (e.response?.data) {
        message = e.response.data.error || e.response.data.message || message;
      } else if (e.request) {
        message = "Không thể kết nối server. Vui lòng thử lại.";
      }
    } finally {
      setLoading(false);
    }

    return { ok: success, message, user: loggedInUser };
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  // ... (Các hàm sendOtpForReset và resetPassword giữ nguyên)
  const sendOtpForReset = async (email) => {
    setLoading(true);
    try {
      const res = await authApi.sendOtpForReset({ email });
      if (res.data?.success || res.success) {
        return { ok: true, message: res.data?.message || "OTP đã gửi." };
      } else {
        return {
          ok: false,
          message: res.data?.message || "Email không tồn tại.",
        };
      }
    } catch (err) {
      console.error("Send OTP Failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async ({ email, otp, newPassword }) => {
    setLoading(true);
    try {
      const res = await authApi.resetPassword({ email, otp, newPassword });
      return {
        ok: true,
        message: res.data?.message || "Đặt lại mật khẩu thành công.",
      };
    } catch (err) {
      console.error("Reset Password Failed:", err);
      const message =
        err.response?.data?.message ||
        "Đặt lại mật khẩu thất bại. OTP hoặc email có thể không hợp lệ.";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        sendOtpForReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
