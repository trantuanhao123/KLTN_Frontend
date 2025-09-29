import React from 'react'
import Layout from '../../components/layouts/Layout'
import Card from '../../components/ui/Card'

export default function Reports() {
  return (
    <Layout>
      <h3 className="text-xl font-semibold mb-4">Báo cáo & Thống kê</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Doanh thu theo loại xe">Biểu đồ / bảng (placeholder)</Card>
        <Card title="Xe được thuê nhiều nhất">Danh sách (placeholder)</Card>
      </div>
    </Layout>
  )
}