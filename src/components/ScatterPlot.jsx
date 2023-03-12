import { useState, useEffect, useCallback } from 'react';
import {
  ScatterChart,
  ReferenceLine,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import SelectOpt from './SelectOpt';
import { useCurrentPng } from 'recharts-to-png';
import { ReactComponent as DownloadIcon } from '../assets/download-icon.svg'


const ScatterPlot = ({ data, stats, numericalFeatures }) => {
  const [x, setX] = useState(numericalFeatures[0]);
  const [y, setY] = useState(numericalFeatures[1]);
  const [minX, setMinX] = useState(Math.floor(stats[numericalFeatures[0]].min));
  const [maxX, setMaxX] = useState(stats[numericalFeatures[0]].max);
  const [minY, setMinY] = useState(Math.floor(stats[numericalFeatures[1]].min));
  const [maxY, setMaxY] = useState(stats[numericalFeatures[1]].max);
  const [getPng, { ref, isLoading }] = useCurrentPng();



  useEffect(() => {
    setX(numericalFeatures[0]);
    setY(numericalFeatures[1]);
    setMinX(Math.floor(stats[numericalFeatures[0]].min));
    setMaxX(Math.round(stats[numericalFeatures[0]].max));
    setMinY(Math.floor(stats[numericalFeatures[1]].min));
    setMaxY(Math.round(stats[numericalFeatures[1]].max));
  }, [numericalFeatures, stats]);

  const handleChangeX = (e) => {
    console.log('x changed');

    setX(e.target.value);
    setMinX(Math.floor(stats[e.target.value].min));
    setMaxX(Math.ceil(stats[e.target.value].max));
  };

  const handleChangeY = (e) => {
    console.log('y changed');
    setY(e.target.value);
    setMinY(Math.floor(stats[e.target.value].min));
    setMaxY(Math.ceil(stats[e.target.value].max));
  };

  const handleDownload = useCallback(async () => {
    const png = await getPng();

    if (png) {
      saveAs(png, 'myChart.png');
    }
  }, [getPng]);

  return (
    <div className='rounded-[1.5em] flex-col pt-4 pb-4 w-[100%] mt-2 animate-fade-in-up'>
      <div className='relative aspect-w-1 aspect-h-1'>
        <DownloadIcon onClick={handleDownload} className="absolute top-[22px] right-[6%] z-50 download-icon" />
        <ResponsiveContainer width='100%' aspect={1.5}>
          <ScatterChart
            ref={ref}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis
              domain={[minX, maxX]}
              type='number'
              dataKey={x}
              name={x}
              label={{ value: x, position: 'bottom' }}
            />
            <YAxis
              domain={[minY, maxY]}
              type='number'
              dataKey={y}
              name={y}
              label={{ value: y, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />

            {minX < 0 && (
              <ReferenceLine
                y={0}
                stroke='gray'
                strokeWidth={1.5}
                strokeOpacity={1}
              />
            )}
            {minY < 0 && (
              <ReferenceLine
                x={0}
                stroke='gray'
                strokeWidth={1.5}
                strokeOpacity={1}
              />
            )}

            <Scatter name='' data={data} fill='#8884d8' />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className='flex justify-center mt-3 gap-3'>
        <SelectOpt
          features={numericalFeatures}
          onChangeFeature={handleChangeX}
          initialValue={x}
          label='X : '
        />
        <SelectOpt
          features={numericalFeatures}
          onChangeFeature={handleChangeY}
          initialValue={y}
          label='Y : '
        />
      </div>
    </div>
  );
}

export default ScatterPlot;