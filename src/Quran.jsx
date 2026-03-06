import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Download, Maximize2 } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getPdfEmbedUrl = (pdfUrl) => {
  if (!pdfUrl) return '';
  if (pdfUrl.includes('drive.google.com')) {
    const fileId = pdfUrl.split('/d/')[1]?.split('/view')[0];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return pdfUrl;
};

const getPdfDownloadUrl = (pdfUrl) => {
  if (!pdfUrl) return '';
  if (pdfUrl.includes('drive.google.com')) {
    const fileId = pdfUrl.split('/d/')[1]?.split('/view')[0];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return pdfUrl;
};

// ─── Virtual Scroll Grid ──────────────────────────────────────────────────────
const VirtualSurahGrid = ({ surahNames, showSurah }) => {
  const ITEM_HEIGHT = 90;
  const MIN_COL_WIDTH = 160;
  const OVERSCAN = 3;

  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(500);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
      setContainerHeight(entry.contentRect.height);
    });
    ro.observe(el);
    setContainerWidth(el.offsetWidth);
    setContainerHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const columnCount = Math.max(2, Math.floor(containerWidth / MIN_COL_WIDTH));
  const colWidth = Math.floor(containerWidth / columnCount);
  const rowCount = Math.ceil(surahNames.length / columnCount);
  const totalHeight = rowCount * ITEM_HEIGHT;

  const firstRow = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const lastRow = Math.min(rowCount - 1, Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN);

  const visibleRows = [];

  for (let row = firstRow; row <= lastRow; row++) {
    const cells = [];

    for (let col = 0; col < columnCount; col++) {
      const idx = row * columnCount + col;

      if (idx >= surahNames.length) {
        cells.push(<div key={col} style={{ width: colWidth, flexShrink: 0 }} />);
        continue;
      }

      cells.push(
        <div key={col} style={{ width: colWidth, flexShrink: 0, padding: '6px', boxSizing: 'border-box' }}>
          <div
            className="section-card h-full flex flex-col items-center justify-center gap-1"
            style={{ minHeight: ITEM_HEIGHT - 12, cursor: 'pointer' }}
            onClick={() => showSurah(idx)}
          >
            <span style={{ color: '#f5c842', fontSize: '11px', fontWeight: 700, opacity: 0.7 }}>
              {idx + 1}
            </span>
            <span style={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.4, textAlign: 'center' }}>
              {surahNames[idx]}
            </span>
          </div>
        </div>
      );
    }

    visibleRows.push(
      <div
        key={row}
        style={{
          position: 'absolute',
          top: row * ITEM_HEIGHT,
          width: '100%',
          height: ITEM_HEIGHT,
          display: 'flex',

          flexDirection: 'row',
        }}
      >
        {cells}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height: '70vh', overflowY: 'auto', position: 'relative' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleRows}
      </div>
    </div>
  );
};

