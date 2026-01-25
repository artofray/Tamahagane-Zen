
import React from 'react';
import { UserProfile } from '../types';
import { CheckCircle2, Lock, Play, Zap } from 'lucide-react';
import { Button } from './Button';

interface PlanRoadmapProps {
  profile: UserProfile;
  onStartDay: (day: number) => void;
  isLoading: boolean;
}

export const PlanRoadmap: React.FC<PlanRoadmapProps> = ({ profile, onStartDay, isLoading }) => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const currentDay = profile.currentDay || 1;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-800 border-dashed">
        <div className="relative w-40 h-40">
           {/* Progress Ring */}
           <svg className="w-full h-full transform -rotate-90">
             <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
             <circle 
                cx="80" cy="80" r="70" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * (currentDay - 1)) / 30}
                className="text-blue-500 transition-all duration-1000 ease-out" 
             />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-4xl font-orbitron font-bold text-white leading-none">{Math.round(((currentDay - 1) / 30) * 100)}%</span>
             <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Warrior Path</span>
           </div>
        </div>

        <div className="flex-grow space-y-4 text-center md:text-left">
          <h2 className="text-3xl font-orbitron font-bold tracking-tighter">THE 30-DAY INITIATION</h2>
          <p className="text-slate-400 max-w-xl">
            You are currently on <span className="text-blue-500 font-bold">Day {currentDay}</span>. 
            Complete today's Tai Chi and conditioning drill to unlock the next step in your evolution.
          </p>
          <div className="flex gap-4 pt-2">
            <Button onClick={() => onStartDay(currentDay)} disabled={isLoading} className="shadow-blue-500/10">
              {isLoading ? 'Loading Ritual...' : <><Play size={18} fill="currentColor"/> START DAY {currentDay}</>}
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold text-slate-300">
              <Zap size={14} className="text-yellow-500" /> NEXT: DAY {currentDay + 1}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
        {days.map((day) => {
          const isCompleted = day < currentDay;
          const isActive = day === currentDay;
          const isLocked = day > currentDay;

          return (
            <button
              key={day}
              onClick={() => !isLocked && onStartDay(day)}
              disabled={isLocked}
              className={`
                aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group
                ${isActive ? 'bg-blue-600 shadow-xl shadow-blue-500/20 scale-105 border-2 border-white/20' : ''}
                ${isCompleted ? 'bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800' : ''}
                ${isLocked ? 'bg-slate-900 border border-slate-800/50 opacity-50 grayscale' : ''}
              `}
            >
              <span className={`text-xs font-black uppercase tracking-tighter mb-1 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                Day
              </span>
              <span className={`text-xl font-orbitron font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {day}
              </span>
              
              <div className="absolute top-1 right-1">
                {isCompleted && <CheckCircle2 size={14} className="text-blue-400" />}
                {isLocked && <Lock size={12} className="text-slate-700" />}
                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>}
              </div>

              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
