// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define the schema and model
const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  category: String,
  image: String,
  sold: Boolean,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// API to initialize the database
app.get("/api/init", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json",
      {
        timeout: 10000,
      }
    );
    const transactions = response.data;

    // Filter out invalid transactions
    const validTransactions = transactions.filter((transaction) => {
      return (
        transaction.price !== undefined &&
        transaction.price !== null &&
        !isNaN(transaction.price) &&
        transaction.price !== ""
      );
    });

    await Transaction.deleteMany(); // Clear existing data
    await Transaction.insertMany(validTransactions); // Seed new data

    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to initialize database" });
  }
});

// API to list all transactions
app.get("/api/transactions", async (req, res) => {
  const { page = 1, perPage = 10, search = "" } = req.query;

  let query = {};

  if (search) {
    const priceSearch = parseFloat(search);
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        ...(isNaN(priceSearch) ? [] : [{ price: priceSearch }]),
      ],
    };
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage))
      .select("title description price category dateOfSale sold image");

    const total = await Transaction.countDocuments(query);

    res.status(200).json({ total, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// API for statistics
app.get("/api/statistics/:month", async (req, res) => {
  try {
    const statistics = await getStatistics(req.params.month);
    res.status(200).json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// API for bar chart data
app.get("/api/bar-chart/:month", async (req, res) => {
  try {
    const barChartData = await getBarChartData(req.params.month);
    res.status(200).json(barChartData);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ error: "Failed to fetch bar chart data" });
  }
});

// API for pie chart data
app.get("/api/pie-chart/:month", async (req, res) => {
  try {
    const pieChartData = await getPieChartData(req.params.month);
    res.status(200).json(pieChartData);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ error: "Failed to fetch pie chart data" });
  }
});

// API to combine all data
app.get("/api/combined/:month", async (req, res) => {
  try {
    const month = req.params.month;

    const [statistics, barChartData, pieChartData] = await Promise.all([
      getStatistics(month),
      getBarChartData(month),
      getPieChartData(month),
    ]);

    res.status(200).json({ statistics, barChartData, pieChartData });
  } catch (error) {
    console.error("Error in combined API:", error);
    res.status(500).json({ error: "Failed to fetch combined data" });
  }
});

// Helper functions for APIs
async function getStatistics(month) {
  const monthNumber = new Date(Date.parse(month + " 1, 2020")).getMonth() + 1;

  const totalSales = await Transaction.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthNumber],
        },
      },
    },
    { $group: { _id: null, total: { $sum: "$price" }, count: { $sum: 1 } } },
  ]);

  const notSoldCount = await Transaction.countDocuments({
    $or: [
      { dateOfSale: { $exists: false } },
      { dateOfSale: null },
      { $expr: { $ne: [{ $month: "$dateOfSale" }, monthNumber] } },
    ],
  });

  return {
    totalSaleAmount: totalSales[0]?.total || 0,
    totalSoldItems: totalSales[0]?.count || 0,
    totalNotSoldItems: notSoldCount,
  };
}

async function getBarChartData(month) {
  const monthNumber = new Date(Date.parse(month + " 1, 2020")).getMonth() + 1;

  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  const result = await Transaction.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthNumber],
        },
      },
    },
    {
      $bucket: {
        groupBy: "$price",
        boundaries: priceRanges.map((range) => range.min),
        default: "901-above",
        output: { count: { $sum: 1 } },
      },
    },
  ]);

  return result.map((item, index) => ({
    range:
      index === priceRanges.length
        ? "901-above"
        : `${priceRanges[index].min}-${priceRanges[index].max}`,
    count: item.count,
  }));
}

async function getPieChartData(month) {
  const monthNumber = new Date(Date.parse(month + " 1, 2020")).getMonth() + 1;

  const result = await Transaction.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthNumber],
        },
      },
    },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  return result.map((item) => ({
    category: item._id,
    count: item.count,
  }));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
