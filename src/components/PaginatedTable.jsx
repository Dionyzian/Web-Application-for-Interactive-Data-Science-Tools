import React, { useEffect, useState } from 'react';

function PaginatedTable({ jsonData, numericalFeatures, nominalFeatures }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const data = jsonData.slice(startIdx, endIdx);

  const headers = [...numericalFeatures, ...nominalFeatures];

  useEffect(() => {
    setPage(1);
  }, [jsonData]);


  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow-lg overflow-hidden border-b border-[#C5C6C7] sm:rounded-lg">
            <table className=" border-[2px] min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="text-center px-4 py-3 text-lg font-semibold text-gray-500 uppercase tracking-wider bg-gray-100"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr
                    key={startIdx + index}
                    className={`animate-slide-in ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                  >
                    {headers.map((header, index) => (
                      <td
                        key={index}
                        className="text-center px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900 align-middle"
                      >
                        {row[header] || row[header] === 0 ? row[header] : 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`border-solid border-2 px-4 py-2 text-sm font-medium rounded-md  ${page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-acc1 hover:bg-acc2 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out'}`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={endIdx >= jsonData.length}
          className={`border-solid border-2 px-4 py-2 text-sm font-medium rounded-md  ${endIdx >= jsonData.length ? 'bg-gray-400 cursor-not-allowed' : 'bg-acc1 hover:bg-acc2 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out'}`}
        >
          Next
        </button>
      </div>
    </div>


  );
}

export default PaginatedTable;
