import React, { useState } from "react";
import TransactionTable from "./components/TransactionTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import "./App.css";

const App = () => {
  const [month, setMonth] = useState("03");
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="container">
      <h1>Transaction Dashboard</h1>
      <div className="controls">
        <label htmlFor="month">Select Month: </label>
        <select
          id="month"
          value={month}
          onChange={handleMonthChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setIsDropdownOpen(false)}
          className={isDropdownOpen ? "dropdown-open" : ""}
        >
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <input
          type="text"
          placeholder="Search transactions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <TransactionTable month={month} search={search} />
      <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </div>
  );
};

export default App;
