
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';
import { Flame, Snowflake } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState<UserProfile>({
    height: "5'10\"",
    weight: 180,
    targetWeight: 165,
    experience: 'beginner',
    alignment: 'fire',
    streak: 0,
    currentDay: 1
  });

  return (
    <div className="max-w-md mx-auto p-8 space-y-8 bg-slate-900/80 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-blue-500 opacity-50"></div>
      
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400 mb-2">TAMAHAGANE ZEN</h1>
        <p className="text-slate-400 font-medium tracking-wide">Enter the Forge. Sharpen Your Edge.</p>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="space-y-3">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Choose Your Path Alignment</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setProfile({...profile, alignment: 'fire'})}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${profile.alignment === 'fire' ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-slate-800 bg-slate-800/50 text-slate-500'}`}
            >
              <Flame size={24} />
              <span className="text-xs font-bold uppercase">Fire (Will)</span>
            </button>
            <button 
              onClick={() => setProfile({...profile, alignment: 'ice'})}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${profile.alignment === 'ice' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-800/50 text-slate-500'}`}
            >
              <Snowflake size={24} />
              <span className="text-xs font-bold uppercase">Ice (Clarity)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Weight (lbs)</label>
            <input 
              type="number" 
              value={profile.weight}
              onChange={e => setProfile({...profile, weight: parseInt(e.target.value) || 0})}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Target (lbs)</label>
            <input 
              type="number" 
              value={profile.targetWeight}
              onChange={e => setProfile({...profile, targetWeight: parseInt(e.target.value) || 0})}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Experience</label>
          <select 
            value={profile.experience}
            onChange={e => setProfile({...profile, experience: e.target.value as any})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <Button 
          fullWidth 
          onClick={() => onComplete(profile)}
          className={`py-4 text-lg font-black tracking-widest shadow-2xl transition-all ${profile.alignment === 'fire' ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30'}`}
        >
          FORGE YOUR FLOW
        </Button>
      </div>
    </div>
  );
};
