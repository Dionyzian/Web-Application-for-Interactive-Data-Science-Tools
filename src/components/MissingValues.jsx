import React, { useState } from "react";

const MissingData = ({ data, headers }) => {
    const [selectedFeature, setSelectedFeature] = useState(null);

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
        <div className="w-full lg:w-2/3 bg-white border border-gray-300 rounded-lg shadow-lg p-6 m-5">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {selectedFeature ? `Missing Data for ${selectedFeature}` : "Data"}
            </h2>
            <div className="overflow-x-auto h-30">
                {filteredData.length > 0 ? (
                    <table className="w-full table-auto mt-4">
                        <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide font-bold">
                            <tr>
                                {headers.map((header) => (
                                    <th key={header} className="px-4 py-3">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {filteredData.map((item, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                >
                                    {headers.map((header) => (
                                        <td key={header} className="px-4 py-3">
                                            {item.item[header] || "N/A"}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-700">
                        {selectedFeature
                            ? `No missing data found for ${selectedFeature}`
                            : "No missing data found"}
                    </p>
                )}
            </div>
        </div>

    );
};

export default MissingData;
