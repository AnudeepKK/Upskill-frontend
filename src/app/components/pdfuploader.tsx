"use client";
// components/PdfUploader.js
// components/PdfUploader.js
// components/PdfUploader.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const PdfUploader = ({ onPdfUpload }:any) => {
//   const [pdfFile, setPdfFile] = useState(null);

//   // Handler for file input change
//   const handleFileChange = (event:any) => {
//     const file = event.target.files[0];
//     setPdfFile(file);
//   };

//   // Handler for uploading PDF content to backend
//   const handlePdfUpload = async () => {
//     if (!pdfFile) return;

//     try {
//       const formData = new FormData();
//       formData.append('file', pdfFile);

//       const response = await axios.post('http://your-backend-url/upload-pdf', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log('PDF uploaded successfully:', response.data);
//       onPdfUpload(response.data); // Notify parent component about successful upload
//     } catch (error) {
//       console.error('Error uploading PDF:', error);
//     }
//   };

//   return (
//     <div className="sm:ml-4">
//       {/* File input for selecting PDF */}
//       <input
//         type="file"
//         accept=".pdf"
//         onChange={handleFileChange}
//         className="hidden"
//         id="pdf-upload"
//       />
//       {/* Label for file input */}
//       <label htmlFor="pdf-upload" className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none">
//         Upload your syllabus pdf
//       </label>

//       {/* Display selected PDF file name */}
//       {/* @ts-ignore */}
//       {pdfFile && <p className="mt-2">Selected PDF: {pdfFile.name}</p>}

//       {/* Button to trigger PDF upload */}
//       <button onClick={handlePdfUpload} disabled={!pdfFile} className="mt-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none disabled:opacity-50">
//         Upload PDF
//       </button>
//     </div>
//   );
// };

// export default PdfUploader;
import React, { useState } from 'react';
import axios from 'axios';

const PdfUploader = ({ onChange }: any) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [selectedPdfName, setSelectedPdfName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [moduleData, setModuleData] = useState<string[]>([]);

  // Handler for file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setPdfFile(file);
      setSelectedPdfName(file.name);
    }
  };

  // Handler for uploading PDF to backend
  const handlePdfUpload = async () => {
    if (!pdfFile) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', pdfFile);

      const response = await axios.post('https://upskillsyllabuscopy.onrender.com/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      const { pages } = response.data;
      if (pages && pages.length > 0) {
        const filteredModules = pages[0].lines.filter((line: { content: string; }) => line.content.startsWith('MODULE:'));
        setModuleData(filteredModules.map((line: { content: any; }) => line.content));
        console.log('Filtered Modules:', filteredModules);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-5 items-center justify-center min-h-screen dark:bg-dark bg-gray-50 p-4">
      {/* Left Side: Upload Form */}
      <div className="md:w-1/2 md:pr-12 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-center md:text-left">Upload Syllabus Copy</h1>
        <p className="text-lg mb-4 text-center md:text-left">Upload your syllabus copy to analyze its content.</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
        />
        <label
          htmlFor="pdf-upload"
          className="cursor-pointer px-6 py-3 border border-gray-300 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none mb-4"
        >
          Select PDF
        </label>
        {selectedPdfName && (
          <p className="text-lg font-medium text-gray-700 mb-4">Selected PDF: {selectedPdfName}</p>
        )}
        <button
          onClick={handlePdfUpload}
          disabled={!pdfFile || uploading}
          className={`px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none disabled:opacity-50 ${uploading ? 'cursor-not-allowed' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </div>

      {/* Right Side: Display extracted data */}
      {moduleData.length > 0 && (
        <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0">
          <h2 className="text-2xl font-bold mb-4">Syllabus Data</h2>
          <div className="bg-white dark:bg-dark p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Modules</h3>
            <ul className="list-disc list-inside text-gray-700">
              {moduleData.map((module, index) => (
                <li key={index}>{module}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
