import React from 'react';

const Sidebar = ({ isSidebarOpen, toggleSidebar, handleSidebarSectionClick, closeWindow }) => {
  const [activeSection, setActiveSection] = React.useState(null);

  const handleClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar panel */}
      <aside
        dir="rtl"
        className={`sidebar fixed top-0 right-0 h-screen w-80 z-50 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white border-opacity-10">
          <h2 className="text-yellow-400 font-bold text-lg tracking-wide">القائمة</h2>
          <button
            className="text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10 w-9 h-9 rounded-full flex items-center justify-center transition-all text-xl"
            onClick={toggleSidebar}
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>
        </div>

        {/* ── Navigation items ── */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">

          {/* About */}
          <div>
            <button
              className={`sidebar-item w-full text-right ${activeSection === 'about' ? 'text-yellow-400 bg-yellow-500 bg-opacity-10 border-yellow-500 border-opacity-30' : 'text-white'}`}
              onClick={() => handleClick('about')}
            >
              <span className="text-lg">🕌</span>
              <span>عن الموقع</span>
              <span className={`mr-auto transition-transform duration-200 text-xs ${activeSection === 'about' ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>

            {activeSection === 'about' && (
              <div className="mt-2 mb-3 p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10 text-sm leading-relaxed text-gray-300 space-y-4">
                <p>
                  هذا موقع ديني يقدم القرآن الكريم كاملاً بأصوات نخبة من أفضل مشايخ التلاوة والتجويد، إلى جانب أذكار الصباح والمساء والأدعية. كما يتضمن مسبحة إلكترونية، ويُقدَّم كصدقة جارية على روح:
                </p>
                <div className="flex justify-around gap-2 pt-2">
                  {[
                    { src: 'img/baba.jpg', label: 'والدي الغالي الحاج إسماعيل إبراهيم العناني' },
                    { src: 'img/bro.jpg', label: 'أخي محمود اسماعيل العناني' },
                    { src: 'img/hema.jpg', label: 'الأستاذ إبراهيم المأذون' },
                  ].map((person) => (
                    <div key={person.label} className="text-center flex-1 min-w-0">
                      <img
                        src={person.src}
                        alt={person.label}
                        className="w-14 h-16 rounded-full mx-auto mb-2 object-cover border-2 border-yellow-600"
                      />
                      <p className="text-xs leading-snug text-gray-400">{person.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="sidebar-divider" />

          {/* Developer */}
          <div>
            <button
              className={`sidebar-item w-full text-right ${activeSection === 'developer' ? 'text-yellow-400 bg-yellow-500 bg-opacity-10 border-yellow-500 border-opacity-30' : 'text-white'}`}
              onClick={() => handleClick('developer')}
            >
              <span className="text-lg">👨‍💻</span>
              <span>مطور الموقع</span>
              <span className={`mr-auto transition-transform duration-200 text-xs ${activeSection === 'developer' ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>

            {activeSection === 'developer' && (
              <div className="mt-2 mb-3 p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10">
                <img
                  src="img/mosta.jpg"
                  alt="مطور الموقع"
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-yellow-500 shadow-lg"
                />
                <div className="text-center font-bold text-white mb-4 text-base">
                  Mostafa Ismail Alanani
                </div>
                <div className="flex justify-center gap-5">
                  {[
                    { href: 'https://wa.me/+201066915691', icon: 'fab fa-whatsapp', color: 'text-green-400 hover:text-green-300' },
                    { href: 'https://www.facebook.com/mostafa.enani.71', icon: 'fab fa-facebook', color: 'text-blue-400 hover:text-blue-300' },
                    { href: 'https://t.me/asmaylmr', icon: 'fab fa-telegram', color: 'text-cyan-400 hover:text-cyan-300' },
                    { href: 'tel:+20155884327', icon: 'fas fa-phone', color: 'text-red-400 hover:text-red-300' },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${link.color} text-2xl transition-colors`}
                    >
                      <i className={link.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* ── Footer: Logout pushed to very bottom ── */}
        <div className="px-4 pb-6 pt-3 border-t border-white border-opacity-10">
          <button
            className="sidebar-item logout w-full text-right justify-center"
            onClick={closeWindow}
          >
            <span className="text-lg">🚪</span>
            <span>الخروج من الموقع</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;