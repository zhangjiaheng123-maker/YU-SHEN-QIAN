import React from 'react';

interface OmikujiBoxProps {
  shaking: boolean;
  onClick: () => void;
  disabled: boolean;
  imageSrc: string | null;
}

const OmikujiBox: React.FC<OmikujiBoxProps> = ({ shaking, onClick, disabled, imageSrc }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-96 w-full perspective-1000">
      {/* Box Container */}
      <div
        onClick={!disabled ? onClick : undefined}
        className={`relative cursor-pointer transition-transform duration-300 ${
          shaking ? 'animate-shake' : 'hover:scale-105'
        }`}
      >
        {imageSrc ? (
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* The Generated Image - Removed drop-shadow to avoid square border on blend */}
            <img 
              src={imageSrc} 
              alt="Omikuji Box" 
              className="w-full h-full object-contain mix-blend-multiply" 
            />
          </div>
        ) : (
          /* Fallback if image generation failed or is missing */
          <div className="w-32 h-64 bg-wood-light border-4 border-wood-dark shadow-xl relative rounded-md flex items-center justify-center overflow-hidden">
             <span className="text-3xl font-serif font-bold text-black vertical-text tracking-widest">
               御神签
             </span>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <p className="mt-4 text-stone-600 font-serif text-lg animate-float bg-white/60 px-4 py-1 rounded-full backdrop-blur-sm shadow-sm">
        {shaking ? "摇晃中..." : "点击签筒求签"}
      </p>
    </div>
  );
};

export default OmikujiBox;