import React, { useState } from 'react';
import './App.css';
import Quran from './Quran';
import Azkar from './Azkar';
import Misbaha from './Misbaha';
import Sidebar from './Sidebar';
import backgroundImage from '/img/photo.jpg';

const App = () => {
  const [activeSection, setActiveSection] = useState('quran');
  const [activeSurahIndex, setActiveSurahIndex] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState(null);
  const [activeAzkarContent, setActiveAzkarContent] = useState(null);
  const [count, setCount] = useState(0);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setActiveSurahIndex(null);
    setActiveAzkarContent(null);
  };

  const showSurah = (index) => {
    setActiveSurahIndex(index);
  };

  const closeSurah = () => {
    setActiveSurahIndex(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setActiveSidebarSection(null);
  };

  const handleSidebarSectionClick = (section) => {
    if (section === 'logout') {
      closeWindow();
    } else {
      setActiveSidebarSection(activeSidebarSection === section ? null : section);
    }
  };

  const closeWindow = () => {
    window.open('about:blank', '_self').close();
  };

  const handleAzkarClick = (section) => {
    setActiveAzkarContent(section);
  };

  const handleBackToAzkar = () => {
    setActiveAzkarContent(null);
  };

  const handleClick = () => {
    setCount(count + 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  const MosqueIcon = () => (
    <img className="w-10 h-10 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-16 lg:h-12 text-yellow-500" src="./img/noshaf.png" alt="Mosque Icon" />
  );
  return (
    <div className="container mx-auto p-4 " class="background-image" style={{
      backgroundImage: `url(${backgroundImage})`
    }}>
      <div className="bg-gray-800 p-4 relative">
        
        <div className="flex md:hidden items-center justify-between">
      
          

       
          <div className="flex space-x-2 mr-8">
            <button className="text-yellow-500 text-xs icon hover:text-yellow-300 transition-colors duration-200" onClick={() => toggleSection('misbaha')}>
              المسبحة الإلكترونية
            </button>
            <button className="text-yellow-500 text-xs icon hover:text-yellow-300 transition-colors duration-200" onClick={() => toggleSection('azkar')}>
              الأذكار
            </button>
            <button className="text-yellow-500 text-xs icon hover:text-yellow-300 transition-colors duration-200" onClick={() => toggleSection('quran')}>
              القرآن الكريم
            </button>
          </div>


          <div className="flex items-center space-x-2 flex-shrink-0">
            <h1 className="text-white text-xs sm:text-2xl md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-center px-2">
              <a
                href="#"
                className="hover:text-yellow-300 transition-colors duration-200 whitespace-nowrap block"
              >
                الطريق إلى الجنة
              </a>
            </h1>

            <button className="text-yellow-500 icon hover:text-yellow-300 transition-colors duration-200" onClick={toggleSidebar}>
              <div className="space-y-1">
                <div className="w-5 h-0.5 bg-white"></div>
                <div className="w-5 h-0.5 bg-white"></div>
                <div className="w-5 h-0.5 bg-white"></div>
              </div>
            </button>
          </div>
        </div>

 
        <div className="hidden md:flex justify-center items-center">
        
          <div className="absolute left-4">
            <MosqueIcon />
          </div>

          <div className="flex space-x-4 sm:space-x-6 lg:space-x-8">
            <button className="text-yellow-500 text-xs sm:text-sm md:text-base lg:text-lg icon hover:text-yellow-300 transition-colors duration-200" onClick={() => toggleSection('misbaha')}>
              المسبحة الإلكترونية
            </button>
            <button className="text-yellow-500 text-xs sm:text-sm md:text-base lg:text-lg icon hover:text-yellow-300 transition-colors duration-200" onClick={() => toggleSection('azkar')}>
              الأذكار
            </button>
            <button className="text-yellow-500 text-xs sm:text-sm md:text-base lg:text-lg icon hover:text-yellow-300 transition-colors duration-200" onClick={() => toggleSection('quran')}>
              القرآن الكريم
            </button>
          </div>

       
          <div className="absolute right-4 flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-white text-sm sm:text-lg md:text-xl xl:text-2xl whitespace-nowrap">
              <a href="#" className="hover:text-yellow-300 transition-colors duration-200">الطريق إلى الجنة</a>
            </h1>
            <button className="text-yellow-500 icon hover:text-yellow-300 transition-colors duration-200" onClick={toggleSidebar}>
              <div className="space-y-1">
                <div className="w-5 h-0.5 bg-white"></div>
                <div className="w-5 h-0.5 bg-white"></div>
                <div className="w-5 h-0.5 bg-white"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleSidebarSectionClick={handleSidebarSectionClick}
          closeWindow={closeWindow}
        />
      )}

      {activeSection === 'quran' && (
        <Quran
          activeSurahIndex={activeSurahIndex}
          showSurah={showSurah}
          closeSurah={closeSurah}
        />
      )}

      {activeSection === 'azkar' && (
        <Azkar
          activeAzkarContent={activeAzkarContent}
          handleAzkarClick={handleAzkarClick}
          handleBackToAzkar={handleBackToAzkar}
        />
      )}

      {activeSection === 'misbaha' && (
        <Misbaha
          count={count}
          handleClick={handleClick}
          handleReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;
