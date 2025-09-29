/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0b6e99",        // màu chính
        primaryLight: "#e6f4fb",   // nền sáng
        accent: "#0f9bd4",         // màu nhấn
        text: "#333333",           // chữ chính
        textLight: "#666666",      // chữ phụ
        background: "#f9fafb",     // nền tổng thể
        danger: "#e63946",         // lỗi
        success: "#2a9d8f",        // thành công
        warning: "#f4a261",        // cảnh báo
      },
      fontSize: {
        small: "0.8rem",
        base: "1rem",
        medium: "1.2rem",
        large: "1.5rem",
        xlarge: "2rem",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
    },
  },
  plugins: [],
};
