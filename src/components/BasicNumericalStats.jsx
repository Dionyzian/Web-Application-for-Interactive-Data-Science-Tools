import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";



const NumericalBasicStats = ({ stats, numericalFeatures, feature, onChangeFeature }) => {
  const ref = useRef();
  const { events } = useDraggable(ref);

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5, // trigger animation when 20% of the component is visible
    triggerOnce: true, // trigger animation only once
  });

  if (!stats) {
    return <div>Loading...</div>;
  }

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.2
      }
    }
  };

  const rowVariants = {
    hidden: {
      opacity: 0,
      x: 50
    },
    visible: {
      opacity: 1,
      x: 0
    }
  };

  return (
    <motion.div
      className=" font-source bg-gray-100 border-[#C5C6C7] border-solid border-[2px] rounded-lg shadow-lg p-6 m-5 aspect-w-1 aspect-h-1"
      variants={containerVariants}
      initial={inView ? "visible" : "hidden"}
      animate={inView ? "visible" : "hidden"}
      exit="hidden"
      ref={inViewRef}
    >
      <motion.h2
        className="text-3xl font-bold font-source mb-4 text-gray-800"
        variants={rowVariants}
      >
        Numerical Fields
      </motion.h2>

      <motion.div
        className="flex flex-row overflow-x-auto pb-2 mb-4"
        {...events}
        ref={ref}
        variants={rowVariants}
      >
        {numericalFeatures.map((feat) => (
          <motion.button
            key={feat}
            className={`text-md font-semibold px-3 py-2 rounded-lg mr-2 focus:outline-none ${feat === feature ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            onClick={() => onChangeFeature(feat)}
            variants={rowVariants}
          >
            {feat}
          </motion.button>
        ))}
      </motion.div>

      <motion.table
        className=" text-lg font-bold w-full text-left"
        variants={rowVariants}
      >
        <motion.tbody>
          {stats[feature] ? (
            <>
              <motion.tr>
                <motion.td className=" pr-4 text-gray-700">Max:</motion.td>
                <motion.td className="text-gray-900">{stats[feature].max}</motion.td>
              </motion.tr>
              <motion.tr>
                <motion.td className=" pr-4 text-gray-700">Mean:</motion.td>
                <motion.td className="text-gray-900">{stats[feature].mean}</motion.td>
              </motion.tr>
              <motion.tr>
                <motion.td className=" pr-4 text-gray-700">Median:</motion.td>
                <motion.td className="text-gray-900">{stats[feature].median}</motion.td>
              </motion.tr>
              <motion.tr>
                <motion.td className=" pr-4 text-gray-700">Min:</motion.td>
                <motion.td className="text-gray-900">{stats[feature].min}</motion.td>
              </motion.tr>
              <motion.tr>
                <motion.td className=" pr-4 text-gray-700">Mode:</motion.td>
                <motion.td className="text-gray-900">{stats[feature].mode}</motion.td>
              </motion.tr>
              <motion.tr>
                <motion.td className=" pr-4 text-gray-700">Standard Deviation:</motion.td>
                <motion.td className="text-gray-900">{stats[feature].std}</motion.td>
              </motion.tr>
              <motion.tr>
                <motion.td className=" pr-4 text-gray-700">Variance:</motion.td>
                <motion.td className="text-gray-900">{stats[feature].variance}</motion.td>
              </motion.tr>
            </>
          ) : (
            <motion.tr>
              <motion.td className="text-red-600">No data available for selected feature</motion.td>
            </motion.tr>
          )}
        </motion.tbody>
      </motion.table>

    </motion.div>

  );
};

export default NumericalBasicStats;