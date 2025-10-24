import React, { useEffect, useCallback } from "react"; // [MỚI] Thêm useCallback
import { useParams, Link } from "react-router-dom";
import { useAdminGetOrderById } from "../../hooks/useOrder";
import useBranches from "../../hooks/useBranch"; // [MỚI] Import hook chi nhánh
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// -----------------------------------------------------------------
// Dữ liệu map (Đơn hàng)
// -----------------------------------------------------------------
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

// -----------------------------------------------------------------
// Dữ liệu map cho Lịch sử giao dịch (Payment)
// -----------------------------------------------------------------
const TRANSACTION_TYPE_MAP = {
  DEPOSIT: "Đặt cọc",
  FINAL_PAYMENT: "Thanh toán cuối",
  REFUND: "Hoàn tiền",
};
const TRANSACTION_STATUS_MAP = {
  SUCCESS: "Thành công",
  PENDING: "Đang chờ",
  FAILED: "Thất bại",
};
const PAYMENT_METHOD_MAP = {
  VNPAY: "VNPAY",
  CASH: "Tiền mặt",
};
const getVietnameseTransactionType = (type) =>
  TRANSACTION_TYPE_MAP[type] || type;
const getVietnameseTransactionStatus = (status) =>
  TRANSACTION_STATUS_MAP[status] || status;
const getVietnamesePaymentMethod = (method) =>
  PAYMENT_METHOD_MAP[method] || method;

// -----------------------------------------------------------------
// Các hàm Helper (Giữ nguyên)
// -----------------------------------------------------------------
const formatCurrency = (value) => {
  if (value === null || value === undefined) return "0 VNĐ";
  return Number(value).toLocaleString("vi-VN") + " VNĐ";
};

const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString("vi-VN");
};

// [XÓA] Hàm formatBranch cũ đã bị xóa khỏi đây

const formatDiscount = (discountId) => {
  if (discountId === null || discountId === undefined) return "Không áp dụng";
  return `Mã giảm giá ID: ${discountId}`;
};

// -----------------------------------------------------------------
// Component trang Chi tiết Đơn hàng
// -----------------------------------------------------------------
export default function BookingDetail() {
  const { id } = useParams();
  const { data: order, loading, error, refetch } = useAdminGetOrderById(id);

  // [MỚI] Gọi hook để lấy danh sách chi nhánh
  // Đổi tên 'isLoading' để tránh xung đột
  const { branches, isLoading: branchesLoading } = useBranches();

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  // [MỚI] Định nghĩa hàm formatBranch BÊN TRONG component
  // để nó có thể truy cập state 'branches'
  const formatBranch = useCallback(
    (branchId) => {
      if (branchId === null || branchId === undefined) return "Tại nhà / Khác";

      // Nếu hook chi nhánh đang tải, hiển thị tạm
      if (branchesLoading) return `Đang tải... (ID: ${branchId})`;

      // Tìm chi nhánh trong mảng
      // Giả sử key là 'BRANCH_ID' và 'NAME'
      const branch = branches.find((b) => b.BRANCH_ID === branchId);

      if (branch) {
        return branch.NAME; // Trả về tên, ví dụ: "Chi nhánh Tân Bình"
      }

      return `Không tìm thấy (ID: ${branchId})`; // Fallback nếu không tìm thấy
    },
    [branches, branchesLoading] // Phụ thuộc vào state của hook
  );

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

    return (
      <Card className="p-6">
        <div className="space-y-8">
          {/* Khối 1: Thông tin chính (Giữ nguyên) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Thông tin chính
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 text-sm mt-4">
              <p>
                <strong>Mã đơn hàng:</strong> {order.ORDER_CODE}
              </p>
              {/* ...các trường khác... */}
              <p>
                <strong>Trạng thái:</strong> {getVietnameseStatus(order.STATUS)}
              </p>
              <p>
                <strong>Thanh toán:</strong>{" "}
                {getVietnamesePaymentStatus(order.PAYMENT_STATUS)}
              </p>
              <p>
                <strong>Khách hàng (ID):</strong> {order.USER_ID}
              </p>
              <p>
                <strong>Xe (ID):</strong> {order.CAR_ID}
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
              {/* [CẬP NHẬT] Các hàm gọi formatBranch giờ đã đúng */}
              <p>
                <strong>Nơi nhận xe:</strong>{" "}
                {formatBranch(order.PICKUP_BRANCH_ID)}
              </p>
              <p>
                <strong>Nơi trả xe:</strong>{" "}
                {formatBranch(order.RETURN_BRANCH_ID)}
              </p>
              <p className="text-base font-semibold">
                <strong>Tổng thanh toán:</strong>{" "}
                {formatCurrency(order.FINAL_AMOUNT)}
              </p>

              {/* // ===========================================
                // [MỚI] THÊM HIỂN THỊ SỐ TIỀN CÒN LẠI
                // ===========================================
              */}
              {order.remainingAmount > 0 && (
                <p className="text-base font-semibold text-blue-600">
                  <strong>Còn lại phải thu:</strong>{" "}
                  {formatCurrency(order.remainingAmount)}
                </p>
              )}
            </div>
            {/* Ghi chú (Giữ nguyên) */}
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
                  {/* ... (thead) ... */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Mã G.Dịch
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Ngày
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Loại
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        P.Thức
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Số tiền
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.payments.map((p) => (
                      <tr key={p.PAYMENT_ID}>
                        <td className="px-4 py-2 font-mono text-xs text-gray-700">
                          {p.TRANSACTION_CODE}
                        </td>
                        <td className="px-4 py-2">
                          {formatDateTime(p.TRANSACTION_DATE)}
                        </td>
                        <td className="px-4 py-2">
                          {getVietnameseTransactionType(p.PAYMENT_TYPE)}
                        </td>
                        <td className="px-4 py-2">
                          {getVietnamesePaymentMethod(p.METHOD)}
                        </td>
                        <td className="px-4 py-2 font-semibold text-gray-900">
                          {formatCurrency(p.AMOUNT)}
                        </td>
                        <td className="px-4 py-2">
                          {getVietnameseTransactionStatus(p.STATUS)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
