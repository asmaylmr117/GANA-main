import React from 'react';

const Sidebar = ({ isSidebarOpen, toggleSidebar, handleSidebarSectionClick, closeWindow }) => {
  const [activeSection, setActiveSection] = React.useState(null);

  const handleClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-screen w-80 bg-gray-900 z-50 transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } text-white`}
      style={{ boxShadow: '-4px 0px 10px rgba(0, 0, 0, 0.2)' }}
    >
     
      <button
        className="close-button absolute  text-red-500 text-1xl font-bold hover:text-red-700 transition-colors duration-200"
        onClick={toggleSidebar}
      >
        ✕
      </button>

      
      <ul className="flex flex-col p-6 space-y-4 text-lg font-medium">
       
        <li
          className={`cursor-pointer sidebar-section about text-white hover:text-green-700  ${
            activeSection === 'about' ? 'font-bold' : ''
          }`}
          onClick={() => handleClick('about')}
        >
          عن الموقع
        </li>
        {activeSection === 'about' && (
          <div className="p-4 bg-gray-900 rounded-md shadow-md">
            <p className="text-sm leading-relaxed">
              هذا موقع ديني يقدم القرآن الكريم كاملاً بأصوات نخبة من أفضل مشايخ التلاوة والتجويد، إلى جانب أذكار
              الصباح والمساء والأدعية الدينية. كما يتضمن مسبحة إلكترونية لتسهيل التسبيح ويُقدم هذا العمل كصدقة
              جارية على روح:
            </p>
            <div className="flex space-x-4 mt-4">
              <div className="text-center">
                <img
                  src="img/baba.jpg"
                  alt="والد المطور"
                  className="w-16 h-20 rounded-full mx-auto mb-2"
                />
                <p className="text-xs">والدي الغالي الحاج إسماعيل إبراهيم العناني</p>
              </div>
              <div className="text-center">
                <img
                  src="img/bro.jpg"
                  alt="أخي المطور"
                  className="w-16 h-20 rounded-full mx-auto mb-2"
                />
                <p className="text-xs">أخي محمود اسماعيل العناني</p>
              </div>
              <div className="text-center">
                <img
                  src="img/hema.jpg"
                  alt="الأستاذ المأذون"
                  className="w-16 h-20 rounded-full mx-auto mb-2"
                />
                <p className="text-xs">الأستاذ إبراهيم المأذون</p>
              </div>
            </div>
          </div>
        )}

        
        <li
          className={`cursor-pointer sidebar-section developer text-white hover:text-green-700 ${
            activeSection === 'developer' ? 'font-bold' : ''
          }`}
          onClick={() => handleClick('developer')}
        >
          مطور الموقع
        </li>
        {activeSection === 'developer' && (
          <div className="p-4 bg-gray-900 rounded-md shadow-md">
            <img
              src="img/mos.jpg"
              alt="مطور الموقع"
              className="w-24 h-29 rounded-full mx-auto mb-4 object-cover"
            />
            <div className="text-center text-xl font-bold mb-2">Mostafa Ismail Alanani</div>
            <div className="flex justify-center space-x-4">
              <a href="https://wa.me/+201066915691" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp text-2xl text-green-500 hover:text-green-700"></i>
              </a>
              <a href="https://www.facebook.com/mostafa.enani.71" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook text-2xl text-blue-500 hover:text-blue-700"></i>
              </a>
              <a href="https://t.me/asmaylmr" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-telegram text-2xl text-cyan-500 hover:text-cyan-700"></i>
              </a>
              <a href="tel:+20155884327" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-phone text-2xl text-red-500 hover:text-red-700"></i>
              </a>
            </div>
          </div>
        )}

    
        <li
          className="cursor-pointer sidebar-section logout text-white hover:text-red-700"
          onClick={closeWindow}
        >
          الخروج
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;