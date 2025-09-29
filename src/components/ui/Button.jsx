import React from 'react'

export default function Button({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-md bg-primary text-white hover:opacity-95 transition ${className}`}
    >
      {children}
    </button>
  )
}