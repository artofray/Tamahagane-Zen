
import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { WorkoutView } from './components/WorkoutView';
import { SkillsView } from './components/SkillsView';
import { AcademyView } from './components/AcademyView';
import { PlanRoadmap } from './components/PlanRoadmap';
import { PiRaiSpeech } from './components/PiRaiSpeech';
import { PiRaiAppearance } from './components/PiRaiAppearance';
import { UserProfile, WorkoutSession, DailyZen } from './types';
import { getDayRoutine, generateMindfulness } from './services/geminiService';
import { LayoutGrid, Map, Activity, BookOpen, Sword, UserCircle, RotateCcw } from 'lucide-react';

type AppState = 'onboarding' | 'dashboard' | 'workout' | 'skills' | 'academy' | 'plan';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('onboarding');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [dailyZen, setDailyZen] = useState<DailyZen | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isZenLoading, setIsZenLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSpeech, setShowSpeech] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [speechReason, setSpeechReason] = useState<string>('');
  const [appearanceMessage, setAppearanceMessage] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('tamahagane_profile_v2');
    if (saved) {
      const parsed = JSON.parse(saved) as UserProfile;
      setProfile(parsed);
      setState('dashboard');
      fetchZen(parsed);

      // Trigger Logic for Pi Rai Appearance
      if (parsed.lastCheckIn) {
        const lastDate = new Date(parsed.lastCheckIn);
        const now = new Date();
        const diffMs = now.getTime() - lastDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // Significant lapses trigger the rift
        if (diffHours > 96) {
          setAppearanceMessage("Four suns have set on an empty forge. You have forgotten the faces of your fathers. I have arrived to remind you.");
          setShowAppearance(true);
        } else if (diffHours > 72) {
          setAppearanceMessage("The steel is brittle and your will is cold. Do you seek mastery, or simply a place to hide from the work?");
          setShowAppearance(true);
        } else if (diffHours > 48) {
          setSpeechReason("STREAK BROKEN: THE FORGE HAS COOLED");
          setShowSpeech(true);
        }
      }
    }
  }, []);

  const fetchZen = async (userProfile: UserProfile) => {
    setIsZenLoading(true);
    try {
      const zen = await generateMindfulness(userProfile);
      setDailyZen(zen);
    } catch (err) {
      console.error("Zen fetch failed", err);
    } finally {
      setIsZenLoading(false);
    }
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    const fullProfile: UserProfile = { ...newProfile, streak: 1, currentDay: 1, lastCheckIn: new Date().toDateString() };
    setProfile(fullProfile);
    localStorage.setItem('tamahagane_profile_v2', JSON.stringify(fullProfile));
    setState('dashboard');
    fetchZen(fullProfile);
    // Always show speech on first join
    setSpeechReason("INITIATION PROTOCOL");
    setShowSpeech(true);
  };

  const handlePhotoUpload = (url: string) => {
    if (profile) {
      const updated = { ...profile, photoUrl: url, lastCheckIn: new Date().toDateString() };
      setProfile(updated);
      localStorage.setItem('tamahagane_profile_v2', JSON.stringify(updated));
    }
  };

  const handleVideoUpload = (url: string) => {
    if (profile) {
      const updated = { ...profile, videoUrl: url, lastCheckIn: new Date().toDateString() };
      setProfile(updated);
      localStorage.setItem('tamahagane_profile_v2', JSON.stringify(updated));
    }
  };

  const startDayWorkout = async (day: number) => {
    setIsLoading(true);
    try {
      const session = await getDayRoutine(day);
      setCurrentSession(session);
      setState('workout');
    } catch (err) {
      setError("Failed to forge your routine.");
    } finally {
      setIsLoading(false);
    }
  };

  const completeWorkout = () => {
    if (profile) {
      const updated = { 
        ...profile, 
        streak: profile.streak + 1, 
        currentDay: Math.min(30, profile.currentDay + 1),
        lastCheckIn: new Date().toDateString() 
      };
      setProfile(updated);
      localStorage.setItem('tamahagane_profile_v2', JSON.stringify(updated));
    }
    setState('dashboard');
  };

  const handleManualReset = () => {
    setAppearanceMessage("You seek a clean slate? The forge does not erase; it refines. Prepare for re-initiation.");
    setShowAppearance(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500">
      {showSpeech && (
        <PiRaiSpeech reason={speechReason} onClose={() => setShowSpeech(false)} />
      )}

      {showAppearance && (
        <PiRaiAppearance 
          message={appearanceMessage} 
          onDismiss={() => {
            setShowAppearance(false);
            if (appearanceMessage.includes("re-initiation") || appearanceMessage.includes("forgotten")) {
              setSpeechReason("RE-INITIATION PROTOCOL");
              setShowSpeech(true);
            }
          }} 
        />
      )}

      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setState('dashboard')}>
            <Sword size={22} className="text-orange-500 transition-transform group-hover:rotate-12" />
            <span className="font-orbitron font-black text-2xl tracking-tighter">TAMAHAGANE ZEN</span>
          </div>
          <div className="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest">
            {[{id: 'dashboard', icon: <LayoutGrid size={16}/>, label: 'FORGE'},
              {id: 'plan', icon: <Map size={16}/>, label: 'PATH'},
              {id: 'skills', icon: <Activity size={16}/>, label: 'DRILLS'},
              {id: 'academy', icon: <BookOpen size={16}/>, label: 'PI RAI'}].map(nav => (
              <button key={nav.id} onClick={() => setState(nav.id as any)} className={`${state === nav.id ? (profile?.alignment === 'fire' ? 'text-orange-400' : 'text-blue-400') : 'text-slate-500'} flex items-center gap-2 hover:text-white transition-colors`}>
                {nav.icon} {nav.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleManualReset}
              className="p-2 text-slate-600 hover:text-white transition-colors"
              title="Reset Protocol"
            >
              <RotateCcw size={20} />
            </button>
            <UserCircle size={28} className="text-slate-700 hover:text-orange-500 cursor-pointer transition-colors" onClick={() => setState('onboarding')} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 py-12">
        {state === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
        {state === 'dashboard' && profile && (
          <Dashboard 
            profile={profile} 
            onStartWorkout={() => startDayWorkout(profile.currentDay)} 
            isLoading={isLoading} 
            zen={dailyZen} 
            onPhotoUpload={handlePhotoUpload}
            onVideoUpload={handleVideoUpload}
            isZenLoading={isZenLoading}
          />
        )}
        {state === 'plan' && profile && <PlanRoadmap profile={profile} onStartDay={startDayWorkout} isLoading={isLoading} />}
        {state === 'workout' && currentSession && <WorkoutView session={currentSession} onComplete={completeWorkout} />}
        {state === 'skills' && <SkillsView />}
        {state === 'academy' && <AcademyView />}
      </main>
    </div>
  );
};

export default App;
