// src/pages/bookings/BookingComplete.js

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAdminCompleteOrder } from "../../hooks/useOrder";

// Import UI của bạn
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

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

  const [completeOrder, { loading: updateLoading, error: updateError }] =
    useAdminCompleteOrder();

  const [returnCase, setReturnCase] = useState("NORMAL");
  const [extraFee, setExtraFee] = useState(0);
  const [note, setNote] = useState(""); // State cho Rating và Rating tạm thời khi hover
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0); // Dùng để hiển thị sao khi rê chuột

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá cho khách hàng.");
      return;
    }
    try {
      let payload = {
        extraFee: 0,
        note: "",
        carStatus: "AVAILABLE",
        rating: rating,
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

      payload.extraFee = parseFloat(payload.extraFee);

      await completeOrder(id, payload);
      alert("Xác nhận trả xe thành công!");
      navigate("/bookings");
    } catch (err) {
      console.error(err);
    }
  };

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
            Quay lại
          </Button>
        </Link>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đánh giá Khách hàng (1-5 sao):
            </label>
            <div
              className="flex space-x-1 cursor-pointer"
              onMouseLeave={() => setHoverRating(0)} // Reset hover khi rời khỏi vùng sao
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-8 h-8 transition-colors duration-200 
                              ${
                                (hoverRating || rating) >= star
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">Đã chọn: {rating} sao</p>
          </div>
          <hr />
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
          </div>{" "}
          <hr />
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
          {/* Thông báo về trạng thái xe (Giữ nguyên) */}
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
          {/* Nút bấm (Giữ nguyên) */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-indigo-600 text-white"
              disabled={updateLoading}
            >
              {updateLoading ? "Đang xử lý..." : "Hoàn tất Đơn hàng"}
            </Button>
          </div>
          {updateError && (
            <p className="text-red-500 mt-4">
              Lỗi khi cập nhật:
              {updateError.response?.data?.error || updateError.message}
            </p>
          )}
        </form>
      </Card>
    </Layout>
  );
}
