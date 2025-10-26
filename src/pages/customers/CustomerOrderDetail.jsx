import React from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { useAdminGetUserOrders } from "../../hooks/useOrder";

// --- Các hàm tiện ích (Helpers) ---

// 1. Helper để format tiền tệ
const formatCurrency = (val) => {
  if (val === null || val === undefined) return "—";
  return new Number(val).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

// 2. Helper để format ngày giờ
const formatDate = (val) => {
  if (!val) return "—";
  return new Date(val).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

// 3. Helper cho badge Trạng thái Đơn hàng
// ✅ [CẬP NHẬT] Căn chỉnh theo ENUM của RENTAL_ORDER
const getStatusBadge = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "CONFIRMED":
    case "IN_PROGRESS": // Thêm trạng thái này từ schema
      return "bg-blue-100 text-blue-800";
    case "PENDING_PAYMENT":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

// 4. Helper cho badge Trạng thái Thanh toán
// ✅ [CẬP NHẬT] Căn chỉnh theo ENUM của RENTAL_ORDER
const getPaymentStatusBadge = (status) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800";
    case "PARTIAL":
    case "UNPAID":
      return "bg-yellow-100 text-yellow-800"; // Xóa 'REFUNDED' vì không có trong ENUM
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 5. ✅ [MỚI] Helper để format Trạng thái Đơn hàng (Tiếng Việt)
const formatOrderStatus = (status) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Chờ thanh toán";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "IN_PROGRESS":
      return "Đang thực hiện";
    case "COMPLETED":
      return "Đã hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status; // Trả về giá trị gốc nếu không khớp
  }
};

// 6. ✅ [MỚI] Helper để format Trạng thái Thanh toán (Tiếng Việt)
const formatPaymentStatus = (status) => {
  switch (status) {
    case "UNPAID":
      return "Chưa thanh toán";
    case "PARTIAL":
      return "Đã cọc";
    case "PAID":
      return "Đã thanh toán";
    default:
      return status;
  }
};

// --- Component chính ---

export default function CustomerOrderDetail() {
  // 1. Lấy userId từ URL
  const { userId } = useParams(); // 2. Gọi hook để lấy dữ liệu đơn hàng của user

  const { data: orders, loading, error } = useAdminGetUserOrders(userId);

  const tableHeaders = [
    "Mã ĐH",
    "Ngày bắt đầu",
    "Ngày kết thúc",
    "Tổng tiền",
    "Trạng thái ĐH",
    "Trạng thái TT",
    "Thao tác",
  ];

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header và Nút Quay Lại */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Lịch sử đơn hàng của Khách hàng mã {userId}
          </h2>
          <Link to="/customers">
            <Button className="bg-gray-500 hover:bg-gray-600">
              {" "}
              {"<"} Quay lại Danh sách
            </Button>
          </Link>
        </div>{" "}
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <p className="p-4 text-center text-red-600 bg-red-100 rounded-md">
            Lỗi khi tải dữ liệu: {error.message}
          </p>
        )}
        {/* Bảng dữ liệu */}
        <Card>
          {loading ? (
            <p className="p-6 text-center text-gray-500">
              Đang tải lịch sử đơn hàng...
            </p>
          ) : (
            <Table
              headers={tableHeaders}
              data={orders}
              renderRow={(order) => (
                <>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {order.ORDER_CODE}
                  </td>
                  <td className="px-4 py-2">{formatDate(order.START_DATE)}</td>
                  <td className="px-4 py-2">{formatDate(order.END_DATE)}</td>
                  <td className="px-4 py-2 font-medium">
                    {formatCurrency(order.FINAL_AMOUNT)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        order.STATUS
                      )}`}
                    >
                      {/* ✅ [CẬP NHẬT] Hiển thị Tiếng Việt */}
                      {formatOrderStatus(order.STATUS)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(
                        order.PAYMENT_STATUS
                      )}`}
                    >
                      {/* ✅ [CẬP NHẬT] Hiển thị Tiếng Việt */}
                      {formatPaymentStatus(order.PAYMENT_STATUS)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <Link to={`/bookings/${order.ORDER_ID}`}>
                      <Button className="bg-blue-600">Chi tiết</Button>
                    </Link>
                  </td>
                </>
              )}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
}
