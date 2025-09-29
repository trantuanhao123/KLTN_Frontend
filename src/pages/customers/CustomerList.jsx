import React from 'react'
import Layout from '../../components/layouts/Layout' 
import Card from '../../components/ui/Card'

export default function CustomerList() {
  return (
    <Layout>
      <h3 className="text-xl font-semibold mb-4">Khách hàng</h3>
      <Card>
        <p className="text-sm">Danh sách khách hàng và lịch sử thuê (demo).</p>
      </Card>
    </Layout>
  )
}