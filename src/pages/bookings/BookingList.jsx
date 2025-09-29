import React from 'react'
import Layout from '../../components/layouts/Layout' 
import Card from '../../components/ui/Card'

export default function BookingList() {
  return (
    <Layout>
      <h3 className="text-xl font-semibold mb-4">Danh sách yêu cầu thuê</h3>
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Mã</th>
              <th>Khách hàng</th>
              <th>Xe</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3">#1023</td>
              <td>Nguyễn A</td>
              <td>Honda City</td>
              <td>12/09/2025</td>
              <td>Confirmed</td>
              <td><button className="underline">Chi tiết</button></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </Layout>
  )
}