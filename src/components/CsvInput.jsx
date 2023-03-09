import React, { useRef } from 'react';

function CsvInput({ onUpload }) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];

        if (!file || file.type !== 'text/csv') return;

        const stream = file.stream();
        const reader = stream.getReader();

        let csvData = '';
        let uploadComplete = false;

        while (!uploadComplete) {
            const { done, value } = await reader.read();
            if (done) {
                uploadComplete = true;
                break;
            }
            csvData += new TextDecoder().decode(value);
        }

        onUpload(csvData);
    };


    return (
        <div>
            <button className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded ' onClick={handleClick}>
                Upload Dataset
            </button>
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
        </div>
    );
}

export default CsvInput