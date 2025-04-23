import { useState } from 'react'
import Line from './charts/Line'
import ListData from './charts/ListData'

function App() {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectedRowsChange = (payload) => {
    // If payload is a Set, replace the entire selection (e.g., clear or select all)
    if (payload instanceof Set) {
      setSelectedRows(payload);
    } else {
      // Otherwise, payload is a single row id to toggle
      const id = payload;
      setSelectedRows(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>Crypto Dashboard</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container">
        <div className="dashboard">
          {/* Chart Section */}
          <div className="chart-container">
            <h2>Market Overview</h2>
            <Line selectedRows={selectedRows} />
          </div>
          
          {/* Data Table */}
          <div className="data-table">
            <h2>Cryptocurrency List</h2>
            <ListData 
              selectedRows={selectedRows}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Crypto Dashboard © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
