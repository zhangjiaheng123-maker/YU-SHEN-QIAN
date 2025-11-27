import React from 'react';
import { FortuneResponse, FortuneLevel } from '../types';

interface ResultPaperProps {
  fortune: FortuneResponse;
  onClose: () => void;
}

const ResultPaper: React.FC<ResultPaperProps> = ({ fortune, onClose }) => {
  const isGood = [FortuneLevel.DAIKICHI, FortuneLevel.KICHI, FortuneLevel.CHUKICHI, FortuneLevel.SHOKICHI].includes(fortune.level);
  const colorClass = isGood ? 'text-vermilion' : 'text-slate-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-paper max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl relative border-8 border-double border-wood-light animate-appear">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-stone-400 hover:text-stone-800 p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8 flex flex-col items-center font-serif text-ink">
          
          {/* Header Level */}
          <div className={`text-5xl font-bold mb-6 border-4 border-current px-6 py-4 tracking-widest ${colorClass}`}>
            {fortune.level}
          </div>

          {/* Poem Section */}
          <div className="bg-stone-100 p-6 w-full text-center mb-6 rounded-sm border border-stone-200">
            <h3 className="text-stone-400 text-xs mb-2 tracking-widest uppercase">The Oracle</h3>
            <p className="whitespace-pre-line text-lg font-medium leading-relaxed italic text-stone-700">
              {fortune.poem}
            </p>
            <div className="mt-4 text-sm text-stone-500 pt-4 border-t border-stone-200">
              {fortune.poem_explanation}
            </div>
          </div>

          {/* Details Grid */}
          <div className="w-full grid grid-cols-1 gap-4 text-left">
            <Section title="愿望 (Overview)" content={fortune.overview} />
            <div className="grid grid-cols-2 gap-4">
               <Section title="恋爱 (Love)" content={fortune.love} />
               <Section title="工作 (Work)" content={fortune.work} />
               <Section title="健康 (Health)" content={fortune.health} />
               <Section title="财运 (Money)" content={fortune.money} />
            </div>
            
            {/* Lucky Items */}
            <div className="mt-4 bg-sakura-light/50 p-4 rounded-lg border border-sakura-pink/30 flex justify-around text-center">
              <div>
                <div className="text-xs text-sakura-dark font-bold uppercase">Lucky Item</div>
                <div className="font-bold">{fortune.lucky_item}</div>
              </div>
              <div>
                <div className="text-xs text-sakura-dark font-bold uppercase">Lucky Color</div>
                <div className="font-bold">{fortune.lucky_color}</div>
              </div>
              <div>
                <div className="text-xs text-sakura-dark font-bold uppercase">Direction</div>
                <div className="font-bold">{fortune.lucky_direction}</div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-8 bg-wood-dark text-wood-light px-8 py-2 rounded shadow hover:bg-black transition-colors"
          >
            收起签文
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{title: string, content: string}> = ({ title, content }) => (
  <div className="border-b border-stone-200 pb-2">
    <h4 className="font-bold text-wood-dark text-sm mb-1">{title}</h4>
    <p className="text-sm text-stone-700">{content}</p>
  </div>
);

export default ResultPaper;
