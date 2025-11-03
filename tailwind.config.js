const { COLORS, FONT_SIZES, SPACING } = require("./src/utils/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // <-- [SỬA ĐỔI] Dùng module.exports
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: COLORS, // <-- Chỉ cần gán biến
      fontSize: FONT_SIZES, // <-- Chỉ cần gán biến
      spacing: SPACING, // <-- Chỉ cần gán biến
    },
  },
  plugins: [],
};
