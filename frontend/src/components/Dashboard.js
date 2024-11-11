// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch('http://localhost:5000/api/market_data');
        console.log('Response:', response);
        const data = await response.json();
        console.log('Data:', data);

        if (data.status === 'success') {
          setMarketData(data.data);
        } else {
          setError(data.message || 'Failed to fetch data');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to connect to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Singapore Market Dashboard</h1>
      
      {/* STI Index */}
      {marketData?.sti && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8 hover:bg-gray-700 transition-colors duration-200">
          <h2 className="text-xl font-semibold mb-4">STI Index</h2>
          <div className="text-4xl font-bold">
            {marketData.sti.price.toLocaleString()}
            <span className={`ml-4 text-2xl ${
              marketData.sti.change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {marketData.sti.change >= 0 ? '+' : ''}
              {marketData.sti.changePercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-gray-400 mt-2">
            Last updated: {new Date(marketData.sti.lastUpdate).toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Stocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketData?.stocks && Object.entries(marketData.stocks).map(([symbol, data]) => (
          <div 
            key={symbol} 
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200"
          >
            <h3 className="text-xl font-semibold">{data.name}</h3>
            <p className="text-3xl font-bold mt-2">
              ${data.price.toLocaleString()}
            </p>
            <p className={`mt-2 ${
              data.change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {data.change >= 0 ? '+' : ''}
              {data.changePercent.toFixed(2)}%
            </p>
            <p className="text-gray-400 mt-2">
              Volume: {data.volume.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;