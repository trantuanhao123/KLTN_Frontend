import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user')) || null
    } catch (e) {
      return null
    }
  })

  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('admin_user', JSON.stringify(user))
  }, [user])

  const login = async ({ email, password }) => {
    // Demo: giả lập API, thực tế gọi API và kiểm tra
    if (email === 'admin@demo.com' && password === 'password') {
      const u = { email, name: 'Admin Demo', role: 'admin' }
      setUser(u)
      return { ok: true }
    }
    return { ok: false, message: 'Email hoặc mật khẩu không đúng' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('admin_user')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}