import React from 'react';

const Misbaha = ({ count, handleClick, handleReset }) => {
  // Visual feedback: flash ring on click
  const [flash, setFlash] = React.useState(false);

  const onTasbih = () => {
    handleClick();
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  };

  // Milestone labels
  const getMilestone = () => {
    if (count === 0) return null;
    if (count % 100 === 0) return '🎉 مئة تسبيحة!';
    if (count % 33 === 0) return '✨ ٣٣ تسبيحة';
    return null;
  };

  const milestone = getMilestone();

  return (
    <div
      className="misbaha-container min-h-[80vh] flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full border border-yellow-900 border-opacity-40">

        {/* Decorative top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full" />

        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
          المسبحة الإلكترونية
        </h1>
        <p className="text-gray-400 text-sm mb-8">سبحان الله وبحمده</p>

        {/* Count display */}
        <div className="relative mb-2">
          <div
            className={`misbaha-count text-8xl font-black text-white transition-transform duration-100 ${flash ? 'scale-110 text-yellow-300' : 'scale-100'}`}
          >
            {count}
          </div>

          {/* Progress ring hint */}
          <div className="mt-3 flex justify-center gap-1 flex-wrap max-w-[200px] mx-auto">
            {Array.from({ length: Math.min(count % 33 || (count > 0 && count % 33 === 0 ? 33 : 0), 33) }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-70"
              />
            ))}
          </div>
        </div>

        {/* Milestone toast */}
        <div className={`h-8 mb-4 flex items-center justify-center transition-opacity duration-500 ${milestone ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-yellow-400 font-bold text-lg">{milestone}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={onTasbih}
            className="misbaha-btn w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl text-xl hover:from-blue-500 hover:to-blue-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            تسبيح 🤲
          </button>

          <button
            onClick={handleReset}
            className="misbaha-btn w-full bg-gradient-to-r from-red-700 to-red-800 text-white py-3 rounded-2xl text-base hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
          >
            ⟳ إعادة تعيين
          </button>
        </div>

        
        {/* Decorative bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
      </div>
    </div>
  );
};

export default Misbaha;