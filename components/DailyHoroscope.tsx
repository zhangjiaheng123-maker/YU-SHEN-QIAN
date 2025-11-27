import React from 'react';
import { DailyHoroscopeResponse } from '../types';

interface Props {
  data: DailyHoroscopeResponse | null;
  loading: boolean;
  onGet: () => void;
}

const DailyHoroscope: React.FC<Props> = ({ data, loading, onGet }) => {
  return (
    <div className="fixed top-4 left-4 z-40">
      {!data ? (
        <button
          onClick={onGet}
          disabled={loading}
          className="bg-white/80 backdrop-blur text-sakura-dark border border-sakura-pink px-4 py-2 rounded-full shadow-md hover:bg-sakura-light transition-all text-sm font-serif font-bold flex items-center gap-2"
        >
          {loading ? (
             <span className="inline-block w-4 h-4 border-2 border-sakura-dark border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <span>🌸 今日运势</span>
          )}
        </button>
      ) : (
        <div className="bg-white/95 backdrop-blur shadow-xl border border-sakura-pink rounded-lg p-4 max-w-xs animate-appear font-serif">
           <div className="flex justify-between items-center mb-2">
             <span className="text-xs text-stone-400">TODAY'S MOOD</span>
             <span className="font-bold text-sakura-dark text-xl">{data.score}分</span>
           </div>
           <h3 className="text-2xl font-bold text-wood-dark mb-2">{data.theme}</h3>
           <p className="text-sm text-stone-600 leading-snug">{data.advice}</p>
           <button 
             onClick={() => {/* Simple logic to just clear local UI if needed, but for now we keep it visible */}} 
             className="mt-3 text-xs text-stone-400 hover:text-stone-600 underline w-full text-center"
           >
             Have a nice day
           </button>
        </div>
      )}
    </div>
  );
};

export default DailyHoroscope;
