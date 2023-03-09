import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Line, Label, ResponsiveContainer } from 'recharts';

const Histogram = ({ jsonData, feature, numericalFeatures }) => {
    const [bins, setBinsNum] = useState(10)

    const handleChangeBinsNum = (event) => {
        setBinsNum(parseInt(event.target.value));
    }

    const featureValues = [];
    for (let obj of jsonData) {
        if (obj.hasOwnProperty(feature) && !isNaN(obj[feature]) && obj[feature]) {
            featureValues.push(obj[feature]);
        }
    }
    // Setting up the histogram data according to the number of bins 
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

    return (
        <div className='rounded-[1.5em] flex-col pt-4 pb-4 w-[100%] mt-2'>
            <ResponsiveContainer width="90%" height={350}>
                <BarChart data={histogramData} barCategoryGap='1%'>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="bin"
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
    );
};

export default Histogram;
