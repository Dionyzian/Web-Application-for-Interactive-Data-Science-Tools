import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";


const MissingData = ({ data, headers }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true });


  const featureCounts = headers.reduce((counts, header) => {
    counts[header] = 0;
    data.forEach((item) => {
      if (item.missing.includes(header)) {
        counts[header]++;
      }
    });
    return counts;
  }, {});

  const filteredData = selectedFeature
    ? data.filter((item) => item.missing.includes(selectedFeature))
    : [];

  return (
    <motion.div className="flex flex-col lg:flex-row lg:max-h-[50vh]"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      ref={ref}>
      <div className="max-h-[50vh] w-full lg:w-2/5 bg-gray-100 border-[#C5C6C7] border-solid border-[2px] rounded-lg shadow-lg px-6 pb-6 m-5 overflow-y-scroll overflow-x-scroll">
        <h2 className="sticky top-0 bg-gray-100 pt-6 pb-3 px- text-3xl font-bold font-source mb-4 text-gray-800">
          Missing Data
        </h2>
        <table className="w-full text-lg text-left font-source">
          <tbody>
            {headers.map((header) => (
              <motion.tr
                key={header}
                className={`${featureCounts[header] > 0 ? "text-red-700" : "text-green-700"
                  } cursor-pointer hover:text-blue-500 transition-colors duration-300 ease-in-out`}
                onClick={() => setSelectedFeature(header)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.td className="pr-4 py-1 text-lg font-bold" layout>{header.toUpperCase()}:</motion.td>
                <motion.td className="py-1 text-lg font-bold" layout>{featureCounts[header]}</motion.td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="max-h-[50vh] w-full lg:w-3/5 bg-gray-100 border-[#C5C6C7] border-solid border-[2px] rounded-lg shadow-lg p-6 m-5 overflow-y-scroll overflow-x-scroll max-w-full">
        <h2 className="text-3xl font-bold font-source mb-4 text-gray-800">
          {selectedFeature ? `Missing Data for ${selectedFeature}` : "Data"}
        </h2>
        <AnimatePresence>
          {filteredData.length > 0 ? (
            <motion.table className="w-full text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <thead>
                <tr className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  {headers.map((header) => (
                    <th key={header} className="py-3 border-b border-gray-200">
                      {header.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-900 divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <motion.tr key={index} className="hover:bg-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {headers.map((header) => (
                      <motion.td key={header} className="py-4 px-6" layout>
                        {item.item[header] || "N/A"}
                      </motion.td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          ) : (
            <motion.p className="text-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {selectedFeature
                ? `No missing data found for ${selectedFeature}`
                : "No missing data found"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div >
  );
};

export default MissingData;
