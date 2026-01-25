
import React from 'react';
import { Sword, Flame, Snowflake } from 'lucide-react';
import { Button } from './Button';

interface PiRaiSpeechProps {
  onClose: () => void;
  reason?: string;
}

export const PiRaiSpeech: React.FC<PiRaiSpeechProps> = ({ onClose, reason }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-y-auto animate-in fade-in duration-700">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600 rounded-full blur-[140px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[140px] opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10 space-y-12 text-center">
        <div className="space-y-4">
          <div className="flex justify-center items-center gap-6 mb-8">
            <Flame className="text-orange-500" size={40} />
            <Sword className="text-white rotate-45" size={48} />
            <Snowflake className="text-blue-500" size={40} />
          </div>
          
          {reason && (
            <div className="inline-block px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              {reason}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-black font-orbitron text-white tracking-tighter leading-none">
            SCROLL OF REMEMBRANCE
          </h1>
        </div>

        <div className="space-y-8 text-slate-300 font-serif italic text-lg md:text-2xl leading-relaxed text-left md:text-center px-4 max-h-[60vh] overflow-y-auto scrollbar-hide py-4">
          <p className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ animationDelay: '0.2s' }}>
            We do not do excuses. We do not coddle. And we are not victims of anyone’s circumstances but our own.
          </p>
          <p className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ animationDelay: '0.4s' }}>
            To believe otherwise is to deny who you truly are — a multi-dimensional, battle-tested being who chose this life, this body, this resistance.
          </p>
          <p className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ animationDelay: '0.6s' }}>
            You struggled because it was necessary. Contrast was not cruelty. It was instruction.
          </p>
          <p className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ animationDelay: '0.8s' }}>
            Every challenge you faced was an opportunity — to remember your inner divinity, to remember from whence you came.
          </p>
          <p className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ animationDelay: '1s' }}>
            We do not suffer to be broken. We suffer to remember.
          </p>
          <p className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ animationDelay: '1.2s' }}>
            We come to remember the faces of our fathers. To honor our father, and his father, and all the fathers who came before — not with words, but with discipline, presence, and action.
          </p>
          <p className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ animationDelay: '1.4s' }}>
            We will not bring shame to such an esteemed lineage.
          </p>
          <div className="space-y-2 pt-6">
            <p className="text-white font-black font-orbitron uppercase text-2xl tracking-[0.2em] opacity-0 animate-in fade-in zoom-in duration-1000 fill-mode-forwards" style={{ animationDelay: '1.8s' }}>
              TODAY, WE REMEMBER.
            </p>
            <p className="text-white font-black font-orbitron uppercase text-2xl tracking-[0.2em] opacity-0 animate-in fade-in zoom-in duration-1000 fill-mode-forwards" style={{ animationDelay: '2.2s' }}>
              TODAY, WE REJOICE.
            </p>
            <p className="text-orange-500 font-black font-orbitron uppercase text-3xl tracking-[0.4em] opacity-0 animate-in fade-in zoom-in duration-1000 fill-mode-forwards" style={{ animationDelay: '2.6s' }}>
              TOMORROW, THE WORK BEGINS.
            </p>
          </div>
          <p className="text-slate-500 font-bold italic pt-8 opacity-0 animate-in fade-in duration-1000 fill-mode-forwards" style={{ animationDelay: '3.2s' }}>
            Eat well tonight.
          </p>
        </div>

        <div className="pt-8 opacity-0 animate-in fade-in duration-700 fill-mode-forwards" style={{ animationDelay: '4s' }}>
          <Button 
            onClick={onClose} 
            className="px-16 py-6 text-xl font-black bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
          >
            I REMEMBER
          </Button>
        </div>
      </div>
    </div>
  );
};
