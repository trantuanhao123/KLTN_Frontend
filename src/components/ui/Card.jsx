import React from 'react'

export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg p-4 shadow ${className}`}>
      {title && <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  )
}