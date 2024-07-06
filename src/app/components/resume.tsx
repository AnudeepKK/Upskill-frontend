"use client";

import axios from 'axios';
import { useState } from 'react';

const Resume = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedPdfName, setSelectedPdfName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');

  // Handler for file input change
  const handleFileChange = (event:any) => {
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
      console.log(formData);

      const response = await axios.post('https://upskillsyllabuscopy.onrender.com/analyze1?file=', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      const { documents } = response.data;
      if (documents && documents.length > 0) {
        const { fields } = documents[0];
        const extractedSkills = fields.skills || '';
        const extractedProjects = fields.projects || '';

        setSkills(extractedSkills);
        setProjects(extractedProjects);

        console.log(projects);
        console.log(skills);
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
        <h1 className="text-3xl font-bold mb-4 text-center md:text-left">Upload Your Resume</h1>
        <p className="text-lg mb-4 text-center md:text-left">Add your resume to know whether you are in sync with current world technologies.</p>
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
          className={`px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none disabled:opacity-50 ${
            uploading ? 'cursor-not-allowed' : ''
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </div>

      {/* Right Side: Display extracted data */}
      {skills && (
  <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0">
    <h2 className="text-2xl font-bold mb-4">Resume Data</h2>
    <div className="bg-white dark:bg-dark p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">Industry Relevant Technical Skills</h3>
      <ul className="list-none text-gray-700">
        {skills.split(',').map((skill, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`skill-${index}`}
              name={`skill-${index}`}
              className="mr-2"
            />
            <label htmlFor={`skill-${index}`}>{skill.trim()}</label>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

    </div>
  );
};

export default Resume;
