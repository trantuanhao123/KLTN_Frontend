import React, { useEffect, useCallback, useMemo } from "react"; // 1. Import thêm useMemo
import { useParams, Link } from "react-router-dom";
import { useAdminGetOrderById } from "../../hooks/useOrder";
import useBranches from "../../hooks/useBranch";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// ... (Giữ nguyên các helper StarIcon, renderRatingStars) ...
const StarIcon = ({ filled = false, className = "w-5 h-5" }) => (
  <svg
    className={`${className} transition-colors duration-200 ${
      filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
    }`}
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const renderRatingStars = (rating) => {
  const numRating = Number(rating);
  return (
    <div className="flex space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={numRating >= star} className="w-5 h-5" />
      ))}
    </div>
  );
};
// ... (Giữ nguyên các MAP và helper formatCurrency, formatDateTime, formatDiscount) ...
// ...
const STATUS_MAP = {
  PENDING_PAYMENT: "Chờ thanh toán",
  CONFIRMED: "Đã xác nhận",
  IN_PROGRESS: "Đang thuê",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};
const PAYMENT_STATUS_MAP = {
  UNPAID: "Chưa thanh toán",
  PARTIAL: "Đã cọc",
  PAID: "Đã thanh toán",
};
const getVietnameseStatus = (status) => STATUS_MAP[status] || status;
const getVietnamesePaymentStatus = (status) =>
  PAYMENT_STATUS_MAP[status] || status;
const TRANSACTION_TYPE_MAP = {
  DEPOSIT: "Đặt cọc",
  FINAL_PAYMENT: "Thanh toán cuối",
  REFUND: "Hoàn tiền",
  EXTRA_FEE: "Phí phát sinh",
};
const TRANSACTION_STATUS_MAP = {
  SUCCESS: "Thành công",
  PENDING: "Đang chờ",
  FAILED: "Thất bại",
  PROCESSING: "Đang xử lý",
  REFUNDED: "Đã hoàn",
};
const PAYMENT_METHOD_MAP = {
  PayOS: "PayOS",
  CASH: "Tiền mặt",
};
const getVietnameseTransactionType = (type) =>
  TRANSACTION_TYPE_MAP[type] || type;
const getVietnameseTransactionStatus = (status) =>
  TRANSACTION_STATUS_MAP[status] || status;
const getVietnamesePaymentMethod = (method) =>
  PAYMENT_METHOD_MAP[method] || method;
const formatCurrency = (value) => {
  if (value === null || value === undefined) return "0 VNĐ";
  return Number(value).toLocaleString("vi-VN") + " VNĐ";
};
const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString("vi-VN");
};
const formatDiscount = (discountId) => {
  if (discountId === null || discountId === undefined) return "Không áp dụng";
  return `Mã giảm giá ID: ${discountId}`;
};
// ...

