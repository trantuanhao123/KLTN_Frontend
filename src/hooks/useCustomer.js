import { useState, useCallback, useEffect } from "react";
import adminUserApi from "../api/customer";

export default function useAdminUsers() {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("admin_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🟡 Lấy danh sách user
  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminUserApi.getAll();
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Không tải được danh sách user");
    } finally {
      setLoading(false);
    }
  }, []);
  // 🟣 Lấy chi tiết user theo ID
  const fetchUserById = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await adminUserApi.getById(id);
      return res.data; // ⚠️ chỉ return, không setUsers
    } catch (err) {
      setError(err.response?.data?.error || "Không tải được thông tin user");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // 🟣 Cập nhật thông tin user
  const updateUser = useCallback(
    async (id, data) => {
      const res = await adminUserApi.update(id, data);
      await fetchAllUsers();
      return res.data;
    },
    [fetchAllUsers]
  );

  // 🔴 Xóa user
  const deleteUser = useCallback(async (id) => {
    await adminUserApi.delete(id);
    setUsers((prev) => prev.filter((u) => u.USER_ID !== id));
  }, []);

  // ✅ Xác minh user
  const verifyUser = useCallback(
    async (id) => {
      await adminUserApi.verify(id);
      await fetchAllUsers();
    },
    [fetchAllUsers]
  );

  const reactivateUser = useCallback(
    async (id) => {
      await adminUserApi.reactivate(id);
      await fetchAllUsers();
    },
    [fetchAllUsers]
  );
  useEffect(() => {
    if (admin?.token) fetchAllUsers();
  }, [admin, fetchAllUsers]);

  return {
    admin,
    users,
    loading,
    error,
    fetchAllUsers,
    fetchUserById,
    updateUser,
    deleteUser,
    verifyUser,
    reactivateUser,
  };
}
