import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";


const BasicNominalStats = ({ stats, nominalFeatures, feature, onChangeFeature }) => {
  const ref = useRef();
  const { events } = useDraggable(ref);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5, triggerOnce: true });


  const variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      className="font-source border-[#C5C6C7] border-solid border-[2px] rounded-lg shadow-lg bg-gray-100 p-6 m-5"
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      ref={inViewRef}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Nominal Fields</h2>
      <motion.div
        className="flex flex-row overflow-x-auto pb-2 mb-4"
        {...events}
        ref={ref}
      >
        {nominalFeatures.map((feat) => (
          <motion.button
            key={feat}
            className={`text-md font-semibold px-3 py-2 rounded-lg mr-2 focus:outline-none ${feat === feature
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => onChangeFeature(feat)}
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 0.9 }}
          >
            {feat}
          </motion.button>
        ))}
      </motion.div>
      {stats[feature] && (
        <motion.table
          className="text-lg font-bold w-full text-left"
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          <tbody>
            <tr>
              <td className="pr-4 text-gray-700">Mode:</td>
              <td className="text-gray-900">{stats[feature].mode}</td>
            </tr>
            <tr>
              <td className="pr-4 text-gray-700">Entropy:</td>
              <td className="text-gray-900">{stats[feature].entropy}</td>
            </tr>
            <tr>
              <td className="pr-4 text-gray-700">Distinct Values:</td>
              <td className="text-gray-900">
                <motion.div
                  className="flex flex-col h-36 overflow-y-auto border-solid border-[2px] rounded-lg px-3 py-2 my-3"
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                >
                  {stats[feature].distinctValues.map((value, index) => (
                    <div key={index} className="py-1">
                      {value}
                    </div>
                  ))}
                </motion.div>
              </td>
            </tr>
            <tr>
              <td className="pr-4 text-gray-700">Frequency Percentages:</td>
              <td className="text-gray-900">
                <motion.div
                  className="flex flex-col h-36 overflow-y-auto px-3 py-2 border-solid border-[2px] rounded-lg"
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                >
                  {Object.entries(stats[feature].frequencyPercentages).map((entry, index) => (
                    <div key={index} className="flex flex-row py-1">
                      <div className="w-1/2">{entry[0]}</div>
                      <div className="w-1/2">{entry[1].toFixed(2)}%</div>
                    </div>
                  ))}
                </motion.div>
              </td>
            </tr>
          </tbody>
        </motion.table>
      )}
    </motion.div>
  );
};

export default BasicNominalStats;