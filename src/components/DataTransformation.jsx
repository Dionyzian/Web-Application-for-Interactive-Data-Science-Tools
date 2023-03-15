import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  standardizeData,
  normalizeDataMinMax,
  logTransformData,
  exponentialTransform,
  oneHotEncode
} from "../utils/CsvUtils";




const DataTransformation = ({ data, originalData, numericalFeatures, nominalFeatures, onDataChange, numericalStats }) => {
  const [selectedTransformation, setSelectedTransformation] = useState(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5, triggerOnce: true });

  const transformations = [
    {
      name: "Scaling and Normalization",
      options: ["Min-Max", "Standardization", "Log", "Exp"],
      icon: <FaPlus className="mr-2" />,
    },
    {
      name: "Encoding Categorical Variables",
      options: ["One-Hot Encoding"],
      icon: <FaPlus className="mr-2" />,
    },
    {
      name: "Outlier Detection",
      options: ["Using Z-Score", "Using IQR"],
      icon: <FaPlus className="mr-2" />,
    },
    {
      name: "Dimensionality Reduction",
      options: ["PCA"],
      icon: <FaPlus className="mr-2" />,
    },
  ];

  const handleTransformationClick = (name) => {
    if (selectedTransformation === name) {
      setSelectedTransformation(null);
    } else {
      setSelectedTransformation(name);
    }
  };

  const handleTransformData = (transformationName) => {
    let newData = []

    switch (transformationName) {
      case "Standardization":
        newData = standardizeData(data, numericalStats)
        break
      case "Min-Max":
        newData = normalizeDataMinMax(data, numericalStats)
        break
      case "Log":
        newData = logTransformData(data, numericalStats)
        break
      case "Exp":
        newData = exponentialTransform(data, numericalFeatures)
        break
      case "One-Hot Encoding":
        newData = oneHotEncode(data, nominalFeatures)
        break
      case "Using Z-Score":
        break
      case "Using IQR":
        break
      case "PCA":
        break
      case "Reset":
        newData = originalData
        break
    }

    console.log(newData)

    onDataChange(newData)
  }

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const buttonVariant = {
    initial: {
      backgroundColor: "#E5E7EB",
    },
    hover: {
      backgroundColor: "#9CA3AF",
    },
    selected: {
      backgroundColor: "#9CA3AF",
    },
  };

  return (
    <div className="flex flex-col items-center mt-3" ref={inViewRef}>
      {transformations.map((transformation) => (
        <div
          key={transformation.name}
          className="w-[80%] lg:w-[60%] my-1 rounded-md shadow-md overflow-hidden"
        >
          <motion.div
            className="flex items-center justify-between cursor-pointer bg-gray-200 py-2 px-4"
            onClick={() => handleTransformationClick(transformation.name)}
            variants={buttonVariant}
            initial="initial"
            whileHover="hover"
            whileTap="selected"
            animate={selectedTransformation === transformation.name ? "selected" : "initial"}
          >
            <motion.h3 className="text-lg font-semibold">{transformation.name}</motion.h3>
            <motion.span animate={{ rotate: selectedTransformation === transformation.name ? -45 : 0 }}>
              {selectedTransformation === transformation.name ? <FaMinus /> : transformation.icon}
            </motion.span>
          </motion.div>
          {selectedTransformation === transformation.name && (
            <motion.div
              className="px-4 py-2 bg-gray-100"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              exit={{ opacity: 0 }}
            >
              {transformation.options.map((option, index) => (
                <motion.button
                  key={option}
                  className="flex items-center justify-center my-2 w-full px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-white bg-white hover:bg-gray-700 border border-gray-300 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 * index }}
                  onClick={() => handleTransformData(option)}
                >
                  {option}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>

      ))}
      <motion.button
        key={"Reset"}
        className="flex items-center justify-center my-2 w-[20%] px-4 py-2 rounded-md text-sm font-medium bg-[#005792] hover:bg-blue-700 text-white border border-gray-300 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 * 5 }}
        onClick={() => handleTransformData('Reset')}
      >
        Reset
      </motion.button>
    </div>
  );
};

export default DataTransformation;
