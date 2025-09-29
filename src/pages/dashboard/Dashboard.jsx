import React from 'react'
import Layout from '../../components/layouts/Layout' 
import Card from '../../components/ui/Card'
export default function Dashboard() {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Tổng doanh thu">
          <div className="text-2xl font-bold">₫120,500,000</div>
          <div className="text-sm text-gray-500">Tháng này</div>
        </Card>

        <Card title="Lượt thuê">
          <div className="text-2xl font-bold">1,320</div>
          <div className="text-sm text-gray-500">Tuần này</div>
        </Card>

        <Card title="Xe sẵn sàng">
          <div className="text-2xl font-bold">56</div>
          <div className="text-sm text-gray-500">Trong kho</div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Lịch thuê gần đây">
          <ul className="space-y-2 text-sm">
            <li>Đơn #1023 — Honda City — 12/09/2025 — Đã xác nhận</li>
            <li>Đơn #1024 — Mazda 3 — 13/09/2025 — Chờ xử lý</li>
            <li>Đơn #1025 — Toyota Vios — 13/09/2025 — Hủy</li>
          </ul>
        </Card>

        <Card title="Báo cáo sự cố gần đây">
          <ul className="space-y-2 text-sm">
            <li>Đơn #874 — Vỡ gương — Đã nhận</li>
            <li>Đơn #875 — Lốp bị thủng — Đang xử lý</li>
          </ul>
        </Card>
      </div>
    </Layout>
  )
}