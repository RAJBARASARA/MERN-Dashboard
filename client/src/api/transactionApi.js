import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const fetchTransactions = async ({ month, search, page }) => {
  const { data } = await axios.get(
    `${BASE_URL}/transactions?month=${month}&search=${search}&page=${page}`
  );
  return data;
};

export const fetchStatistics = async (month) => {
  const { data } = await axios.get(`${BASE_URL}/statistics/${month}`);
  return data;
};

export const fetchBarChart = async (month) => {
  const { data } = await axios.get(`${BASE_URL}/bar-chart/${month}`);
  return data;
};

export const fetchPieChart = async (month) => {
  const { data } = await axios.get(`${BASE_URL}/pie-chart/${month}`);
  return data;
};
