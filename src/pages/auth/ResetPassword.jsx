import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function ResetPassword() {
  const { resetPassword, loading } = useAuth(); // bạn có thể thêm hàm mới gọi verifyOtp
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Kiểm tra dữ liệu cơ bản
    if (!email || !otp || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    try {
      // Gọi API verifyOtp + reset password
      const res = await resetPassword({ email, otp, newPassword });
      console.log("Reset password response:", res);

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError(
        err.response?.data?.message ||
          "Đặt lại mật khẩu thất bại. OTP có thể đã hết hạn hoặc email không tồn tại."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryLight">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-primary mb-4">
          Đặt lại mật khẩu
        </h1>

        {success ? (
          <div className="space-y-2">
            <div className="text-sm text-green-600 font-semibold">
              Mật khẩu đã được thay đổi thành công! Bạn sẽ được chuyển hướng đến
              trang đăng nhập...
            </div>
            <Link
              to="/login"
              className="text-sm text-gray-500 underline inline-block mt-2"
            >
              Quay lại đăng nhập ngay
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && <div className="text-sm text-red-600">{error}</div>}

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập email đã đăng ký"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Mã OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập mã OTP nhận được trong email"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập lại mật khẩu"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link to="/login" className="text-sm text-gray-500 underline">
                Quay lại đăng nhập
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
