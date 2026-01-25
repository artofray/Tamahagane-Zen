
import React, { useEffect, useState } from 'react';
import { Sword, Zap, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface PiRaiAppearanceProps {
  onDismiss: () => void;
  message: string;
}

export const PiRaiAppearance: React.FC<PiRaiAppearanceProps> = ({ onDismiss, message }) => {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'present'>('closed');
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    // Stage the drama
    const t1 = setTimeout(() => {
        setPhase('opening');
        setShouldShake(true);
    }, 500);
    
    const t2 = setTimeout(() => {
        setPhase('present');
        setShouldShake(false);
    }, 1300);

    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl transition-all duration-1000 ${phase !== 'closed' ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Particles/Dust */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-80"></div>
        <div className="absolute bottom-0 left-[-20%] w-[140%] h-[40%] bg-gradient-to-t from-orange-900/10 to-transparent opacity-20 blur-3xl animate-drift"></div>
      </div>

      <div className={`relative max-w-2xl w-full flex flex-col items-center transition-transform duration-300 ${shouldShake ? 'animate-shake' : ''}`}>
        
        {/* The Temporal Rift */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-[80vh] bg-orange-500 shadow-[0_0_100px_orange] transition-all duration-700 ease-out z-0 ${phase === 'opening' ? 'scale-x-[400] scale-y-110 opacity-100' : phase === 'present' ? 'scale-x-[300] scale-y-100 opacity-5' : 'scale-x-0 opacity-0'}`}></div>

        {/* Master's Entry */}
        <div className={`relative mb-12 transition-all duration-1000 ease-out transform z-10 ${phase === 'present' ? 'scale-100 opacity-100 translate-y-0' : 'scale-150 opacity-0 -translate-y-20'}`}>
          
          <div className="relative w-80 h-96 animate-float perspective-1000">
             {/* The Master Visual */}
             <div className="w-full h-full bg-slate-900 rounded-[4rem] border-4 border-orange-500/30 shadow-[0_0_100px_rgba(249,115,22,0.2)] overflow-hidden relative">
                <img 
                    src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                    alt="Forge backdrop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-orange-500/10"></div>
                
                {/* Symbolic Figure representation (Since we can't use the direct file, we use an icon centered in a majestic way) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                        <Sword size={120} className="text-white drop-shadow-[0_0_20px_white] relative z-10" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black font-orbitron text-white tracking-widest drop-shadow-lg">PI RAI</h2>
                        <p className="text-orange-500 font-bold uppercase tracking-[0.4em] text-xs italic">Master of the Forge</p>
                    </div>
                </div>

                {/* Chopsticks ready to pluck excuses */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-12 rotate-[-5deg]">
                    <div className="w-1.5 h-64 bg-slate-800 rounded-full border-r border-white/5 shadow-2xl"></div>
                    <div className="w-1.5 h-64 bg-slate-800 rounded-full border-r border-white/5 shadow-2xl"></div>
                </div>
             </div>

             {/* Floating Ember Particles */}
             <div className="absolute -top-10 -left-10 w-2 h-2 bg-orange-500 rounded-full blur-sm animate-pulse"></div>
             <div className="absolute top-20 -right-10 w-3 h-3 bg-white rounded-full blur-sm animate-bounce"></div>
          </div>

          {/* Master's Eye (Floating Oracle) */}
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-slate-900 rounded-full border-2 border-orange-500 flex items-center justify-center shadow-2xl z-20 animate-pulse">
             <div className="w-6 h-6 bg-orange-500 rounded-full shadow-[0_0_20px_orange] flex items-center justify-center">
                <div className="w-1 h-4 bg-white rounded-full"></div>
             </div>
          </div>
        </div>

        {/* Cinematic Dialogue */}
        <div className={`w-full max-w-xl transition-all duration-1000 delay-500 transform ${phase === 'present' ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-slate-900/80 border border-orange-500/30 p-10 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
            
            <div className="flex items-center gap-3 mb-6">
                <Zap className="text-orange-500" size={20} />
                <span className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] glitch-text" data-text="MASTER'S ULTIMATUM">MASTER'S ULTIMATUM</span>
            </div>

            <p className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed mb-10 text-center">
              "{message}"
            </p>

            <div className="flex flex-col gap-4">
                <Button 
                    fullWidth 
                    onClick={onDismiss} 
                    className="py-6 font-black uppercase tracking-widest bg-white text-slate-950 hover:bg-orange-500 hover:text-white transition-all duration-300 scale-100 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    Accept Discipline
                </Button>
                <p className="text-center text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                    Excuses will be plucked. Results will be forged.
                </p>
            </div>
            
            {/* Corner Decorative Shard */}
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-orange-500/10 rotate-45 border border-orange-500/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
