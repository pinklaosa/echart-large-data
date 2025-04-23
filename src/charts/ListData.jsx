import React, { useState, useEffect } from "react";

const ListData = ({ selectedRows, onSelectedRowsChange }) => {
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // List of popular cryptocurrencies
  const cryptoList = [
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 3,
      name: "Binance Coin",
      symbol: "BNB",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 4,
      name: "Solana",
      symbol: "SOL",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 5,
      name: "Cardano",
      symbol: "ADA",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    { id: 6, name: "XRP", symbol: "XRP", price: 0, marketCap: 0, change24h: 0 },
    {
      id: 7,
      name: "Polkadot",
      symbol: "DOT",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 8,
      name: "Dogecoin",
      symbol: "DOGE",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 9,
      name: "Avalanche",
      symbol: "AVAX",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 10,
      name: "Polygon",
      symbol: "MATIC",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 11,
      name: "Chainlink",
      symbol: "LINK",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 12,
      name: "Litecoin",
      symbol: "LTC",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 13,
      name: "Uniswap",
      symbol: "UNI",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 14,
      name: "Bitcoin Cash",
      symbol: "BCH",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
    {
      id: 15,
      name: "Stellar",
      symbol: "XLM",
      price: 0,
      marketCap: 0,
      change24h: 0,
    },
  ];

  // Generate random price
  const generateRandomPrice = () => {
    return (Math.random() * 100000).toFixed(2);
  };

  // Generate random market cap
  const generateRandomMarketCap = (price) => {
    return (price * (Math.random() * 100 + 10)).toFixed(2);
  };

  // Generate random 24h change
  const generateRandom24hChange = () => {
    return (Math.random() * 20 - 10).toFixed(2);
  };

  // Generate new data with random values
  const generateNewData = () => {
    const newData = cryptoList.slice(0, rowCount).map((crypto) => {
      const price = generateRandomPrice();
      return {
        ...crypto,
        price,
        marketCap: generateRandomMarketCap(price),
        change24h: generateRandom24hChange(),
      };
    });
    setData(newData);
    onSelectedRowsChange(new Set());
  };

  // Generate initial data
  useEffect(() => {
    generateNewData();
  }, [rowCount]);

  // When a row is clicked, toggle selection via the App handler
  const handleRowSelect = (id) => {
    onSelectedRowsChange(id);
  };

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      onSelectedRowsChange(new Set(filteredData.map((item) => item.id)));
    } else {
      onSelectedRowsChange(new Set());
    }
  };

  // Handle sort
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num;
  };

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (
      sortField === "price" ||
      sortField === "marketCap" ||
      sortField === "change24h"
    ) {
      return sortDirection === "asc"
        ? parseFloat(aValue) - parseFloat(bValue)
        : parseFloat(bValue) - parseFloat(aValue);
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return bValue > aValue ? 1 : -1;
    }
  });

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex gap-4 items-center">
          <button onClick={generateNewData}>Refresh Data</button>
          <div className="flex items-center gap-4">
            <label htmlFor="rowCount">Rows:</label>
            <input
              type="number"
              id="rowCount"
              value={rowCount}
              onChange={(e) =>
                setRowCount(
                  Math.max(1, Math.min(15, parseInt(e.target.value) || 1))
                )
              }
              min="1"
              max="15"
            />
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedRows.size === filteredData.length &&
                    filteredData.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                # {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                Name{" "}
                {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("price")}
                style={{ cursor: "pointer" }}
              >
                Price (USD){" "}
                {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("change24h")}
                style={{ cursor: "pointer" }}
              >
                24h Change{" "}
                {sortField === "change24h" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("marketCap")}
                style={{ cursor: "pointer" }}
              >
                Market Cap{" "}
                {sortField === "marketCap" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr
                key={item.id}
                className={selectedRows.has(item.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.name)}
                    onChange={() => handleRowSelect(item.name)}
                  />
                </td>
                <td>{item.id}</td>
                <td>
                  <div className="flex">
                    <span style={{ fontWeight: "bold" }}>{item.name}</span>
                    <span style={{ marginLeft: "0.5rem", color: "#6b7280" }}>
                      {item.symbol}
                    </span>
                  </div>
                </td>
                <td>${parseFloat(item.price).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      parseFloat(item.change24h) >= 0
                        ? "badge-green"
                        : "badge-red"
                    }`}
                  >
                    {parseFloat(item.change24h) >= 0 ? "+" : ""}
                    {item.change24h}%
                  </span>
                </td>
                <td>${formatNumber(item.marketCap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRows.size > 0 && (
        <div className="selected-info">
          <span>Selected: {selectedRows.size}</span>
          <button
            onClick={() => onSelectedRowsChange(new Set())}
            style={{
              marginLeft: "1rem",
              color: "#3b82f6",
              background: "transparent",
            }}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default ListData;
