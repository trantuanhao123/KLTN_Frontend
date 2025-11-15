import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button, { ButtonEdit, ButtonCreate } from "../../components/ui/Button"; // [THÊM] ButtonEdit, ButtonCreate
import useAdminUsers from "../../hooks/useCustomer";
import Layout from "../../components/layouts/Layout";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUserById, verifyUser, unverifyUser, loading } = useAdminUsers(); // [SỬA ĐỔI] Thêm unverifyUser
  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Lấy chi tiết user khi mở trang
  useEffect(() => {
    async function loadUser() {
      const data = await fetchUserById(id);
      if (data) setUser(data);
    }
    loadUser();
  }, [id, fetchUserById]);

  // Hàm xác minh người dùng (KYC/Bằng lái)
  const handleVerify = async () => {
    if (!user) return;
    setVerifying(true);
    try {
      await verifyUser(user.USER_ID);
      const updated = await fetchUserById(user.USER_ID);
      setUser(updated);
      alert("Người dùng đã được xác minh thành công!");
    } catch (err) {
      alert("Lỗi xác minh người dùng!");
    } finally {
      setVerifying(false);
    }
  };

  // [THÊM MỚI] Hàm hủy xác minh người dùng
  const handleUnverify = async () => {
    if (!user) return;
    setVerifying(true);
    try {
      await unverifyUser(user.USER_ID);
      const updated = await fetchUserById(user.USER_ID);
      setUser(updated);
      alert("Đã hủy xác minh người dùng thành công!");
    } catch (err) {
      alert("Lỗi hủy xác minh người dùng!");
    } finally {
      setVerifying(false);
    }
  };

  // Tạo hàm xử lý đóng
  const handleClose = () => {
    navigate("/customers");
  };

  if (loading && !user)
    return <p className="text-center text-gray-500">Đang tải thông tin...</p>;

  if (!user)
    return (
      <p className="text-center text-gray-500">Không tìm thấy người dùng.</p>
    );

  const {
    USER_ID,
    EMAIL,
    PHONE,
    FULLNAME,
    BIRTHDATE,
    AVATAR_URL,
    ADDRESS,
    ID_CARD,
    LICENSE_FRONT_URL,
    LICENSE_BACK_URL,
    RATING,
    VERIFIED,
    PROVIDER,
    PROVIDER_ID,
    CREATED_AT,
    UPDATED_AT,
    IS_EMAIL_VERIFIED,
  } = user;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Avatar + tên */}
        <div className="flex items-center gap-4">
          <img
            src={
              AVATAR_URL || "http://localhost:8080/images/default-avatar.png"
            }
            alt="avatar"
            className="w-20 h-20 rounded-full border object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {FULLNAME || "—"}
            </h3>
            <p className="text-sm text-gray-500">Mã người dùng: {USER_ID}</p>
            <p className="text-sm text-gray-500">
              <strong className="text-gray-600">Hồ sơ (KYC):</strong>
              {VERIFIED ? (
                <span className="ml-1 text-green-600 font-semibold">
                  Đã xác minh
                </span>
              ) : (
                <span className="ml-1 text-yellow-600 font-semibold">
                  Chưa xác minh
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500">
              <strong className="text-gray-600">Email:</strong>
              {IS_EMAIL_VERIFIED ? (
                <span className="ml-1 text-green-600 font-semibold">
                  Đã xác minh
                </span>
              ) : (
                <span className="ml-1 text-yellow-600 font-semibold">
                  Chưa xác minh
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <section className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <p>
            <strong>Email:</strong> {EMAIL || "—"}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {PHONE || "—"}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {BIRTHDATE || "—"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {ADDRESS || "—"}
          </p>
          <p>
            <strong>CMND/CCCD:</strong> {ID_CARD || "—"}
          </p>
          <p>
            <strong>Nhà cung cấp:</strong> {PROVIDER || "local"}
          </p>
          {PROVIDER !== "local" && (
            <p>
              <strong>Provider ID:</strong> {PROVIDER_ID || "—"}
            </p>
          )}
          <p>
            <strong>Điểm đánh giá:</strong>{" "}
            {Number(RATING) ? Number(RATING).toFixed(2) : "0.00"}
          </p>
          <p>
            <strong>Tạo lúc:</strong>{" "}
            {new Date(CREATED_AT).toLocaleString("vi-VN")}
          </p>
          <p>
            <strong>Cập nhật:</strong>{" "}
            {new Date(UPDATED_AT).toLocaleString("vi-VN")}
          </p>
        </section>

        {/* Bằng lái xe */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Ảnh bằng lái xe
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-2 bg-gray-50">
              <p className="text-xs text-gray-600 mb-1 font-medium">
                Mặt trước
              </p>
              {LICENSE_FRONT_URL ? (
                <img
                  src={LICENSE_FRONT_URL}
                  alt="Mặt trước bằng lái"
                  className="w-full rounded-md border object-cover max-h-56"
                />
              ) : (
                <p className="text-gray-400 text-center py-8 text-sm">
                  Chưa có hình mặt trước
                </p>
              )}
            </div>

            <div className="border rounded-lg p-2 bg-gray-50">
              <p className="text-xs text-gray-600 mb-1 font-medium">Mặt sau</p>
              {LICENSE_BACK_URL ? (
                <img
                  src={LICENSE_BACK_URL}
                  alt="Mặt sau bằng lái"
                  className="w-full rounded-md border object-cover max-h-56"
                />
              ) : (
                <p className="text-gray-400 text-center py-8 text-sm">
                  Chưa có hình mặt sau
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Hành động */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          {VERIFIED ? (
            // [THÊM MỚI] Nút Hủy xác minh (Màu vàng - ButtonEdit)
            <ButtonEdit onClick={handleUnverify} disabled={verifying}>
              {verifying ? "Đang hủy xác minh..." : "Hủy xác minh người dùng"}
            </ButtonEdit>
          ) : (
            // Nút Xác minh (Màu xanh lá - ButtonCreate)
            <ButtonCreate onClick={handleVerify} disabled={verifying}>
              {verifying ? "Đang xác minh..." : "Xác minh người dùng (KYC)"}
            </ButtonCreate>
          )}

          <Button className="bg-gray-400" onClick={handleClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Layout>
  );
}
