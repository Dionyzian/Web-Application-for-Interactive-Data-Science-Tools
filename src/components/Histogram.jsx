import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Line, Label, ResponsiveContainer } from 'recharts';


const Histogram = ({ jsonData, feature, numericalFeatures }) => {
    // Updated feature state from BasicStats component, continue from this //

    const featureValues = [];
    for (let obj of jsonData) {
        if (obj.hasOwnProperty(feature) && !isNaN(obj[feature]) && obj[feature]) {
            featureValues.push(obj[feature]);
        }
    }
    // Setting up the histogram data according to the number of bins 
    const bins = 12;
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
    );
};

export default Histogram;
