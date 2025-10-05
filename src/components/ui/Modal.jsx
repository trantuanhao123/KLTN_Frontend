import React from "react";

export default function Modal({
  open,
  title,
  children,
  onClose,
  className = "",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative ${className}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
        )}

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
