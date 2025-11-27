import React from 'react';

const OpeningEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      {/* Container to center the paper */}
      <div className="relative">
        {/* The Paper Expanding */}
        <div className="bg-paper shadow-2xl border-4 border-wood-light animate-unfold relative overflow-hidden flex items-center justify-center">
          
          {/* Inner details to make it look like paper */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-50"></div>
          
          {/* Fold lines (decorative) */}
          <div className="absolute top-0 w-full h-px bg-stone-200 top-1/4"></div>
          <div className="absolute top-0 w-full h-px bg-stone-200 top-2/4"></div>
          <div className="absolute top-0 w-full h-px bg-stone-200 top-3/4"></div>

          {/* Loading Text or Icon fading in */}
          <div className="text-vermilion font-serif font-bold text-2xl tracking-[0.5em] opacity-0 animate-[appear_1s_ease-out_1s_forwards]">
            吉凶判断
          </div>
        </div>
        
        {/* Magical dust/particles (CSS only) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sakura-pink/20 blur-3xl rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default OpeningEffect;