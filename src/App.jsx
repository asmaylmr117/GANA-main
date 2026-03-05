import React, { useState, useEffect } from 'react';
import './App.css';
import Quran from './Quran';
import Azkar from './Azkar';
import Misbaha from './Misbaha';
import Sidebar from './Sidebar';
import backgroundImage from '/img/photo.jpg';

// ─── PWA Install Banner ───────────────────────────────────────────────────────
const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="pwa-banner fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 text-white">
      <button
        onClick={() => setShowBanner(false)}
        className="text-gray-400 hover:text-white transition-colors text-xl ml-4"
        aria-label="إغلاق"
      >✕</button>
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl">📲</span>
        <div>
          <div className="font-bold text-sm">ثبّت التطبيق</div>
          <div className="text-xs text-gray-300">استخدم الموقع بدون إنترنت كتطبيق أصلي</div>
        </div>
      </div>
      <button
        onClick={handleInstall}
        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors mr-3 whitespace-nowrap"
      >ثبّت الآن</button>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
const App = () => {
  const [activeSection, setActiveSection] = useState('quran');
  const [activeSurahIndex, setActiveSurahIndex] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState(null);
  const [activeAzkarContent, setActiveAzkarContent] = useState(null);

  const [count, setCount] = useState(() => {
    try {
      const saved = localStorage.getItem('misbaha_count');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch { return 0; }
  });

  useEffect(() => {
    try { localStorage.setItem('misbaha_count', count); } catch { }
  }, [count]);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setActiveSurahIndex(null);
    setActiveAzkarContent(null);
  };

  const showSurah = (index) => setActiveSurahIndex(index);
  const closeSurah = () => setActiveSurahIndex(null);
  const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen); setActiveSidebarSection(null); };
  const closeWindow = () => window.open('about:blank', '_self').close();

  const handleSidebarSectionClick = (section) => {
    if (section === 'logout') closeWindow();
    else setActiveSidebarSection(activeSidebarSection === section ? null : section);
  };

  const handleAzkarClick = (section) => setActiveAzkarContent(section);
  const handleBackToAzkar = () => setActiveAzkarContent(null);
  const handleClick = () => setCount((c) => c + 1);
  const handleReset = () => setCount(0);

  // ── Mosque Icon ────────────────────────────────────────────────────────
  const MosqueIcon = () => (
    <img
      className="w-10 h-10 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-14 lg:h-12"
      src="./mosque-svgrepo-com.svg"
      alt="شعار الموقع"
    />
  );

  // ── Hamburger Button ──────────────────────────────────────────────────────
  const HamburgerIcon = () => (
    <button className="hamburger-btn" onClick={toggleSidebar} aria-label="القائمة">
      <span></span>
      <span></span>
      <span></span>
    </button>
  );

  return (
    <div dir="rtl" className="background-image min-h-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>

      {/* ══════════════════════════════════════
          HEADER
      ══════════════════════════════════════ */}
      <header className="nav-header p-3 px-4">

        {/* Small screen */}
        <div className="flex md:hidden items-center justify-between">

          <div className="flex items-center gap-2">
            <HamburgerIcon />
            <a href="#" className="nav-brand">الطريق إلى الجنة</a>
          </div>

          <nav className="flex items-center gap-1">
            <button className="nav-btn text-xs" onClick={() => toggleSection('misbaha')}>المسبحة</button>
            <button className="nav-btn text-xs" onClick={() => toggleSection('azkar')}>الأذكار</button>
            <button className="nav-btn text-xs" onClick={() => toggleSection('quran')}>القرآن</button>
          </nav>
        </div>

        {/* Large screen */}
        <div className="hidden md:flex items-center justify-between">

          <div className="flex items-center gap-2">
            <HamburgerIcon />
            <a href="#" className="nav-brand">الطريق إلى الجنة</a>
          </div>


          <nav className="flex items-center gap-1">
            <button className="nav-btn" onClick={() => toggleSection('misbaha')}>المسبحة الإلكترونية</button>
            <span className="text-yellow-800 text-lg select-none">|</span>
            <button className="nav-btn" onClick={() => toggleSection('azkar')}>الأذكار</button>
            <span className="text-yellow-800 text-lg select-none">|</span>
            <button className="nav-btn" onClick={() => toggleSection('quran')}>القرآن الكريم</button>
          </nav>


          <MosqueIcon />
        </div>

      </header>

      {/* ══════════════════════════════════════
          MAIN
      ══════════════════════════════════════ */}
      <main className="container mx-auto p-4 max-w-screen-2xl">
        {isSidebarOpen && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            handleSidebarSectionClick={handleSidebarSectionClick}
            closeWindow={closeWindow}
          />
        )}

        {activeSection === 'quran' && (
          <Quran activeSurahIndex={activeSurahIndex} showSurah={showSurah} closeSurah={closeSurah} />
        )}
        {activeSection === 'azkar' && (
          <Azkar activeAzkarContent={activeAzkarContent} handleAzkarClick={handleAzkarClick} handleBackToAzkar={handleBackToAzkar} />
        )}
        {activeSection === 'misbaha' && (
          <Misbaha count={count} handleClick={handleClick} handleReset={handleReset} />
        )}
      </main>

      <PwaInstallBanner />
    </div>
  );
};

export default App;