// src/pages/reports/Reports.js
import React from "react";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import CustomPieChart from "../../components/charts/PieChart";
import CustomBarChart from "../../components/charts/BarChart";
import { useReports } from "../../hooks/useReport"; // Đảm bảo đường dẫn hook chính xác
import { formatCurrency } from "../../utils/formatters";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const BASE_IMAGE_URL = `${BACKEND_URL}/images/`;

const FALLBACK_IMAGE_URL = `${BASE_IMAGE_URL}carError.jpg`;

export default function Reports() {
  const { data, loading, error } = useReports();

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Card title="Lỗi">
          <p className="text-red-500">Không thể tải báo cáo: {error}</p>
        </Card>
      </Layout>
    );
  }

  const { revenueByCategory, mostRentedCars } = data;

  // Cấu hình bảng
  const tableHeaders = ["Hạng", "Xe", "Biển số", "Số lượt thuê"];

  const renderTableRow = (car, index) => {
    // ⚠️ SỬA: Thay đổi ảnh dự phòng tại đây
    const imageUrl = car.mainImageUrl
      ? `${BASE_IMAGE_URL}${car.mainImageUrl}`
      : FALLBACK_IMAGE_URL;

    return (
      <>
        <td className="px-4 py-2 font-medium">{index + 1}</td>
        <td className="px-4 py-2">
          <div className="flex items-center gap-2">
            <img
              src={imageUrl}
              alt={car.MODEL}
              className="w-10 h-10 object-cover rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE_URL;
              }}
            />
            <span className="font-semibold">
              {car.BRAND} {car.MODEL}
            </span>
          </div>
        </td>
        <td className="px-4 py-2">{car.LICENSE_PLATE}</td>
        <td className="px-4 py-2 font-bold text-lg">{car.rentalCount}</td>
      </>
    );
  };

  return (
    <Layout>
      <h3 className="text-xl font-semibold mb-4">Báo cáo & Thống kê</h3>

      {/* Phần biểu đồ doanh thu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Biểu đồ tròn (PieChart) */}
        <CustomPieChart
          title="Tỉ trọng Doanh thu theo loại xe"
          data={revenueByCategory}
          dataKey="totalRevenue"
          nameKey="categoryName"
        />

        {/* Biểu đồ cột (BarChart) */}
        <CustomBarChart
          title="Chi tiết Doanh thu theo loại xe"
          data={revenueByCategory}
          dataKey="totalRevenue"
          nameKey="categoryName"
        />
      </div>

      {/* Bảng Xe thuê nhiều nhất */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-3">Xe được thuê nhiều nhất</h4>
        <Table
          headers={tableHeaders}
          data={mostRentedCars}
          renderRow={renderTableRow}
        />
      </div>
    </Layout>
  );
}
