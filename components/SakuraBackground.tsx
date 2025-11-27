import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: number;
}

const SakuraBackground: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate static petals on mount to avoid re-renders causing jumpiness
    const newPetals = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 8}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: Math.random() * 10 + 10, // 10px to 20px
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-sakura-light to-white">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-fall opacity-0 text-sakura-pink"
          style={{
            left: petal.left,
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
          }}
        >
           <svg viewBox="0 0 30 30" fill="currentColor">
             <path d="M15,0 C15,0 20,10 30,15 C20,20 15,30 15,30 C15,30 10,20 0,15 C10,10 15,0 15,0 Z" />
           </svg>
        </div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
};

export default SakuraBackground;
