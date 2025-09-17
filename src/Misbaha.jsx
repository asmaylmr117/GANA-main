import React from 'react';

const Misbaha = ({ count, handleClick, handleReset }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans antialiased">
      <div className="bg-gray-800 p-12 rounded-3xl shadow-xl text-center max-w-sm w-full">
        <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
          مسبحة إلكترونية
        </h1>
        <div className="mb-8">
          <span className="text-7xl font-extrabold text-white">{count}</span>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 text-white py-3 px-8 rounded-full text-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            تسبيح
          </button>
          <button
            onClick={handleReset}
            className="w-full bg-red-600 text-white py-3 px-8 rounded-full text-xl font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
          >
            ⟳ إعادة تعيين
          </button>
      </div>
    </div>
  </div>
  );
};

export default Misbaha;