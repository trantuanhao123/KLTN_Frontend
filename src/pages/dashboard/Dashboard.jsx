import React from "react";
import Layout from "../../components/layouts/Layout";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useDashboardStats } from "../../hooks/useDashboard";

import {
  formatCurrency,
  formatDate,
  getRentalStatusStyle,
  getIncidentStatusStyle,
} from "../../utils/formatters";

export default function Dashboard() {
  const { data, loading, error } = useDashboardStats();

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
          <p className="text-red-500">Không thể tải dữ liệu: {error}</p>
        </Card>
      </Layout>
    );
  }

  // Dữ liệu từ API (sau khi đã tải xong)
  const stats = data.dashboardData.stats;
  const recentRentals = data.dashboardData.recentRentals;
  const recentIncidents = data.dashboardData.recentIncidents;
  const availableCarsCount = data.availableCars.length;

  // Lấy lượt thuê tuần gần nhất (nếu có)
  const latestWeeklyRental = data.dashboardData.weeklyRentals?.[0] || {
    rentalCount: 0,
  };

  return (
    <Layout>
      {/* 1. Phần Thống Kê Nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Tổng doanh thu">
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div className="text-sm text-gray-500">Toàn thời gian</div>
        </Card>

        <Card title="Lượt thuê (Tuần này)">
          <div className="text-2xl font-bold">
            {latestWeeklyRental.rentalCount}
          </div>
          <div className="text-sm text-gray-500">
            {latestWeeklyRental.year
              ? `Tuần ${latestWeeklyRental.week}/${latestWeeklyRental.year}`
              : "Đang cập nhật"}
          </div>
        </Card>

        <Card title="Xe sẵn sàng">
          <div className="text-2xl font-bold">{availableCarsCount}</div>
          <div className="text-sm text-gray-500">Trong kho</div>
        </Card>
      </div>

      {/* 2. Phần Danh Sách Gần Đây */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lịch thuê gần đây */}
        <Card title="Lịch thuê gần đây">
          <ul className="space-y-3 text-sm">
            {recentRentals.length > 0 ? (
              recentRentals.map((rental) => {
                // Lấy style (text + class) từ hàm helper
                const statusStyle = getRentalStatusStyle(rental.STATUS);

                return (
                  <li key={rental.ORDER_ID} className="flex justify-between">
                    <div>
                      <span className="font-semibold">
                        #{rental.ORDER_CODE}
                      </span>{" "}
                      - {rental.BRAND} {rental.MODEL}
                      <span className="block text-gray-500 text-xs">
                        {rental.userName} - {formatDate(rental.START_DATE)}
                      </span>
                    </div>
                    {/* Áp dụng text và class vào đây */}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full self-start ${statusStyle.className}`}
                    >
                      {statusStyle.text}
                    </span>
                  </li>
                );
              })
            ) : (
              <li className="text-gray-400">Không có lịch thuê gần đây.</li>
            )}
          </ul>
        </Card>

        {/* Báo cáo sự cố gần đây */}
        <Card title="Báo cáo sự cố gần đây">
          <ul className="space-y-3 text-sm">
            {recentIncidents.length > 0 ? (
              recentIncidents.map((incident) => {
                // Lấy style (text + class) từ hàm helper
                const statusStyle = getIncidentStatusStyle(incident.STATUS);

                return (
                  <li
                    key={incident.INCIDENT_ID}
                    className="flex justify-between"
                  >
                    <div>
                      <span className="font-semibold">
                        #{incident.ORDER_CODE}
                      </span>{" "}
                      - {incident.userName}
                      <span className="block text-gray-500 text-xs truncate max-w-xs">
                        {incident.DESCRIPTION}
                      </span>
                    </div>
                    {/* Áp dụng text và class vào đây */}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full self-start ${statusStyle.className}`}
                    >
                      {statusStyle.text}
                    </span>
                  </li>
                );
              })
            ) : (
              <li className="text-gray-400">Không có sự cố gần đây.</li>
            )}
          </ul>
        </Card>
      </div>
    </Layout>
  );
}
