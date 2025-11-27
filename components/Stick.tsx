import React from 'react';

interface StickProps {
  visible: boolean;
  onInterpret: () => void;
  loading: boolean;
  imageSrc: string | null;
}

const Stick: React.FC<StickProps> = ({ visible, onInterpret, loading, imageSrc }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center animate-appear pointer-events-none">
      
      {/* The Stick - Positioned slightly above center to leave room for button */}
      <div className="relative mb-12 pointer-events-auto transform transition-transform hover:-translate-y-2 duration-300">
        
        {/* Glow behind */}
        <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-110"></div>

        {/* The Stick Image - Removed drop-shadow to avoid boxy artifact */}
        {imageSrc ? (
          <img 
             src={imageSrc} 
             alt="Omikuji Stick" 
             className="relative h-80 md:h-96 w-auto object-contain mix-blend-multiply"
          />
        ) : (
          /* Fallback */
          <div className="relative w-8 h-80 bg-gradient-to-r from-wood-dark via-wood-light to-wood-dark shadow-2xl flex flex-col items-center border-x border-black/20 overflow-hidden rounded-sm">
             <div className="w-full h-12 bg-vermilion"></div>
             <div className="flex-1 flex flex-col items-center justify-center py-4">
                <div className="writing-vertical-rl text-ink font-serif font-bold tracking-widest text-lg">
                  第{Math.floor(Math.random() * 99) + 1}番
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Artistic Interpret Button - Explicitly centered in flow below stick */}
      <button
        onClick={onInterpret}
        disabled={loading}
        className={`
          pointer-events-auto
          group relative flex items-center justify-center
          transition-all duration-500 ease-out
          ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-105 cursor-pointer'}
        `}
      >
        {/* Artistic Stamp/Seal Background */}
        <div className={`
           absolute inset-0 border-[3px] border-vermilion rounded-lg rotate-45 transform transition-transform duration-500
           ${loading ? 'rotate-180' : 'group-hover:rotate-12'}
           bg-paper shadow-lg
        `}></div>
        
        {/* Inner Border */}
        <div className="absolute inset-1 border border-vermilion/50 rounded-sm rotate-45 bg-white/50 backdrop-blur-sm"></div>

        {/* Text */}
        <span className={`
           relative z-10 px-8 py-4
           text-3xl font-serif font-bold text-vermilion tracking-[0.3em]
           writing-vertical-rl text-orientation-upright
           drop-shadow-sm
           ${loading ? 'animate-pulse' : ''}
        `}>
          {loading ? '解析' : '解签'}
        </span>
      </button>
    </div>
  );
};

export default Stick;