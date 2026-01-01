import React from 'react';

const Loader = ({ loading, message = 'Loading...' }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      
      {/* Loader */}
      <div className="relative flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-transparent animate-spin rounded-full border-t-blue-500 border-r-blue-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-transparent animate-spin rounded-full border-t-red-500 border-r-red-300 animate-reverse"></div>
          </div>
        </div>
        {message && (
          <p className="mt-4 text-gray-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loader;