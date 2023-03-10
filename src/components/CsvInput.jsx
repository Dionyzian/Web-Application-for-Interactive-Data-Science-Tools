import React, { useRef } from 'react';
import { csvToJson } from '../utils/CsvUtils';

function CsvInput({ onUpload }) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];

        if (file.type === 'text/csv' || file.type === 'application/json') {
            const stream = file.stream();
            const reader = stream.getReader();

            let fileData = '';
            let uploadComplete = false;

            while (!uploadComplete) {
                const { done, value } = await reader.read();
                if (done) {
                    uploadComplete = true;
                    break;
                }
                fileData += new TextDecoder().decode(value);
            }

            let jsonData;
            let headers
            let data
            if (file.type === 'text/csv') {
                const results = csvToJson(fileData);
                headers = results.headers
                data = results.result
            } else if (file.type === 'application/json') {
                jsonData = JSON.parse(fileData);
                headers = Object.keys(jsonData[0]);
                data = jsonData;
            }

            onUpload({ headers: headers, data: data });
        }
    };



    return (
        <div>
            <button className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded ' onClick={handleClick}>
                Upload Dataset
            </button>
            <input
                type="file"
                accept=".csv .json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
        </div>
    );
}

export default CsvInput