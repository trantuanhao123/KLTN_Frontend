// src/pages/bookings/BookingComplete.js

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAdminCompleteOrder } from "../../hooks/useOrder";

// Import UI của bạn
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// --- THÀNH PHẦN UI TẠM THỜI ---
const Input = (props) => (
  <input
    {...props}
    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
  />
);
const Textarea = (props) => (
  <textarea
    {...props}
    rows={3}
    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
  />
);
const Select = (props) => (
  <select
    {...props}
    className="block w-full min-w-[200px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
  >
    {props.children}
  </select>
);
// ------------------------------

export default function BookingComplete() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Hook xử lý mutation
  const [completeOrder, { loading: updateLoading, error: updateError }] =
    useAdminCompleteOrder();

  // 2. State cho form
  const [returnCase, setReturnCase] = useState("NORMAL"); // Giá trị dropdown
  const [extraFee, setExtraFee] = useState(0);
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        extraFee: 0,
        note: "",
        carStatus: "AVAILABLE",
      };

      switch (returnCase) {
        case "NORMAL":
          payload.note = "Trả xe bình thường, không phát sinh.";
          break;
        case "FEE_ONLY":
          payload.extraFee = extraFee;
          payload.note = note || "Phát sinh phí khi trả xe.";
          break;
        case "MAINTENANCE_ONLY":
          payload.carStatus = "MAINTENANCE";
          payload.note = note || "Xe cần bảo trì sau khi trả.";
          break;
        case "FEE_AND_MAINTENANCE":
          payload.extraFee = extraFee;
          payload.carStatus = "MAINTENANCE";
          payload.note = note || "Phát sinh phí VÀ xe cần bảo trì.";
          break;
        default:
          throw new Error("Trường hợp trả xe không hợp lệ.");
      }

      await completeOrder(id, payload);
      alert("Xác nhận trả xe thành công!");
      navigate("/bookings");
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Quyết định input nào được hiển thị
  const showFeeInput =
    returnCase === "FEE_ONLY" || returnCase === "FEE_AND_MAINTENANCE";
  const showNoteInput = returnCase !== "NORMAL";
  const showMaintenanceWarning =
    returnCase === "MAINTENANCE_ONLY" || returnCase === "FEE_AND_MAINTENANCE";

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Xác nhận Trả Xe</h1>
        <Link to="/bookings">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white">
            ← Quay lại
          </Button>
        </Link>
      </div>

      {/* Sử dụng Card của bạn */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown chọn kịch bản */}
          <div>
            <label
              htmlFor="returnCase"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chọn kịch bản trả xe:
            </label>
            <Select
              id="returnCase"
              value={returnCase}
              onChange={(e) => setReturnCase(e.target.value)}
            >
              <option value="NORMAL">
                1. Trả xe bình thường (Không phát sinh)
              </option>
              <option value="FEE_ONLY">2. Có phát sinh phí (Xe vẫn ổn)</option>
              <option value="MAINTENANCE_ONLY">
                3. Xe cần bảo trì (Không phí)
              </option>
              <option value="FEE_AND_MAINTENANCE">
                4. Có phí và cần bảo trì
              </option>
            </Select>
          </div>

          <hr />

          {/* Input Phí phát sinh (Ẩn/Hiện) */}
          {showFeeInput && (
            <div>
              <label
                htmlFor="extraFee"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phí phát sinh (VNĐ):
              </label>
              <Input
                type="number"
                id="extraFee"
                value={extraFee}
                onChange={(e) => setExtraFee(e.target.value)}
                placeholder="Nhập số tiền thu thêm..."
              />
            </div>
          )}

          {/* Input Ghi chú (Ẩn/Hiện) */}
          {showNoteInput && (
            <div>
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ghi chú (Lý do bảo trì/phát sinh phí):
              </label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Khách làm xước cửa, xe báo lỗi động cơ..."
              />
            </div>
          )}

          {/* Thông báo về trạng thái xe */}
          {showMaintenanceWarning ? (
            <p className="text-yellow-700 font-semibold">
              Lưu ý: Trạng thái xe sẽ được cập nhật thành "MAINTENANCE" (Bảo
              trì).
            </p>
          ) : (
            <p className="text-gray-600">
              Trạng thái xe sẽ được cập nhật thành "AVAILABLE" (Sẵn sàng).
            </p>
          )}

          {/* Nút bấm */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-indigo-600 text-white" // Ghi đè màu
              disabled={updateLoading}
            >
              {updateLoading ? "Đang xử lý..." : "Hoàn tất Đơn hàng"}
            </Button>
          </div>

          {updateError && (
            <p className="text-red-500 mt-4">
              Lỗi khi cập nhật:{" "}
              {updateError.response?.data?.error || updateError.message}
            </p>
          )}
        </form>
      </Card>
    </Layout>
  );
}
