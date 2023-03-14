import ReactApexChart from "react-apexcharts"
import { useState } from "react";

const Histogram = ({ data, feature, numericalFeatures }) => {

  const [bins, setBinsNum] = useState(10)

  const handleChangeBinsNum = (event) => {
    setBinsNum(parseInt(event.target.value));
  }

  const featureValues = [];
  for (let obj of data) {
    if (obj.hasOwnProperty(feature) && !isNaN(obj[feature]) && obj[feature]) {
      featureValues.push(obj[feature]);
    }
  }
  const histogramData = [];
  const [min, max] = [Math.min(...featureValues), Math.max(...featureValues)];
  const binSize = (max - min) / bins;

  for (let i = 0; i < bins; i++) {
    const binStart = min + binSize * i;
    const binEnd = binStart + binSize;
    const count = featureValues.filter((x) => x >= binStart && x < binEnd).length;

    histogramData.push({
      bin: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
      count,
    });
  }

  console.log(histogramData)

  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false, // set horizontal to false
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: histogramData.map((row) => {
        return row.bin
      }),
    }
  }

  let series = histogramData.map((row) => {
    return row.count
  })

  series = [{ data: series }]


  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={350} />

      <div className="flex flex-col items-center lg:flex-row lg:justify-center">
        <label htmlFor="bins" className="text-center mb-2 lg:mr-2">
          Number of bins:
        </label>
        <select
          id="bins"
          value={bins}
          onChange={handleChangeBinsNum}
          className=" block appearance-none text-center lg:w-[8%] py-2 px-3 bg-gray-100 border border-gray-300 hover:border-gray-500 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          {[...Array(20)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Histogram