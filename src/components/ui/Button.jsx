import React from "react";

/**
 * [MỚI] Đây là Button NỀN TẢNG
 * Nó chỉ chứa các style chung (padding, bo góc, text...)
 * KHÔNG chứa màu nền (background-color)
 */
function ButtonBase({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      // Chỉ style chung, không có 'bg-primary'
      className={`px-4 py-2 rounded-md text-white hover:opacity-95 transition ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * [SỬA] Component Button (default) của bạn
 * Giờ nó là một biến thể của ButtonBase, với màu 'bg-primary'
 */
export default function Button({ children, className = "", ...props }) {
  return (
    <ButtonBase
      // Thêm 'bg-primary'
      className={`bg-primary ${className}`}
      {...props}
    >
      {children}
    </ButtonBase>
  );
}

/**
 * [SỬA] Biến thể "Create" (Màu xanh lá)
 * Dùng ButtonBase và thêm màu 'bg-green-600'
 */
export function ButtonCreate({ children, className = "", ...props }) {
  return (
    <ButtonBase
      className={`bg-green-600 hover:bg-green-700 ${className}`}
      {...props}
    >
      {children}
    </ButtonBase>
  );
}

/**
 * [SỬA] Biến thể "Read / Info" (Màu xanh dương)
 */
export function ButtonRead({ children, className = "", ...props }) {
  return (
    <ButtonBase
      className={`bg-blue-600 hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </ButtonBase>
  );
}

/**
 * [SỬA] Biến thể "Edit / Update" (Màu vàng/hổ phách)
 */
export function ButtonEdit({ children, className = "", ...props }) {
  return (
    <ButtonBase
      className={`bg-amber-600 hover:bg-amber-700 ${className}`}
      {...props}
    >
      {children}
    </ButtonBase>
  );
}

/**
 * [SỬA] Biến thể "Delete / Danger" (Màu đỏ)
 */
export function ButtonDelete({ children, className = "", ...props }) {
  return (
    <ButtonBase
      className={`bg-red-600 hover:bg-red-700 ${className}`}
      {...props}
    >
      {children}
    </ButtonBase>
  );
}
