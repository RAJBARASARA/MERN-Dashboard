import React, { useEffect, useState } from "react";
import { fetchStatistics } from "../api/transactionApi";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    const loadStatistics = async () => {
      const data = await fetchStatistics(month);
      setStatistics(data);
    };

    loadStatistics();
  }, [month]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="statistics">
      <h2>Statistics - {monthNames[parseInt(month, 10) - 1]}</h2>
      <div>
        <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
        <p>Total Sold Items: {statistics.totalSoldItems}</p>
        <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default Statistics;
