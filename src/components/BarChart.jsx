import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = ({ data, nominalFeature }) => {
  const counts = {};
  data.forEach((d) => {
    const value = d[nominalFeature];
    counts[value] = (counts[value] || 0) + 1;
  });
  const dataCounts = Object.keys(counts).map((key) => ({ name: key, count: counts[key] }));

  return (
    <ResponsiveContainer width="90%" height={350}>
      <BarChart data={dataCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          interval={0}
          angle={-45}
          textAnchor='end'
          height={85}
          tick={{ dx: 15 }}
        />
        <YAxis />
        <Tooltip />

        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
