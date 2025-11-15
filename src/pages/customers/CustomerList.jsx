import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button, {
  ButtonCreate,
  ButtonRead,
  ButtonEdit,
  ButtonDelete,
} from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import useAdminUsers from "../../hooks/useCustomer";

export default function CustomerList() {
  const {
    users,
    loading,
    error,
    verifyUser,
    unverifyUser,
    deleteUser,
    reactivateUser,
    fetchAllUsers,
  } = useAdminUsers();

  // Bộ lọc: all / active / deleted
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // "verify" | "unverify" | "ban" | "restore" | "unverify"
  const [selectedUser, setSelectedUser] = useState(null);

  // Tự động tải dữ liệu khi component được gắn (mount)
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Lọc user theo dropdown
  const filteredUsers = users.filter((u) => {
    if (filterStatus === "active") return u.IS_DELETED === 0;
    if (filterStatus === "deleted") return u.IS_DELETED === 1;
    return true; // "all"
  });

  // Mở modal
  const openModal = (action, user) => {
    setModalAction(action);
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Xác nhận hành động trong modal
  const handleConfirmAction = async () => {
    if (!selectedUser || !modalAction) return;

    switch (modalAction) {
      case "verify":
        await verifyUser(selectedUser.USER_ID);
        break;
      case "unverify":
        await unverifyUser(selectedUser.USER_ID);
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

  const tableButtonStyles = "text-sm px-3 py-1";

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý khách hàng
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
          </div>
        </div>

        {/* Hiển thị lỗi */}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        {/* Bảng danh sách */}
        <Card>
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

                  {/* Cột Thao tác */}
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {u.IS_DELETED ? (
                        // Dùng ButtonEdit (màu vàng) cho "Gỡ cấm"
                        <ButtonEdit
                          className={tableButtonStyles}
                          onClick={() => openModal("restore", u)}
                        >
                          Gỡ cấm
                        </ButtonEdit>
                      ) : (
                        <>
                          {/* Dùng ButtonRead (màu xanh dương) */}
                          <Link to={`/customers/${u.USER_ID}`}>
                            <ButtonRead className={tableButtonStyles}>
                              Chi tiết
                            </ButtonRead>
                          </Link>

                          {/* Giữ Button (default) và override màu teal */}
                          <Link to={`/customers/orders/${u.USER_ID}`}>
                            <Button
                              className={`bg-teal-600 hover:bg-teal-700 ${tableButtonStyles}`}
                            >
                              Xem đơn hàng
                            </Button>
                          </Link>

                          {/* Nút Xác minh/Hủy xác minh */}
                          {u.VERIFIED ? (
                            // Hiện nút Hủy xác minh (màu vàng - ButtonEdit)
                            <ButtonEdit
                              className={tableButtonStyles}
                              onClick={() => openModal("unverify", u)}
                            >
                              Hủy xác minh
                            </ButtonEdit>
                          ) : (
                            // Hiện nút Xác minh (màu xanh lá - ButtonCreate)
                            <ButtonCreate
                              className={tableButtonStyles}
                              onClick={() => openModal("verify", u)}
                            >
                              Xác minh
                            </ButtonCreate>
                          )}

                          {/* Dùng ButtonDelete (màu đỏ) */}
                          <ButtonDelete
                            className={tableButtonStyles}
                            onClick={() => openModal("ban", u)}
                          >
                            Cấm
                          </ButtonDelete>
                        </>
                      )}
                    </div>
                  </td>
                </>
              )}
            />
          )}
        </Card>
      </div>

      {/* Modal xác nhận hành động */}
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
              {modalAction === "unverify" && // [THÊM MỚI] Modal Hủy xác minh
                `Bạn có chắc muốn HỦY xác minh tài khoản "${selectedUser.EMAIL}"?`}
              {modalAction === "ban" &&
                `Bạn có chắc muốn cấm tài khoản "${selectedUser.EMAIL}"?`}
              {modalAction === "restore" &&
                `Bạn có muốn gỡ cấm tài khoản "${selectedUser.EMAIL}"?`}
            </p>

            <div className="flex justify-end gap-3">
              {/* Nút Hủy (màu xám) */}
              <Button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setModalOpen(false)}
              >
                Hủy
              </Button>

              {/* Các variant button */}
              {modalAction === "ban" && (
                <ButtonDelete onClick={handleConfirmAction}>
                  Xác nhận Cấm
                </ButtonDelete>
              )}
              {modalAction === "verify" && (
                <ButtonCreate onClick={handleConfirmAction}>
                  Xác nhận Xác minh
                </ButtonCreate>
              )}
              {modalAction === "unverify" && ( // [THÊM MỚI] Nút Xác nhận Hủy xác minh
                <ButtonEdit onClick={handleConfirmAction}>
                  Xác nhận Hủy xác minh
                </ButtonEdit>
              )}
              {modalAction === "restore" && (
                <ButtonEdit onClick={handleConfirmAction}>
                  Xác nhận Gỡ cấm
                </ButtonEdit>
              )}
            </div>
          </>
        )}
      </Modal>
    </Layout>
  );
}