// -----------------------------------------------------------------
// Component trang Chi tiết Đơn hàng
// -----------------------------------------------------------------
export default function BookingDetail() {
  const { id } = useParams();
  const { data: order, loading, error, refetch } = useAdminGetOrderById(id);
  const { branches, isLoading: branchesLoading } = useBranches();

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  // 2. ❌ XÓA BỎ HÀM useCallback GÂY GIẬT LAG
  // const formatBranch = useCallback( ... );

  // 3. ✅ THAY THẾ BẰNG useMemo
  // Tính toán tên chi nhánh MỘT LẦN khi data thay đổi.
  const [pickupBranchName, returnBranchName] = useMemo(() => {
    // Nếu chưa có data, trả về trạng thái loading
    if (!order || branchesLoading) {
      return ["Đang tải...", "Đang tải..."];
    }

    // Hàm helper nội bộ
    const findName = (branchId) => {
      if (branchId === null || branchId === undefined) return "Tại nhà / Khác";

      // Tìm trong mảng
      const branch = branches.find((b) => b.BRANCH_ID === branchId);

      return branch ? branch.NAME : `Không tìm thấy (ID: ${branchId})`;
    };

    // Trả về một mảng chứa 2 tên đã tính toán
    return [findName(order.PICKUP_BRANCH_ID), findName(order.RETURN_BRANCH_ID)];
    // Chỉ chạy lại khi 1 trong 3 giá trị này thay đổi
  }, [order, branches, branchesLoading]);

  const renderContent = () => {
    if (loading && !order) return <p className="p-4">Đang tải chi tiết...</p>;
    if (error)
      return (
        <p className="p-4 text-red-500">
          Lỗi: {error.response?.data?.error || error.message}
        </p>
      );
    if (!order)
      return (
        <p className="p-4 text-gray-500">Không tìm thấy dữ liệu đơn hàng.</p>
      );

    const review = order.review;

    return (
      <Card className="p-6">
        <div className="space-y-8">
          {/* Khối 1: Thông tin chính */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Thông tin chính
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 text-sm mt-4">
              <p>
                <strong>Mã đơn hàng:</strong> {order.ORDER_CODE}
              </p>
              <p>
                <strong>Trạng thái:</strong> {getVietnameseStatus(order.STATUS)}
              </p>
              <p>
                <strong>Thanh toán:</strong>{" "}
                {getVietnamesePaymentStatus(order.PAYMENT_STATUS)}
              </p>
              <p>
                <strong>Khách hàng (ID):</strong>{" "}
                <Link
                  to={`/customers/${order.USER_ID}`}
                  className="text-blue-600 hover:underline"
                >
                  {order.USER_ID}
                </Link>
              </p>
              <p>
                <strong>Xe (ID):</strong>{" "}
                <Link
                  to={`/vehicles/${order.CAR_ID}`}
                  className="text-blue-600 hover:underline"
                >
                  {order.CAR_ID}
                </Link>
              </p>
              <p>
                <strong>Ngày tạo:</strong> {formatDateTime(order.CREATED_AT)}
              </p>
              <p>
                <strong>Ngày bắt đầu:</strong>{" "}
                {formatDateTime(order.START_DATE)}
              </p>
              <p>
                <strong>Ngày kết thúc:</strong> {formatDateTime(order.END_DATE)}
              </p>
              <p>
                <strong>Cập nhật lần cuối:</strong>{" "}
                {formatDateTime(order.UPDATED_AT)}
              </p>
            </div>
          </div>

          {/* Khối 2: Tài chính & Vận hành */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Tài chính & Ghi chú
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 text-sm mt-4">
              <p>
                <strong>Giá thuê gốc:</strong>{" "}
                {formatCurrency(order.RENTAL_PRICE)}
              </p>
              <p>
                <strong>Phí phát sinh:</strong>{" "}
                {formatCurrency(order.EXTRA_FEE)}
              </p>
              <p>
                <strong>Giảm giá:</strong> {formatDiscount(order.DISCOUNT_ID)}
              </p>

              {/* 4. ✅ SỬ DỤNG BIẾN ĐÃ TÍNH TOÁN (NHANH HƠN) */}
              <p>
                <strong>Nơi nhận xe:</strong> {pickupBranchName}
              </p>
              <p>
                <strong>Nơi trả xe:</strong> {returnBranchName}
              </p>
              {/* ... */}

              <p className="text-base font-semibold">
                <strong>Tổng thanh toán:</strong>{" "}
                {formatCurrency(order.FINAL_AMOUNT)}
              </p>
              {order.remainingAmount > 0 && (
                <p className="text-base font-semibold text-blue-600">
                  <strong>Còn lại phải thu:</strong>{" "}
                  {formatCurrency(order.remainingAmount)}
                </p>
              )}
            </div>
            <div className="text-sm mt-4">
              <strong className="block mb-1 text-gray-700">Ghi chú:</strong>
              <p className="text-gray-900 whitespace-pre-wrap p-3 bg-gray-50 rounded-md border border-gray-200">
                {order.NOTE || "Không có ghi chú."}
              </p>
            </div>
          </div>

          {/* Khối 3: Lịch sử giao dịch (Giữ nguyên) */}
          {order.payments && order.payments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Lịch sử giao dịch
              </h3>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã G.Dịch
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        P.Thức
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.payments.map((p) => (
                      <tr key={p.PAYMENT_ID}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                          {p.TRANSACTION_CODE}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(p.TRANSACTION_DATE)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getVietnameseTransactionType(p.PAYMENT_TYPE)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getVietnamesePaymentMethod(p.METHOD)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(p.AMOUNT)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getVietnameseTransactionStatus(p.STATUS)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Khối Review (Đã di chuyển xuống cuối) */}
          {review && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-lg font-semibold text-yellow-800 border-b border-yellow-300 pb-2 mb-3">
                Đánh giá từ Khách hàng
              </h3>
              <div className="text-sm space-y-2">
                <p className="flex items-center space-x-2">
                  <strong className="text-gray-800">Điểm đánh giá:</strong>
                  {renderRatingStars(review.RATING)}
                  <span className="font-bold text-yellow-700">
                    ({review.RATING}/5)
                  </span>
                </p>
                <p>
                  <strong className="block mb-1 text-gray-800">
                    Nội dung:
                  </strong>
                  <span className="block p-2 bg-white rounded border border-gray-200 whitespace-pre-wrap">
                    {review.CONTENT || "(Không có nội dung chi tiết)"}
                  </span>
                </p>
                <p>
                  <strong>Thời gian đánh giá:</strong>{" "}
                  {formatDateTime(review.CREATED_AT)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Chi tiết Đơn hàng
        </h1>
        <Link to="/bookings">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white">
            ← Quay lại danh sách
          </Button>
        </Link>
      </div>
      {renderContent()}
    </Layout>
  );
}
