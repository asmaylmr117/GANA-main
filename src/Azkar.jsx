import React, { useState, useEffect } from 'react';
import { azkarApi } from './azkarApi'; 

const Azkar = ({ activeAzkarContent, handleAzkarClick, handleBackToAzkar }) => {
  const [azkarSections, setAzkarSections] = useState([]);
  const [azkarData, setAzkarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSectionData, setCurrentSectionData] = useState(null);

  
  useEffect(() => {
    const fetchAzkarData = async () => {
      try {
        setLoading(true);
        const data = await azkarApi.getAllAzkarData();
        setAzkarSections(data.sections);
        setAzkarData(data.azkarData);
        setError(null);
      } catch (err) {
        setError('حدث خطأ في تحميل الأذكار');
        console.error('Error loading azkar:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAzkarData();
  }, []);

  
  useEffect(() => {
    const fetchSectionData = async () => {
      if (activeAzkarContent) {
        try {
          const sectionData = await azkarApi.getSectionAzkar(activeAzkarContent);
          setCurrentSectionData(sectionData);
        } catch (err) {
          console.error('Error loading section data:', err);
          setError('حدث خطأ في تحميل أذكار هذا القسم');
        }
      }
    };

    fetchSectionData();
  }, [activeAzkarContent]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-900 text-white font-sans antialiased">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-xl text-yellow-400">جاري تحميل الأذكار...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-900 text-white font-sans antialiased">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-xl text-red-400">{error}</p>
            <button 
              className="mt-4 px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
              onClick={() => window.location.reload()}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-900 text-white font-sans antialiased">
      {activeAzkarContent === null && (
        <div className="max-w-4xl mx-auto py-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
            الأذكار
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {azkarSections.map(section => (
              <div
                key={section.id}
                className="azkar-card relative p-6 flex flex-col items-center justify-center bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer border-t-2 border-yellow-400"
                onClick={() => handleAzkarClick(section.id)}
              >
                <div className="text-5xl mb-3 text-yellow-400">{section.icon}</div>
                <div className="text-2xl font-semibold text-center mt-2">{section.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeAzkarContent && (
        <div id="so" className="azkar-content relative max-w-2xl mx-auto p-6 md:p-8 bg-gray-800 rounded-2xl shadow-xl transition-all duration-500">
          <button
            className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-red-500 transition-colors duration-300"
            onClick={handleBackToAzkar}
          >
            &times;
          </button>
          
          <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
            {azkarSections.find(s => s.id === activeAzkarContent)?.name}
          </h2>
          
          {currentSectionData && currentSectionData.azkar ? (
            <div className="space-y-6">
              {currentSectionData.azkar.map(prayer => (
                <div key={prayer.id} className="azkar-item text-center">
                  <p className="text-2xl leading-relaxed text-gray-200 whitespace-pre-line">
                    {prayer.text}
                  </p>
                  {prayer.description && (
                    <p className="mt-3 text-lg text-gray-400">
                      {prayer.description}
                    </p>
                  )}
                  <hr className="my-6 border-gray-700" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="mt-4 text-lg text-yellow-400">جاري تحميل الأذكار...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Azkar;