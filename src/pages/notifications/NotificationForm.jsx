// src/pages/notifications/NotificationForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import useAdminUsers from "../../hooks/useCustomer";
import notificationApi from "../../api/notification";
import Layout from "../../components/layouts/Layout";
export default function NotificationForm({ onClose, onCreated }) {
  const navigate = useNavigate();
  const { users, fetchAllUsers, loading: loadingUsers } = useAdminUsers();

  // mode: "user" (gửi 1 người) | "all" (gửi tất cả)
  const [mode, setMode] = useState("user");
  const [form, setForm] = useState({
    userId: "",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const reset = () => {
    setForm({ userId: "", title: "", content: "" });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!form.title?.trim() || !form.content?.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }
    if (mode === "user" && !form.userId) {
      setError("Vui lòng chọn người dùng nhận thông báo.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "user") {
        // payload: { userId, title, content }
        await notificationApi.createForUser({
          userId: Number(form.userId),
          title: form.title.trim(),
          content: form.content.trim(),
        });
      } else {
        // all users: { title, content }
        await notificationApi.createForAll({
          title: form.title.trim(),
          content: form.content.trim(),
        });
      }

      setSuccess("Gửi thông báo thành công.");
      reset();

      // thông báo cho các component khác (sidebar) refresh lại
      window.dispatchEvent(new Event("notificationsUpdated"));

      // callback nếu có (NotificationList chuyển route hoặc đóng modal)
      if (onCreated) onCreated();
      // nếu trang standalone /notifications/new -> navigate về list (option)
      if (!onCreated && onClose) onClose();
      if (!onCreated && !onClose) navigate("/notifications");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Gửi thông báo thất bại";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-start justify-center p-6">
        <Card className="w-full max-w-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tạo thông báo</h2>

            {/* mode switch */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("user")}
                className={`px-3 py-1 rounded-md text-sm ${
                  mode === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Gửi cho 1 người
              </button>
              <button
                type="button"
                onClick={() => setMode("all")}
                className={`px-3 py-1 rounded-md text-sm ${
                  mode === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Gửi cho tất cả
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* chọn user chỉ hiển thị khi mode === 'user' */}
            {mode === "user" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Người nhận
                </label>
                {loadingUsers ? (
                  <div className="text-sm text-gray-500">
                    Đang tải danh sách người dùng...
                  </div>
                ) : (
                  <select
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">-- Chọn người dùng --</option>
                    {users.map((u) => (
                      <option key={u.USER_ID} value={u.USER_ID}>
                        {u.USER_ID} - {u.FULL_NAME || u.EMAIL || "Không rõ tên"}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder={
                  mode === "user"
                    ? "VD: Tài khoản của bạn đã được xác minh"
                    : "VD: Thông báo bảo trì hệ thống"
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nội dung</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={5}
                className="w-full border rounded-md p-2"
                placeholder={
                  mode === "user"
                    ? "Chúc mừng! Hồ sơ và giấy phép lái xe của bạn đã được quản trị viên phê duyệt."
                    : "Hệ thống sẽ tạm dừng để bảo trì vào lúc 2 giờ sáng ngày mai (27/10)."
                }
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="flex justify-end gap-2">
              {/* nếu được mở như modal, bạn có thể pass onClose prop */}
              {onClose ? (
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800"
                >
                  Hủy
                </Button>
              ) : null}

              <Button
                type="submit"
                className="bg-blue-600 text-white"
                disabled={loading}
              >
                {loading
                  ? "Đang gửi..."
                  : mode === "user"
                  ? "Gửi cho người này"
                  : "Gửi cho tất cả"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
