import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import SelectOpt from "./SelectOpt";

const ScatterPlot = ({ data, numericalFeatures }) => {
  const [x, setX] = useState(numericalFeatures[0]);
  const [y, setY] = useState(numericalFeatures[1]);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "scatter",
      zoom: {
        enabled: true,
        type: "xy",
      },
    },
    xaxis: {
      tickAmount: 10,

    },
    yaxis: {
      tickAmount: 7,
    },
  });

  useEffect(() => {
    const seriesData = getNumericPairs(data, x, y);
    setSeries([{ data: seriesData }]);
  }, [data, x, y]);

  function getNumericPairs(data, col1, col2) {
    const pairs = [];
    for (const item of data) {
      const val1 = parseFloat(item[col1]);
      const val2 = parseFloat(item[col2]);
      if (!isNaN(val1) && !isNaN(val2)) {
        pairs.push([val1, val2]);
      }
    }
    return pairs;
  }

  const handleChangeX = (e) => {
    setX(e.target.value);
  };

  const handleChangeY = (e) => {
    setY(e.target.value);
  };

  return (
    <div id="chart" className="rounded-[1.5em] flex-col pt-4 pb-4 w-[100%] mt-2 animate-fade-in-up">
      <ReactApexChart
        options={options}
        series={series}
        type="scatter"
        height={350}
      />
      <div className="flex justify-center mt-3 gap-3">
        <SelectOpt
          features={numericalFeatures}
          onChangeFeature={handleChangeX}
          initialValue={x}
          label="X : "
        />
        <SelectOpt
          features={numericalFeatures}
          onChangeFeature={handleChangeY}
          initialValue={y}
          label="Y : "
        />
      </div>
    </div>
  );
};

export default ScatterPlot;
