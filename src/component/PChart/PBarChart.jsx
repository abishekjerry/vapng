import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const PBarChart = ({ data }) => {
  // 1️⃣ Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div
          style={{
            background: "#fff",
            padding: "6px 10px",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "12px",
            color: "#111827",
          }}
        >
          {`${name}: ${value}`} {/* Single line */}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        width: "100%",
        height: 400,
        background: "#ffffff",
        padding: "10px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} barCategoryGap="25%">

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1976d2" stopOpacity={1} />
              <stop offset="100%" stopColor="#42a5f5" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

          <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 8 }} axisLine={false} tickLine={false}/>

          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />

          {/* 2️⃣ Use Custom Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PBarChart;