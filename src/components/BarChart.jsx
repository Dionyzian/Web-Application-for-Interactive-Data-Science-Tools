import React, { useCallback } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useCurrentPng } from 'recharts-to-png';
import { saveAs } from 'file-saver';
import { ReactComponent as DownloadIcon } from '../assets/download-icon.svg'


const BarChartComponent = ({ data, nominalFeature }) => {
  const [getPng, { ref, isLoading }] = useCurrentPng();

  const handleDownload = useCallback(async () => {
    const png = await getPng();

    if (png) {
      saveAs(png, 'myChart.png');
    }
  }, [getPng]);


  const counts = {};
  data.forEach((d) => {
    const value = d[nominalFeature];
    counts[value] = (counts[value] || 0) + 1;
  });
  const dataCounts = Object.keys(counts).map((key) => ({ name: key, count: counts[key] }));

  return (
    <>
      <div className='relative'>
        <DownloadIcon onClick={handleDownload} className="absolute top-[25px] right-[17%] z-50 download-icon" />
        <ResponsiveContainer width="90%" height={350}>
          <BarChart ref={ref} data={dataCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
      </div>
    </>

  );
};

export default BarChartComponent;
