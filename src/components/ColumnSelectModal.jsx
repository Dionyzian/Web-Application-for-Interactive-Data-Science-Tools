import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const ColumnSelectModal = ({ isOpen, closeModal, features, handleTransformData }) => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFeatureClick = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleApply = () => {
    handleTransformData(selectedFeatures);
    closeModal();
  };

  const handleClear = () => {
    setSelectedFeatures([]);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="font-source text-xl bg-white rounded-md shadow-lg overflow-hidden max-w-md w-full"
            initial={{ y: "-50%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-50%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between bg-gray-100 py-4 px-6">
              <h3 className="font-source text-2xl font-bold text-gray-800">Select Features</h3>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                <FaTimes />
              </button>
            </div>
            <div className="px-6 py-4">
              {features.map((feature) => (
                <button
                  key={feature}
                  className={`flex items-center justify-between my-2 w-full px-4 py-2 rounded-md text-xl font-medium ${selectedFeatures.includes(feature)
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  onClick={() => handleFeatureClick(feature)}
                >
                  <span className="text-gray-800">{feature}</span>
                  {selectedFeatures.includes(feature) && (
                    <span className="text-white font-bold text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-end bg-gray-100 py-4 px-6">
              <button
                className="px-4 py-2 mr-2 rounded-md text-sm font-medium text-gray-700 hover:text-white bg-white hover:bg-gray-700 border border-gray-300 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                onClick={handleClear}
              >
                Clear Selection
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 border border-gray-300 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                onClick={handleApply}
              >
                Apply Selection
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );

};

export default ColumnSelectModal;
