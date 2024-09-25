import React, { useEffect, useState } from "react";
import { fetchBarChart } from "../api/transactionApi";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const loadBarChart = async () => {
      const data = await fetchBarChart(month);
      setBarChartData(data);
    };

    loadBarChart();
  }, [month]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bar-chart">
      <h2>Price Range Distribution - {monthNames[parseInt(month, 10) - 1]}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ReBarChart data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
