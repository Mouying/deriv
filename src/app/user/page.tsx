"use client"; // Ensure this is a Client Component

import React, { useState } from "react";
import Sidebar1 from "../sidebar1"; // Import Sidebar1 component
import { useDropzone, DropzoneOptions } from "react-dropzone";

// Simulate a file upload function
const mockUploadFile = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("File uploaded:", file);
      resolve(true); // Simulate a successful upload after 2 seconds
    }, 2000); // Simulate a 2-second upload delay
  });
};

const FileUpload: React.FC = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Track if the upload is in progress

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploading(true); // Start upload

      // Simulate uploading the file
      mockUploadFile(acceptedFiles[0])
        .then((success) => {
          if (success) {
            setIsUploading(false); // Hide "Uploading..." message
            setUploadSuccess(true); // Show "Upload Successful!" message
            setTimeout(() => {
              setUploadSuccess(false); // Hide success message after 3 seconds
            }, 3000);
          }
        })
        .catch((error) => {
          console.error("Upload failed:", error);
          setIsUploading(false); // Reset if failed
        });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"], // Add support for PDF files
    },
    onDrop, // Trigger the onDrop callback when a file is dropped
    multiple: false, // Set to true if you want to accept multiple files
  } as DropzoneOptions);

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Sidebar */}
      <Sidebar1 /> {/* Render Sidebar1 component */}
      {/* Main Content */}
      <div className="flex items-center justify-center flex-1 relative">
        {/* Upload Success Popup */}
        {uploadSuccess && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg"
            style={{ zIndex: 1000 }}
          >
            <p>Upload Successful!</p>
          </div>
        )}

        {/* Uploading State */}
        {isUploading && !uploadSuccess && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white py-2 px-4 rounded shadow-lg"
            style={{ zIndex: 1000 }}
          >
            <p>Uploading...</p>
          </div>
        )}

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className="w-300 h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-transform transform hover:scale-105"
        >
          <input {...getInputProps()} />
          <img
            src="/uploads.png" // Replace with the path to your image icon
            alt="Upload Icon"
            className="w-16 h-16 mb-4 opacity-70"
          />
          <p className="text-gray-500 font-semibold">
            Drop your image or PDF here, or{" "}
            <span className="text-blue-500 underline">browse</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">Supports JPG, PNG, PDF</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
