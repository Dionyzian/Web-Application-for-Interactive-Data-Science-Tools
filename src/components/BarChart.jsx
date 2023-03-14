import ReactApexChart from "react-apexcharts"

const BarChart = ({ data, nominalFeature }) => {
  const counts = {};
  data.forEach((d) => {
    const value = d[nominalFeature];
    counts[value] = (counts[value] || 0) + 1;
  });
  const dataCounts = Object.keys(counts).map((key) => ({ name: key, count: counts[key] }));

  let series = dataCounts.map((row) => {
    return row.count
  })

  series = [{ data: series }]

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
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: dataCounts.map((row) => {
        return row.name
      }),
    }
  }

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  )
}

export default BarChart