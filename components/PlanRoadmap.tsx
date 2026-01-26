
import React from 'react';
import { UserProfile } from '../types';
import { CheckCircle2, Lock, Play, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface PlanRoadmapProps {
  profile: UserProfile;
  onStartDay: (day: number) => void;
  isLoading: boolean;
}

export const PlanRoadmap: React.FC<PlanRoadmapProps> = ({ profile, onStartDay, isLoading }) => {
  const currentDay = profile.currentDay || 1;

  const weeks = [
    { title: "WEEK 1: LAYING THE FOUNDATION", days: [1, 2, 3, 4, 5, 6, 7], color: "from-blue-500 to-cyan-500" },
    { title: "WEEK 2: BUILDING MOMENTUM", days: [8, 9, 10, 11, 12, 13, 14], color: "from-emerald-500 to-blue-500" },
    { title: "WEEK 3: INCREASING INTENSITY", days: [15, 16, 17, 18, 19, 20, 21], color: "from-orange-500 to-rose-500" },
    { title: "WEEK 4: MASTERING THE FORGE", days: [22, 23, 24, 25, 26, 27, 28, 29, 30], color: "from-slate-700 to-slate-950" }
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black font-orbitron text-white tracking-tighter leading-none">YOUR FIRST MONTH: <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">DAILY WORKOUT PLAN</span></h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">A scannable daily schedule for your 30-day fitness evolution. Iron sharpens iron.</p>
      </div>

      <div className="relative space-y-24">
        {/* Curvy background path logic simplified for React */}
        <div className="absolute left-1/2 -translate-x-1/2 top-20 bottom-0 w-2 bg-slate-900 rounded-full opacity-20 hidden lg:block"></div>

        {weeks.map((week, wIndex) => (
          <div key={week.title} className="relative">
            <div className="flex items-center gap-6 mb-10">
              <div className={`px-6 py-2 rounded-full bg-gradient-to-r ${week.color} text-white text-xs font-black uppercase tracking-[0.3em] shadow-lg`}>
                {week.title}
              </div>
              <div className="flex-grow h-px bg-slate-800"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
              {week.days.map((day) => {
                const isCompleted = day < currentDay;
                const isActive = day === currentDay;
                const isLocked = day > currentDay;

                return (
                  <div key={day} className="flex flex-col items-center">
                    <button
                      onClick={() => !isLocked && onStartDay(day)}
                      disabled={isLocked}
                      className={`
                        w-full aspect-square rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 relative group
                        ${isActive ? 'bg-white text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.2)] scale-110 border-4 border-blue-500' : ''}
                        ${isCompleted ? 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:border-blue-500/50' : ''}
                        ${isLocked ? 'bg-slate-950 border border-slate-900 opacity-40 cursor-not-allowed' : ''}
                        ${!isLocked && !isActive && !isCompleted ? 'bg-slate-900 border border-slate-800 hover:border-white/20' : ''}
                      `}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${isActive ? 'text-blue-600' : 'text-slate-600'}`}>Day</span>
                      <span className="text-3xl font-orbitron font-bold leading-none">{day}</span>
                      
                      <div className="absolute top-3 right-3">
                        {isCompleted && <CheckCircle2 size={16} className="text-emerald-500" />}
                        {isLocked && <Lock size={14} className="text-slate-800" />}
                        {isActive && <Zap size={18} className="text-blue-500 animate-pulse" />}
                      </div>

                      {/* Hover Info (Mock data representing infographic style) */}
                      {!isLocked && (
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[9px] font-bold px-3 py-1 rounded-lg whitespace-nowrap z-50 pointer-events-none border border-slate-700">
                          {day % 2 === 0 ? "Conditioning Focus" : "Combat Technical"}
                        </div>
                      )}
                    </button>
                    
                    {/* Visual Connector (simplified curvy line effect) */}
                    {day !== week.days[week.days.length - 1] && (
                       <div className="mt-4 hidden lg:block">
                          <ArrowRight className="text-slate-800" size={16} />
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/40 p-12 rounded-[3rem] border border-slate-800 flex flex-col lg:flex-row items-center gap-10">
        <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800">
           <ShieldCheck size={48} className="text-orange-500" />
        </div>
        <div className="space-y-3 text-center lg:text-left">
          <h3 className="text-2xl font-orbitron font-bold">THE WARRIOR CODE</h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl italic">
            "This infographic outlines the daily exercises for your journey. Every lunge, every strike, and every breath is a stroke of the hammer on the raw iron of your soul. We will not bring shame to our fathers."
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
             <Button onClick={() => onStartDay(currentDay)} disabled={isLoading}>
                RESUME INITIATION
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
