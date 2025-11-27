import React, { useState, useCallback, useEffect } from 'react';
import { AppState, FortuneResponse, DailyHoroscopeResponse, GeneratedAssets } from './types';
import { drawFortune, getDailyHoroscope, generateOmikujiImage, getBoxPrompt, getStickPrompt } from './services/geminiService';
import SakuraBackground from './components/SakuraBackground';
import OmikujiBox from './components/OmikujiBox';
import Stick from './components/Stick';
import ResultPaper from './components/ResultPaper';
import DailyHoroscope from './components/DailyHoroscope';
import OpeningEffect from './components/OpeningEffect';

// Define a local interface for the injected object to avoid global namespace conflicts
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

// Helper to access the injected object without type conflicts
const getAIStudio = (): AIStudio => (window as any).aistudio;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('INIT');
  const [fortune, setFortune] = useState<FortuneResponse | null>(null);
  const [dailyData, setDailyData] = useState<DailyHoroscopeResponse | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  
  // Store generated assets
  const [assets, setAssets] = useState<GeneratedAssets>({ boxImage: null, stickImage: null });

  // 1. Initial Check for API Key
  const checkKeyAndLoad = useCallback(async () => {
    try {
      const hasKey = await getAIStudio().hasSelectedApiKey();
      if (!hasKey) {
        // State remains INIT, UI shows "Start" button
        return;
      }
      // If we have a key, proceed to check/generate assets
      startAssetGeneration();
    } catch (e) {
      console.error("Key check failed", e);
    }
  }, []);

  useEffect(() => {
    checkKeyAndLoad();
  }, [checkKeyAndLoad]);

  // 2. Asset Generation Logic
  const startAssetGeneration = async () => {
    if (assets.boxImage && assets.stickImage) {
      setState('IDLE');
      return;
    }

    setState('GENERATING_ASSETS');
    try {
      // Parallel generation
      const boxPromise = generateOmikujiImage(getBoxPrompt());
      const stickPromise = generateOmikujiImage(getStickPrompt());

      const [boxUrl, stickUrl] = await Promise.all([boxPromise, stickPromise]);

      setAssets({
        boxImage: boxUrl,
        stickImage: stickUrl
      });
      setState('IDLE');
    } catch (error) {
      console.error("Failed to generate assets", error);
      // Fallback or retry UI could go here, for now we just go to IDLE (components handle null images)
      // Or alert user to try again
      alert("Failed to paint the shrine. Please check your API key (paid project required for Image Gen).");
      setState('INIT'); 
    }
  };

  const handleStartExperience = async () => {
    try {
      await getAIStudio().openSelectKey();
      // Assume success and proceed (race condition mitigation handled by just calling load)
      startAssetGeneration();
    } catch (e) {
      console.error(e);
      alert("Something went wrong selecting the key.");
    }
  };

  // 3. Main Interaction Logic
  const handleShake = useCallback(async () => {
    if (state !== 'IDLE' && state !== 'ERROR') return;

    setState('SHAKING');

    // Simulate shaking duration
    setTimeout(() => {
      setState('STICK_DRAWN');
    }, 2000);
  }, [state]);

  const handleInterpret = useCallback(async () => {
    if (isInterpreting) return;
    setIsInterpreting(true);
    
    // Transition to Opening Animation state
    setState('OPENING');

    try {
      const minAnimationTime = 1500;
      const resultPromise = drawFortune();
      
      const [result] = await Promise.all([
        resultPromise,
        new Promise(resolve => setTimeout(resolve, minAnimationTime))
      ]);

      setFortune(result);
      setState('RESULT');
    } catch (error) {
      console.error(error);
      alert("神明似乎很忙 (API Error). Please check your API Key or try again.");
      setState('IDLE');
    } finally {
      setIsInterpreting(false);
    }
  }, [isInterpreting]);

  const handleReset = useCallback(() => {
    setState('IDLE');
    setFortune(null);
  }, []);

  const fetchDaily = useCallback(async () => {
    if (loadingDaily || dailyData) return;
    setLoadingDaily(true);
    try {
      const result = await getDailyHoroscope();
      setDailyData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDaily(false);
    }
  }, [loadingDaily, dailyData]);

  // UI Helper: Determine if box should be visible
  const isBoxVisible = state === 'IDLE' || state === 'SHAKING';

  // --- RENDER ---

  // 1. Initial State (No Key)
  if (state === 'INIT') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-sakura-light font-serif">
        <SakuraBackground />
        <div className="z-10 text-center p-8 bg-white/80 backdrop-blur rounded-xl shadow-xl border border-sakura-pink/50 max-w-md animate-appear">
          <h1 className="text-4xl font-bold text-vermilion mb-4">浅草寺</h1>
          <p className="text-stone-600 mb-6">Experience the mystical Omikuji with Anime-style visuals generated by Gemini.</p>
          <div className="text-xs text-stone-500 mb-6 border-l-2 border-vermilion pl-3 text-left">
            Note: This app uses <strong>gemini-3-pro-image-preview</strong> to generate the shrine graphics dynamically. You must select a paid API key project.
            <br/><a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline text-blue-500">Billing Info</a>
          </div>
          <button 
            onClick={handleStartExperience}
            className="bg-vermilion text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-transform hover:scale-105"
          >
            Enter Shrine (Select API Key)
          </button>
        </div>
      </div>
    );
  }

  // 2. Loading State (Generating Assets)
  if (state === 'GENERATING_ASSETS') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-sakura-light font-serif">
        <SakuraBackground />
        <div className="z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-sakura-dark border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold text-sakura-dark animate-pulse">Painting the Shrine...</h2>
          <p className="text-stone-500 mt-2">Summoning Nano Banana Pro (Gemini 3 Image)</p>
        </div>
      </div>
    );
  }

  // 3. Main App
  return (
    <div className="min-h-screen w-full relative overflow-hidden font-serif text-stone-800 bg-paper selection:bg-sakura-pink selection:text-white">
      <SakuraBackground />

      {/* Header */}
      <header className={`absolute top-0 w-full p-6 text-center z-10 transition-opacity duration-500 ${state === 'OPENING' || state === 'RESULT' ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-vermilion tracking-widest drop-shadow-sm font-[Zen Old Mincho]">
          浅草寺
        </h1>
        <p className="text-stone-500 mt-2 text-sm tracking-widest uppercase">Omikuji Fortune Telling</p>
      </header>

      {/* Daily Horoscope Widget */}
      <div className={`transition-opacity duration-500 ${state === 'OPENING' || state === 'RESULT' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <DailyHoroscope 
          data={dailyData} 
          loading={loadingDaily} 
          onGet={fetchDaily} 
        />
      </div>

      {/* Main Interaction Area */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20">
        
        {/* The Box */}
        <div className={`transform transition-all duration-1000 ease-in-out ${
            isBoxVisible 
            ? 'translate-y-10 opacity-100 scale-100' 
            : 'translate-y-[100vh] opacity-0 scale-75' 
          }`}>
          <OmikujiBox 
            shaking={state === 'SHAKING'} 
            onClick={handleShake} 
            disabled={state !== 'IDLE'}
            imageSrc={assets.boxImage}
          />
        </div>

        {/* The Stick */}
        {(state === 'STICK_DRAWN' || state === 'OPENING') && (
          <div className={`transition-opacity duration-500 ${state === 'OPENING' ? 'opacity-0' : 'opacity-100'}`}>
             <Stick 
               visible={true} 
               onInterpret={handleInterpret} 
               loading={isInterpreting}
               imageSrc={assets.stickImage}
             />
          </div>
        )}
        
        {/* The Opening Animation Effect */}
        {state === 'OPENING' && <OpeningEffect />}

      </main>

      {/* Result Modal */}
      {state === 'RESULT' && fortune && (
        <ResultPaper fortune={fortune} onClose={handleReset} />
      )}

      <footer className="absolute bottom-4 w-full text-center text-xs text-stone-400 z-0">
        © 2024 AI Shrine. Assets generated by Gemini 3 Pro.
      </footer>
    </div>
  );
};

export default App;