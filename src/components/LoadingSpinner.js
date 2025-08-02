// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        {/* Inner logo or icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