// ─── PDF Card ─────────────────────────────────────────────────────────────────
const PdfCard = ({ surahData, setShowPdfModal }) => {
  if (!surahData.pdfs?.[0]) return null;
  return (
    <div className="pdf-card mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h3 className="text-white font-bold text-xl">📖 المصحف الشريف</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowPdfModal(true)}
            className="bg-white text-yellow-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-bold text-sm whitespace-nowrap"
          >
            عرض ملء الشاشة
          </button>
          <a
            href={getPdfDownloadUrl(surahData.pdfs[0])}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-bold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <Download size={15} />
            <span>تحميل</span>
          </a>
        </div>
      </div>
      <div
        className="relative bg-white rounded-xl overflow-hidden shadow-2xl cursor-pointer group"
        onClick={() => setShowPdfModal(true)}
      >
        <iframe
          src={getPdfEmbedUrl(surahData.pdfs[0])}
          className="pdf-preview-frame w-full pointer-events-none"
          title="معاينة المصحف"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          <div className="bg-green-600 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg">
            <Maximize2 size={26} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PDF Modal ────────────────────────────────────────────────────────────────
const HEADER_H = 52;

const PdfModal = ({ surahData, showPdfModal, setShowPdfModal }) => {
  if (!showPdfModal || !surahData.pdfs?.[0]) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000' }}>


      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: HEADER_H, zIndex: 10000,
        background: '#0f172a',
        borderBottom: '2px solid #f5c842',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px', direction: 'rtl',
      }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Cairo, sans-serif' }}>
          📖 {surahData.name}
        </span>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a
            href={getPdfDownloadUrl(surahData.pdfs[0])}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 12px', borderRadius: 8,
              background: 'rgba(245,200,66,0.12)',
              border: '1px solid rgba(245,200,66,0.4)',
              color: '#f5c842', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: '0.85rem', fontWeight: 600,
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <Download size={16} /><span>تحميل</span>
          </a>


          <button
            onClick={() => setShowPdfModal(false)}
            style={{
              padding: '8px 20px',
              background: '#dc2626',
              color: '#fff', border: 'none',
              borderRadius: 8, fontWeight: 700,
              fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'Cairo, sans-serif',
              boxShadow: '0 2px 10px rgba(220,38,38,0.5)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
          >
            <span>إغلاق</span>
            <span style={{ fontSize: '1.2rem' }}>✕</span>
          </button>
        </div>
      </div>


      <iframe
        src={getPdfEmbedUrl(surahData.pdfs[0])}
        title="عارض المصحف"
        style={{
          position: 'fixed',
          top: HEADER_H, left: 0, right: 0,
          width: '100%',
          height: `calc(100vh - ${HEADER_H}px)`,
          border: 'none',
        }}
      />


      <button
        onClick={() => setShowPdfModal(false)}
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10001,
          padding: '12px 36px',
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          color: '#fff',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: 50,
          fontWeight: 700,
          fontSize: '1.05rem',
          cursor: 'pointer',
          fontFamily: 'Cairo, sans-serif',
          boxShadow: '0 4px 24px rgba(220,38,38,0.6), 0 0 0 4px rgba(220,38,38,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 32px rgba(220,38,38,0.8), 0 0 0 6px rgba(220,38,38,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(220,38,38,0.6), 0 0 0 4px rgba(220,38,38,0.2)';
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>✕</span>
       
      </button>
    </div>
  );
};

// ─── Reader images ────────────────────────────────────────────────────────────
const firstTenSectionImages = [
  'img/mostafa.jpg', 'img/abdoo.jpg', 'img/Sedeq.jpg', 'img/hosery.jpg', 'img/bana.jpg',
  'img/agmy1.jpg', 'img/sodes.jpg', 'img/moeqlyi.jpeg', 'img/unnamed.png', 'img/mshary.jpg',
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Quran = ({ activeSurahIndex, showSurah, closeSurah }) => {
  const [surahNames, setSurahNames] = useState([]);
  const [surahData, setSurahData] = useState({ name: '', pdfs: [], audio: [] });
  const [isLoadingSurahNames, setIsLoadingSurahNames] = useState(true);
  const [isLoadingSurahData, setIsLoadingSurahData] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const audioRefs = useRef([]);

  useEffect(() => {
    setIsLoadingSurahNames(true);
    fetch('https://gana-back-plum.vercel.app/api/surahs')
      .then((r) => r.json())
      .then((data) => setSurahNames(data.map((s) => s.name)))
      .catch(console.error)
      .finally(() => setIsLoadingSurahNames(false));
  }, []);

  useEffect(() => {
    if (activeSurahIndex === null) { setSurahData({ name: '', pdfs: [], audio: [] }); return; }
    setIsLoadingSurahData(true);
    fetch(`https://gana-back-plum.vercel.app/api/surahs/${activeSurahIndex + 1}`)
      .then((r) => r.json())
      .then((data) => setSurahData({ name: data.name, pdfs: data.pdfs, audio: data.audio }))
      .catch(console.error)
      .finally(() => setIsLoadingSurahData(false));
  }, [activeSurahIndex]);

  const handlePlay = useCallback((currentIndex) => {
    audioRefs.current.forEach((audio, i) => {
      if (i !== currentIndex && audio) { audio.pause(); audio.currentTime = 0; }
    });
  }, []);

  return (
    <div dir="rtl">
      {isLoadingSurahNames && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 z-50">
          <div className="text-white text-2xl font-bold mb-6">جارٍ تحميل أسماء السور…</div>
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-yellow-500" />
        </div>
      )}
      {isLoadingSurahData && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 z-50">
          <div className="text-white text-2xl font-bold mb-6">جارٍ تحميل بيانات السورة…</div>
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500" />
        </div>
      )}


      {activeSurahIndex === null && !isLoadingSurahNames && (
        <div className="mt-4 p-4 rounded-xl shadow-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <h2 className="text-2xl font-bold text-center text-white mb-6"> القرآن الكريم</h2>
          <VirtualSurahGrid surahNames={surahNames} showSurah={showSurah} />
        </div>
      )}


      {activeSurahIndex !== null && !isLoadingSurahData && (
        <div className="mt-4 p-4 rounded-xl shadow-lg relative" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <button
            className="absolute top-4 left-4 text-white bg-red-500 hover:bg-red-600 w-9 h-9 rounded-full text-xl z-10 transition-colors flex items-center justify-center"
            onClick={closeSurah}
          >✕</button>

          <h2 className="text-3xl font-bold text-center text-white mb-6">{surahData.name}</h2>

          <PdfCard surahData={surahData} setShowPdfModal={setShowPdfModal} />


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            {firstTenSectionImages.map((image, index) => (
              <div
                key={index}
                className="audio-gold-frame"
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg,#1a2332,#111827)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                }}
              >
                <img
                  src={image}
                  alt={`قارئ ${index + 1}`}
                  className="w-full object-cover aspect-video"
                  loading="lazy"
                />
                {surahData.audio?.[index] && (
                  <div className="p-2 ">
                    <audio
                      controls
                      className="w-full  "
                      ref={(el) => (audioRefs.current[index] = el)}
                      onPlay={() => handlePlay(index)}
                    >
                      <source src={surahData.audio[index]} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </div>
            ))}
          </div>


          {surahData.pdfs?.[0] && (
            <div className="fixed bottom-20 left-4 z-40">
              <button
                onClick={() => setShowPdfModal(true)}
                className="bg-gradient-to-br from-green-500 to-green-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
                title="فتح المصحف"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      <PdfModal surahData={surahData} showPdfModal={showPdfModal} setShowPdfModal={setShowPdfModal} />
    </div>
  );
};

export default Quran;