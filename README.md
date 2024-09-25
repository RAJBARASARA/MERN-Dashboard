# MERN Stack Transaction Management

## Project Overview
This project implements a MERN (MongoDB, Express, React, Node.js) stack application that interacts with a third-party API to manage product transactions. It includes:
- Backend APIs to fetch and manage data.
- A frontend interface to visualize the data in tables and charts.

## Features

- **Transaction Table**: Displays a paginated list of transactions with search functionality.
- **Statistics**: Shows total sale amount, total sold items, and total not sold items for a selected month.
- **Bar Chart**: Visualizes the distribution of transaction prices in different ranges for a selected month.
- **Pie Chart**: Visualizes the distribution of transaction categories for a selected month.
- **Database Initialization**: Fetches and seeds transaction data from a remote source.

## Technologies Used
- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Visualization**: Chart.js (for bar and pie charts)

## Project Structure
MERN-dashboard/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── ...
│   ├── .env
│   ├── package.json
│   └── ...
├── server/
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── ...
└── README.md

## How to Run the Project

### 1. Clone the Repository
```bash
git clone (https://github.com/RAJBARASARA/MERN-Dashboard)
cd MERN-Dashboard
```

### 2. **Setup the server**:
    - Navigate to the `server` directory:
        ```sh
        cd server
        ```
    - Install server dependencies:
        ```sh
        npm install
        ```
    - Create a `.env` file in the `server` directory and add your MongoDB URI:
        ```env
        MONGO_URI=mongodb://localhost:27017/productTransactions
        ```
    - Start the server:
        ```sh
        npm start
        ```

### 3. **Setup the client**:
    - Navigate to the `client` directory:
        ```sh
        cd ../client
        ```
    - Install client dependencies:
        ```sh
        npm install
        ```
    - Create a `.env` file in the `client` directory and add the API URL:
        ```env
        REACT_APP_API_URL=http://localhost:3000/api
        ```
    - Start the client:
        ```sh
        npm start
        ```

### 4. API Endpoints

#### Initialize Database
- **Endpoint**: `/api/init`
- **Method**: `GET`
- Fetches product transaction data from a third-party API and seeds the MongoDB database.

#### List Transactions
- **Endpoint**: `/api/transactions`
- **Method**: `GET`
- Supports search and pagination for product transactions.

#### Statistics API
- **Endpoint**: `/api/statistics`
- **Method**: `GET`
- Returns total sale amount, total sold items, and total not sold items for the selected month.

#### Bar Chart API
- **Endpoint**: `/api/bar-chart`
- **Method**: `GET`
- Returns the price range and the number of items in each range for the selected month.

#### Pie Chart API
- **Endpoint**: `/api/pie-chart`
- **Method**: `GET`
- Returns the unique categories and the number of items in each category for the selected month.

### 5. Frontend Functionality

- **Transactions Table**: Displays product transactions with pagination and search functionality.
- **Statistics Section**: Displays total sales and item counts for the selected month.
- **Bar Chart**: Visualizes price ranges for the selected month.
- **Pie Chart**: Visualizes categories for the selected month.

## How to Use

1. Select a month from the dropdown to view data for that month.
2. Use the search box to filter transactions by title, description, or price.
3. Navigate through pages using the Next and Previous buttons.

## License
This project is licensed under the MIT License.
