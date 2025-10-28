// ✅ [THÊM MỚI] import useEffect
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import useAdminUsers from "../../hooks/useCustomer";

export default function CustomerList() {
  const {
    users,
    loading,
    error,
    verifyUser,
    deleteUser,
    reactivateUser,
    fetchAllUsers,
  } = useAdminUsers();

  // 🧩 Bộ lọc: all / active / deleted
  const [filterStatus, setFilterStatus] = useState("all");

  // 🧩 Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // "verify" | "ban" | "restore"
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ [THÊM MỚI] Tự động tải dữ liệu khi component được gắn (mount)
  // Thêm hook useEffect để gọi fetchAllUsers() khi component được render lần đầu.
  // Mảng rỗng [] đảm bảo nó chỉ chạy một lần (tương đương componentDidMount).
  useEffect(() => {
    fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] đảm bảo effect này chỉ chạy 1 lần khi component mount

  // 🔎 Lọc user theo dropdown
  const filteredUsers = users.filter((u) => {
    if (filterStatus === "active") return u.IS_DELETED === 0;
    if (filterStatus === "deleted") return u.IS_DELETED === 1;
    return true; // "all"
  });

  // ⚙️ Mở modal
  const openModal = (action, user) => {
    setModalAction(action);
    setSelectedUser(user);
    setModalOpen(true);
  };

  // ⚙️ Xác nhận hành động trong modal
  const handleConfirmAction = async () => {
    if (!selectedUser || !modalAction) return;

    switch (modalAction) {
      case "verify":
        await verifyUser(selectedUser.USER_ID);
        break;
      case "ban":
        await deleteUser(selectedUser.USER_ID);
        break;
      case "restore":
        await reactivateUser(selectedUser.USER_ID);
        break;
      default:
        break;
    }

    await fetchAllUsers(); // Sau khi hành động, tải lại danh sách
    setModalOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* 🧭 Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách khách hàng
          </h1>
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="active">Còn hoạt động</option>
              <option value="deleted">Bị cấm</option>
            </select>

            {/* ❌ [XÓA BỎ] Đã xóa nút "Làm mới" */}
          </div>
        </div>

        {/* 🧨 Hiển thị lỗi */}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        {/* 🧾 Bảng danh sách */}
        <Card>
          {/* ✅ [THÊM MỚI] Hiển thị loading khi dữ liệu đang tải lần đầu */}
          {loading && users.length === 0 ? (
            <p className="p-4 text-center text-gray-500">Đang tải dữ liệu...</p>
          ) : (
            <Table
              headers={[
                "ID",
                "Họ tên",
                "Email",
                "Điện thoại",
                "Số đơn hàng",
                "Trạng thái",
                "Thao tác",
              ]}
              data={filteredUsers}
              renderRow={(u) => (
                <>
                  <td className="px-4 py-2">{u.USER_ID}</td>
                  <td className="px-4 py-2">{u.FULLNAME || "—"}</td>
                  <td className="px-4 py-2">{u.EMAIL}</td>
                  <td className="px-4 py-2">{u.PHONE || "—"}</td>
                  <td className="px-4 py-2 text-center">{u.orderCount ?? 0}</td>
                  <td className="px-4 py-2">
                    {u.IS_DELETED ? (
                      <span className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                        Bị cấm
                      </span>
                    ) : u.VERIFIED ? (
                      <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Đã xác minh
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                        Chưa xác minh
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-2 flex gap-2">
                    {u.IS_DELETED ? (
                      <Button
                        className="bg-amber-600"
                        onClick={() => openModal("restore", u)}
                      >
                        Gỡ cấm
                      </Button>
                    ) : (
                      <>
                        <Link to={`/customers/${u.USER_ID}`}>
                          <Button className="bg-blue-600">Chi tiết</Button>
                        </Link>
                        <Link to={`/customers/orders/${u.USER_ID}`}>
                          <Button className="bg-teal-600">Xem đơn hàng</Button>
                        </Link>
                        {!u.VERIFIED && (
                          <Button
                            className="bg-green-600"
                            onClick={() => openModal("verify", u)}
                          >
                            Xác minh
                          </Button>
                        )}
                        <Button
                          className="bg-red-600"
                          onClick={() => openModal("ban", u)}
                        >
                          Cấm
                        </Button>
                      </>
                    )}
                  </td>
                </>
              )}
            />
          )}
        </Card>
      </div>

      {/* 🧱 Modal xác nhận hành động */}
      <Modal
        open={modalOpen}
        title="Xác nhận hành động"
        onClose={() => setModalOpen(false)}
      >
        {selectedUser && (
          <>
            <p className="text-gray-700 mb-4">
              {modalAction === "verify" &&
                `Bạn có chắc muốn xác minh tài khoản "${selectedUser.EMAIL}"?`}
              {modalAction === "ban" &&
                `Bạn có chắc muốn cấm tài khoản "${selectedUser.EMAIL}"?`}
              {modalAction === "restore" &&
                `Bạn có muốn gỡ cấm tài khoản "${selectedUser.EMAIL}"?`}
            </p>

            <div className="flex justify-end gap-3">
              <Button
                className="bg-gray-400"
                onClick={() => setModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className={
                  modalAction === "ban"
                    ? "bg-red-600"
                    : modalAction === "verify"
                    ? "bg-green-600"
                    : "bg-amber-600"
                }
                onClick={handleConfirmAction}
              >
                Xác nhận
              </Button>
            </div>
          </>
        )}
      </Modal>
    </Layout>
  );
}
