
import React from 'react';
import { DailyZen } from '../types';
import { Sparkles, Wind, Heart, Star } from 'lucide-react';

interface ZenZoneProps {
  zen: DailyZen;
}

export const ZenZone: React.FC<ZenZoneProps> = ({ zen }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 p-8 rounded-3xl border border-indigo-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2 text-indigo-400 mb-4">
          <Sparkles size={20} />
          <h3 className="font-orbitron text-sm font-bold tracking-widest uppercase">Daily Mantra</h3>
        </div>
        <p className="text-2xl font-bold text-white italic leading-tight">
          "{zen.mantra}"
        </p>
        <div className="mt-8 pt-6 border-t border-indigo-500/10">
          <h4 className="text-xs font-bold text-indigo-300 uppercase mb-2">Mindfulness Action</h4>
          <p className="text-slate-300">{zen.inspiration}</p>
        </div>
      </div>

      <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-4">
            <Wind size={20} />
            <h3 className="font-orbitron text-sm font-bold tracking-widest uppercase">5-Min Meditation</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {zen.meditationGuide}
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-pink-400">
            <Heart size={16} />
            <span className="text-xs font-bold uppercase">Gratitude Focus</span>
          </div>
          <ul className="space-y-2">
            {zen.gratitudeSuggestions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <Star size={12} className="mt-1 text-slate-600 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
