import React from "react";
import Card from "../ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "../../utils/formatters";

export default function CustomBarChart({ title, data, dataKey, nameKey }) {
  const chartData = data.map((item) => ({
    ...item,
    [dataKey]: parseFloat(item[dataKey]),
  }));

  return (
    <Card title={title}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey={dataKey} fill="#8884d8" name="Doanh thu" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
