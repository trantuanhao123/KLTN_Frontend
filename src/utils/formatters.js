export const formatCurrency = (amount) => {
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    return "0 ₫";
  }

  return numericAmount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};
export const getRentalStatusStyle = (status) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return {
        text: "Chờ thanh toán",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "CONFIRMED":
      return { text: "Đã xác nhận", className: "bg-blue-100 text-blue-700" };
    case "IN_PROGRESS":
      return { text: "Đang thuê", className: "bg-green-100 text-green-700" };
    case "COMPLETED":
      return { text: "Đã hoàn thành", className: "bg-gray-100 text-gray-600" };
    case "CANCELLED":
      return { text: "Đã hủy", className: "bg-red-100 text-red-700" };
    default:
      return { text: status, className: "bg-gray-100 text-gray-500" };
  }
};

export const getIncidentStatusStyle = (status) => {
  switch (status) {
    case "NEW":
      return { text: "Mới", className: "bg-red-100 text-red-700" };
    case "IN_PROGRESS":
      return {
        text: "Đang xử lý",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "RESOLVED":
      return {
        text: "Đã giải quyết",
        className: "bg-blue-100 text-blue-700",
      };
    case "CLOSED":
      return { text: "Đã đóng", className: "bg-gray-100 text-gray-600" };
    default:
      return { text: status, className: "bg-gray-100 text-gray-500" };
  }
};
