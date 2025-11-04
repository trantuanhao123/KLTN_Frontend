import React from "react";
import Card from "../ui/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../utils/formatters";

// Định nghĩa màu cho các phần
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export default function CustomPieChart({ title, data, dataKey, nameKey }) {
  const chartData = data.map((item) => ({
    ...item,
    [dataKey]: parseFloat(item[dataKey]),
  }));

  return (
    <Card title={title}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey={dataKey} // ví dụ: "totalRevenue"
              nameKey={nameKey} // ví dụ: "categoryName"
              cx="50%"
              cy="50%"
              outerRadius={90} // Bán kính
              fill="#8884d8"
              labelLine={false}
              // Hiển thị % trên biểu đồ
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {/* Hiển thị tooltip khi di chuột với định dạng tiền tệ */}
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
