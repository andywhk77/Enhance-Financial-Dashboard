import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StockChart = ({ data }) => {
  const chartData = data.dates.map((date, i) => ({
    date,
    price: data.prices[i],
    ma20: data.ma20[i],
    ma50: data.ma50[i],
    volume: data.volumes[i]
  }));

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Price History</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem'
              }}
            />
            <Legend />
            <Line 
              type="monotone"
              dataKey="price"
              stroke="#60A5FA"
              dot={false}
              name="Price"
            />
            <Line 
              type="monotone"
              dataKey="ma20"
              stroke="#34D399"
              dot={false}
              name="MA20"
            />
            <Line 
              type="monotone"
              dataKey="ma50"
              stroke="#F87171"
              dot={false}
              name="MA50"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;