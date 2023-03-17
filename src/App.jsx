import React, { useState, useEffect, useCallback } from 'react';
import CsvInput from './components/CsvInput';
import {
  findMissingElements,
  getJsonFeatureTypes,
  getBasicStats,
  getCorrelations,
  getNominalStats
} from './utils/CsvUtils'

import PaginatedTable from './components/PaginatedTable';

import MissingData from './components/MissingData';

import ScatterPlot from './components/ScatterPlot';
import Histogram from './components/Histogram';
import BarChart from './components/BarChart';

import NumericalBasicStats from './components/BasicNumericalStats';
import BasicNominalStats from './components/BasicNominalStats';
import DataTransformation from './components/DataTransformation';

import { ReactComponent as CloudArrowUp } from "./assets/cloud-arrow-up.svg";
import { ReactComponent as CleaningService } from "./assets/cleaning-services-icon.svg";
import { ReactComponent as BarChartIcon } from "./assets/barchart-icon.svg";
import { ReactComponent as CalculatorIcon } from "./assets/calculator-icon.svg";


function App() {
  const [jsonData, setJsonData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [dataFeatureTypes, setDataFeatureTypes] = useState({});
  const [missingData, setMissingData] = useState({});
  const [numericalFeature, setNumericalFeature] = useState('');
  const [nominalFeature, setNominalFeature] = useState('');
  const [basicNumericalStats, setBasicNumericalStats] = useState({});
  const [basicNominalStats, setBasicNominalStats] = useState({});
  const [numScatterPlots, setNumScatterPlots] = useState(1);
  const [key, setKey] = useState(true)
  const [loaded, setLoaded] = useState(false);

  const handleCsvUpload = useCallback((data) => {
    setLoaded(false);

    const newJsonData = data.data;
    setJsonData(newJsonData);
    setOriginalData(newJsonData);

    const newFeatureTypes = getJsonFeatureTypes(newJsonData);
    setDataFeatureTypes(newFeatureTypes);

    setNumericalFeature(newFeatureTypes.numerical[0]);
    setNominalFeature(newFeatureTypes.nominal[0]);

    setBasicNumericalStats(getBasicStats(newJsonData, newFeatureTypes.numerical));
    setBasicNominalStats(getNominalStats(newJsonData, newFeatureTypes.nominal));

    setMissingData(findMissingElements(newJsonData, data.headers));

    setNumScatterPlots(1);

    setKey(key => !key);

    setLoaded(true);
  }, []);


  useEffect(() => {
    if (jsonData.length > 0) {
      const newFeatureTypes = getJsonFeatureTypes(jsonData);
      setDataFeatureTypes(newFeatureTypes);
      setBasicNumericalStats(getBasicStats(jsonData, newFeatureTypes.numerical));
      setBasicNominalStats(getNominalStats(jsonData, newFeatureTypes.nominal));
    }
  }, [jsonData]);


  const handleChangeData = useCallback((newData) => {
    setJsonData(newData);
  }, []);

  const handleAddScatterPlot = useCallback(() => {
    setNumScatterPlots(numScatterPlots => numScatterPlots + 1);
  }, []);

  const handleChangeNumericalFeature = useCallback((newFeature) => {
    setNumericalFeature(newFeature);
  }, []);

  const handleChangeNominalFeature = useCallback((newFeature) => {
    setNominalFeature(newFeature)
  }, []);

  return (
    <div className='flex-col flex bg-[#F8F9FA] mx-4 my-6 md:ml-[5em] md:mr-[5em] pt-5 pb-5 min-h-screen'>
      <h1 className='text-[#0077C2] mb-6 text-3xl md:text-6xl lg:text-5xl font-source font-black text-center md:text-left main-header '><span>Interactive</span><span> Data</span><span> Science</span><span> Tools</span></h1>

      <div className='flex items-center justify-center md:justify-start'>
        <h2 className='text-[#524E54] text-xl md:text-3xl font-source font-bold text-center md:text-left'>Import your data </h2>
        <CloudArrowUp className='hero-icon w-6 h-6 mr-2 ml-2' />
      </div>

      <h2 className='text-[#524E54] text-xl md:text-3xl font-source font-bold text-center md:text-left'>Clean, visualize and analyze it through various</h2>

      <div className='flex items-center justify-center md:justify-start'>

        <h2 className='text-[#524E54] text-xl md:text-3xl font-source font-bold ml-4 md:ml-12 text-center md:text-left'>available processes</h2>
        <CleaningService className='hero-icon' />
        <BarChartIcon className='hero-icon' />
        <CalculatorIcon className='hero-icon ml-3' />
      </div>

      <div className='mx-auto lg:mx-0 mt-[5em] mb-[1em]'>
        <CsvInput onUpload={handleCsvUpload} />
      </div>



      {loaded && dataFeatureTypes.numerical.length >= 2 &&
        <div key={key} className='fade-in'>



          <PaginatedTable jsonData={jsonData} numericalFeatures={dataFeatureTypes.numerical} nominalFeatures={dataFeatureTypes.nominal} />

          <h3 className='text-[#1D2B53] mt-3 text-xl md:text-4xl font-source text-center font-bold '>Data Preprocessing</h3>
          <DataTransformation data={jsonData} numericalFeatures={dataFeatureTypes.numerical} nominalFeatures={dataFeatureTypes.nominal} onDataChange={handleChangeData} numericalStats={basicNumericalStats} originalData={originalData} />

          <h3 className='text-[#1D2B53] mt-3 text-xl md:text-4xl font-source text-center font-bold '>Handling Missing Data</h3>
          <MissingData data={missingData} headers={[...dataFeatureTypes.numerical, ...dataFeatureTypes.nominal]} />

          <h3 className='text-[#1D2B53] mt-3 text-xl md:text-4xl font-source text-center font-bold '>Basic Descriptive Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 overflow-hidden">
            <div className="aspect-w-1 aspect-h-1">
              <NumericalBasicStats onChangeFeature={handleChangeNumericalFeature} feature={numericalFeature} numericalFeatures={dataFeatureTypes.numerical} stats={basicNumericalStats} />
            </div>

            <div className="aspect-w-1 aspect-h-1 mt-auto mb-auto" >
              <Histogram feature={numericalFeature} data={jsonData} numericalFeatures={dataFeatureTypes.numerical} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 overflow-hidden">
            <div className="aspect-w-1 aspect-h-1 order-1 lg:order-2">
              <BasicNominalStats nominalFeatures={dataFeatureTypes.nominal} stats={basicNominalStats} feature={nominalFeature} onChangeFeature={handleChangeNominalFeature} />
            </div>

            <div className="aspect-w-1 aspect-h-1 mt-auto mb-auto order-2 sm:order-1">
              <BarChart data={jsonData} nominalFeature={nominalFeature} />
            </div>
          </div>

          <div className='flex flex-wrap justify-center mt-2'>
            {Array.from({ length: numScatterPlots }).map((_, index) => (
              <div key={index} className='w-full sm:w-3/4 lg:w-1/2 xl:w-1/2 p-2 sm:p-4 lg:p-6 xl:p-8'>
                <ScatterPlot data={jsonData} numericalFeatures={dataFeatureTypes.numerical} stats={basicNumericalStats} />
              </div>
            ))}
          </div>

          <button
            onClick={handleAddScatterPlot}
            className="block mx-auto md:w-[20%] w-full bg-[#005792] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Scatter Plot
          </button>
        </div>
      }

    </div>
  );
}

export default App