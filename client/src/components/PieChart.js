import React, { useEffect, useState } from "react";
import { fetchPieChart } from "../api/transactionApi";
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

const PieChart = ({ month }) => {
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const loadPieChart = async () => {
      const data = await fetchPieChart(month);
      setPieChartData(data);
    };

    loadPieChart();
  }, [month]);

  return (
    <div className="pie-chart">
      <h2>Category Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RePieChart>
          <Pie
            data={pieChartData}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
