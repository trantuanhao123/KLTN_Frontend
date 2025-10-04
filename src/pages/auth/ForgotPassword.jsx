// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPassword() {
  const { sendOtpForReset } = useAuth(); // gọi service gửi OTP
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await sendOtpForReset(email); // chỉ gửi email
      if (result.ok) {
        setSent(true);
        setTimeout(() => navigate("/reset-password"), 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryLight">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-primary mb-2">Quên mật khẩu</h1>

        {sent ? (
          <div className="space-y-3">
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p className="font-bold">Thành công!</p>
              <p className="text-sm">
                Mã OTP đã được gửi tới email của bạn. Bạn sẽ được chuyển hướng
                đến trang đặt lại mật khẩu sau giây lát.
              </p>
            </div>
            <Link
              to="/login"
              className="text-sm text-gray-500 underline inline-block mt-2"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && <div className="text-sm text-red-600">{error}</div>}

            <p className="text-sm text-gray-600">
              Vui lòng nhập email đã đăng ký:
            </p>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link to="/login" className="text-sm text-gray-500 underline">
                Quay lại đăng nhập
              </Link>
              <Button type="submit">Gửi mã OTP</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
