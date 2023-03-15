import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const CorrelationHeatmap = (props) => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    const data = props.data;

    const seriesData = Object.keys(data).map((key1, i) => ({
      name: key1,
      data: Object.keys(data).map((key2, j) => data[key1][key2].toFixed(2))
    }));

    const minValue = Math.min(...Object.values(data).map(obj => Math.min(...Object.values(obj))));
    const maxValue = Math.max(...Object.values(data).map(obj => Math.max(...Object.values(obj))));

    setSeries(seriesData);
    setOptions({
      chart: {
        height: 350,
        type: 'heatmap',
      },
      dataLabels: {
        enabled: false
      },
      colors: {
        ranges: [{
          from: minValue,
          to: 0,
          color: '#f44336' // red
        }, {
          from: 0,
          to: maxValue,
          color: '#2196f3' // blue
        }],
      },
      xaxis: {
        categories: Object.keys(data)
      },
      yaxis: {
        categories: Object.keys(data),
        reversed: true
      },
    });
  }, [props.data]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="heatmap" height={350} />
    </div>
  );
};

export default CorrelationHeatmap;
