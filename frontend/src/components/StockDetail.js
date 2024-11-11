import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StockChart from './StockChart';
import TechnicalIndicators from './TechnicalIndicators';

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stock_analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbol }),
        });
        const data = await response.json();
        if (data.status === 'success') {
          setStockData(data.data);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Stock Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{stockData.companyName}</h1>
          <div className="mt-4">
            <span className="text-5xl font-bold">${stockData.currentPrice}</span>
            <span className={`ml-4 text-2xl ${
              stockData.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stockData.change >= 0 ? '+' : ''}
              {stockData.changePercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-gray-400 mt-2">
            Volume: {stockData.volume.toLocaleString()}
          </p>
        </div>

        {/* Price Chart */}
        <div className="mb-8">
          <StockChart data={stockData.priceHistory} />
        </div>

        {/* Technical Indicators */}
        <TechnicalIndicators data={stockData.technicalIndicators} />

        {/* AI Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 mt-8"
        >
          <h2 className="text-xl font-bold mb-4">AI Analysis</h2>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line">{stockData.analysis}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StockDetail;