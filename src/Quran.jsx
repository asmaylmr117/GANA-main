import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize2, Minimize2 } from 'lucide-react';

const Quran = ({ activeSurahIndex, showSurah, closeSurah }) => {
  const firstTenSectionImages = [
    "img/mostafa.jpg",
    "img/abdoo.jpg",
    "img/Sedeq.jpg",
    "img/hosery.jpg",
    "img/bana.jpg",
    "img/agmy1.jpg",
    "img/sodes.jpg",
    "img/moeqlyi.jpeg",
    "img/unnamed.png",
    "img/mshary.jpg",
  ];
  const sectionImages = Array(114).fill(firstTenSectionImages);

  const [surahNames, setSurahNames] = useState([]);
  const [surahData, setSurahData] = useState({ name: '', pdfs: [], audio: [] });
  const [isLoadingSurahNames, setIsLoadingSurahNames] = useState(true);
  const [isLoadingSurahData, setIsLoadingSurahData] = useState(false);
  const [pdfViewMode, setPdfViewMode] = useState('modal'); // 'modal', 'inline', 'fullscreen'
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRefs = useRef([]);

  useEffect(() => {
    const fetchSurahNames = async () => {
      setIsLoadingSurahNames(true);
      try {
        const response = await fetch('https://gana-back-plum.vercel.app/api/surahs');
        const data = await response.json();
        setSurahNames(data.map(surah => surah.name));
      } catch (error) {
        console.error('Error fetching surah names:', error);
      } finally {
        setIsLoadingSurahNames(false);
      }
    };
    fetchSurahNames();
  }, []);

  useEffect(() => {
    if (activeSurahIndex !== null) {
      const fetchSurahData = async () => {
        setIsLoadingSurahData(true);
        try {
          const response = await fetch(`https://gana-back-plum.vercel.app/api/surahs/${activeSurahIndex + 1}`);
          const data = await response.json();
          setSurahData({
            name: data.name,
            pdfs: data.pdfs,
            audio: data.audio
          });
        } catch (error) {
          console.error('Error fetching surah data:', error);
        } finally {
          setIsLoadingSurahData(false);
        }
      };
      fetchSurahData();
    } else {
      setSurahData({ name: '', pdfs: [], audio: [] });
      setIsLoadingSurahData(false);
    }
  }, [activeSurahIndex]);

  const handlePlay = (currentIndex) => {
    audioRefs.current.forEach((audio, index) => {
      if (index !== currentIndex && audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  const getPdfEmbedUrl = (pdfUrl) => {
    if (pdfUrl?.includes('drive.google.com')) {
      const fileId = pdfUrl.split('/d/')[1]?.split('/view')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return pdfUrl;
  };

  const getPdfDownloadUrl = (pdfUrl) => {
    if (pdfUrl?.includes('drive.google.com')) {
      const fileId = pdfUrl.split('/d/')[1]?.split('/view')[0];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return pdfUrl;
  };

  // Modern PDF Modal Component
  const PdfModal = () => {
    if (!showPdfModal || !surahData.pdfs[0]) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="relative w-full h-full max-w-full max-h-full p-2">
          {/* Modal Header */}
          <div className="flex items-center justify-between bg-gray-900 rounded-t-lg p-2 text-white">
            <h3 className="text-lg font-bold">مصحف - {surahData.name}</h3>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                title={isFullscreen ? "تصغير" : "ملء الشاشة"}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={() => window.open(getPdfDownloadUrl(surahData.pdfs[0]), '_blank')}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                title="تحميل"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-2 hover:bg-red-600 rounded transition-colors text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className={`bg-white rounded-b-lg ${isFullscreen ? 'h-[calc(100vh-0.5rem)]' : 'h-[calc(100vh-4rem)]'}`}>
            <iframe
              src={getPdfEmbedUrl(surahData.pdfs[0])}
              className="w-full h-full rounded-b-lg border-0"
              title="PDF Viewer"
              style={{ minHeight: '90vh' }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Elegant PDF Card Component
  const PdfCard = () => {
    if (!surahData.pdfs[0]) return null;

    return (
      <div className="mb-6">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 shadow-2xl">
       
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">المصحف</h3>
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 gap-2 sm:space-x-reverse">
    <button
      onClick={() => setShowPdfModal(true)}
      className="bg-white text-yellow-600 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg hover:bg-gray-100 transition-colors font-bold whitespace-nowrap"
    >
      عرض المصحف
    </button>
    <button
      onClick={() => window.open(getPdfDownloadUrl(surahData.pdfs[0]), '_blank')}
      className="bg-yellow-500 text-white px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg hover:bg-yellow-600 transition-colors font-bold flex items-center justify-center space-x-1 space-x-reverse whitespace-nowrap"
    >
      <Download size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
      <span>تحميل</span>
    </button>
  </div>
</div>
          
          {/* Preview thumbnail */}
          <div className="relative bg-white rounded-lg p-2 shadow-lg">
            <iframe
              src={getPdfEmbedUrl(surahData.pdfs[0])}
              className="w-full h-64 rounded pointer-events-none"
              title="PDF Preview"
            />
            <div 
              className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all cursor-pointer rounded-lg flex items-center justify-center"
              onClick={() => setShowPdfModal(true)}
            >
              <div className="bg-green-600 text-white p-4 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <Maximize2 size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Floating PDF Button
  const FloatingPdfButton = () => {
    if (!surahData.pdfs[0]) return null;

    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowPdfModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/25 hover:scale-110 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Loading screens */}
      {isLoadingSurahNames && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-900 bg-opacity-70 z-50">
          <div className="text-white text-2xl font-bold mb-4">جارٍ تحميل أسماء السور...</div>
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-yellow-500"></div>
        </div>
      )}

      {isLoadingSurahData && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-900 bg-opacity-70 z-50">
          <div className="text-white text-2xl font-bold mb-4">جارٍ تحميل بيانات السورة...</div>
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-500"></div>
        </div>
      )}

      {/* Surah names grid */}
      {activeSurahIndex === null && !isLoadingSurahNames && (
        <div className="mt-4 p-4 bg-white bg-opacity-10 text-center shadow-md">
          <h2 className="text-2xl mb-4 text-white">القرآن الكريم</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {surahNames.map((surah, index) => (
              <div
                key={index}
                className="section p-4 bg-gray-900 bg-opacity-80 rounded-lg cursor-pointer text-center text-white hover:bg-opacity-90 hover:scale-105 transition-all duration-300 shadow-lg"
                onClick={() => showSurah(index)}
              >
                <div className="font-bold">{surah}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specific surah content */}
      {activeSurahIndex !== null && !isLoadingSurahData && (
        <div className="mt-4 p-4 bg-white bg-opacity-10 shadow-md relative rounded-lg">
          <button 
            className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-xl z-10 transition-colors" 
            onClick={closeSurah}
          >
            ×
          </button>
          
          <h2 className="text-3xl text-white mb-6 text-center font-bold">{surahData.name}</h2>
          
          {/* Beautiful PDF Card - Now appears BEFORE audio */}
          <PdfCard />

          {/* Audio and Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            {sectionImages[activeSurahIndex].map((image, index) => (
              <div key={index} className="relative cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <img
                  src={image}
                  alt={`Section ${index + 1}`}
                  className="w-full h-auto object-cover rounded-t-lg aspect-[16/9]"
                />
                {surahData.audio[index] && (
                  <div className="p-2">
                    <audio
                      controls
                      className="w-full"
                      ref={(el) => (audioRefs.current[index] = el)}
                      onPlay={() => handlePlay(index)}
                    >
                      <source src={surahData.audio[index]} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Floating PDF Button */}
          <FloatingPdfButton />
        </div>
      )}

      {/* PDF Modal */}
      <PdfModal />
    </div>
  );
};

export default Quran;
