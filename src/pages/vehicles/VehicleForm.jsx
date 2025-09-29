import React from 'react'
import Layout from '../../components/layouts/Layout' 
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function VehicleForm() {
  return (
    <Layout>
      <Card title="Thêm / Chỉnh sửa xe">
        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Tên xe</label>
            <input className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Năm</label>
              <input className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Trạng thái</label>
              <select className="w-full border rounded px-3 py-2">
                <option>Available</option>
                <option>Rented</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save</Button>
          </div>
        </form>
      </Card>
    </Layout>
  )
}