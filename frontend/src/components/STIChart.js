import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const STIChart = ({ data }) => {
  const chartData = data.history ? data.history : [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="time" hide />
        <YAxis domain={['auto', 'auto']} hide />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem'
          }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#60A5FA"
          fillOpacity={1}
          fill="url(#colorPrice)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default STIChart;