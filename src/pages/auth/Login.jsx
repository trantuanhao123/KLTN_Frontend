import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import Button from "../../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // login() trả về { ok, message, user } thay vì throw error
    const result = await login({ email, password });

    console.log("Login result:", result); // Debug log

    if (result.ok) {
      // Đăng nhập thành công
      navigate("/dashboard");
    } else {
      // Đăng nhập thất bại - hiển thị message từ backend
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryLight">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-primary mb-2">Đăng nhập</h1>
        <p className="text-sm text-gray-500 mb-6">
          Đăng nhập để vào trang quản trị
        </p>

        {/* CHỈ 1 chỗ hiển thị error */}
        {error && (
          <div className="bg-red-100 text-red-600 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="text-primary underline">
                Quên mật khẩu?
              </Link>
            </div>
            <Button type="submit">Đăng nhập</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
