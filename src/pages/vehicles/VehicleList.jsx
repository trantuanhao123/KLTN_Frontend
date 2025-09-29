import React from 'react'
import Layout from '../../components/layouts/Layout' 
import Card from '../../components/ui/Card'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function VehicleList() {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Quản lý xe</h3>
        <Link to="/vehicles/new"><Button>Thêm xe</Button></Link>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">#</th>
              <th>Loại / Model</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3">1</td>
              <td>Honda City - 2022</td>
              <td>Available</td>
              <td><button className="text-sm underline">Sửa</button> <button className="text-sm underline text-red-600">Xóa</button></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </Layout>
  )
}