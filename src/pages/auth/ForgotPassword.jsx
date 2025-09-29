import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    // demo -> in thực tế gọi API reset password
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryLight">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-primary mb-2">Quên mật khẩu</h1>
        {sent ? (
          <div className="text-sm text-green-600">Một email đặt lại mật khẩu đã được gửi (demo).</div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex items-center justify-between">
              <Link to="/login" className="text-sm text-gray-500 underline">Quay lại đăng nhập</Link>
              <Button type="submit">Gửi</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}