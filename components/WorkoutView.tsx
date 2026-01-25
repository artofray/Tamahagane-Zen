
import React, { useState, useEffect } from 'react';
import { WorkoutSession, Exercise, SearchResult } from '../types';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, Video, CheckCircle2, Info, Search, Zap } from 'lucide-react';
import { findTechniqueResources } from '../services/geminiService';

interface WorkoutViewProps {
  session: WorkoutSession;
  onComplete: () => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({ session, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resources, setResources] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const currentExercise = session.exercises[currentStep];

  useEffect(() => {
    const fetchResources = async () => {
      setIsSearching(true);
      try {
        const results = await findTechniqueResources(currentExercise.name);
        setResources(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchResources();
  }, [currentStep, currentExercise.name]);

  const handleNext = () => {
    if (currentStep < session.exercises.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const progress = ((currentStep + 1) / session.exercises.length) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter">Day {session.day}: {session.title}</h2>
          <p className="text-slate-500 flex items-center gap-2 mt-1">
            <Zap size={14} className="text-blue-500" /> {session.exercises.length} Exercises in sequence
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800">
           <div className="text-right">
             <p className="text-[10px] font-black text-slate-500 uppercase">Current Step</p>
             <p className="text-lg font-bold">{currentStep + 1} / {session.exercises.length}</p>
           </div>
           <div className="w-px h-8 bg-slate-800"></div>
           <div className="flex gap-1">
             {session.exercises.map((_, i) => (
               <div key={i} className={`w-2 h-2 rounded-full ${i <= currentStep ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
             ))}
           </div>
        </div>
      </header>

      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
        <div 
          className="bg-blue-500 h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] min-h-[450px] flex flex-col relative overflow-hidden">
            <div className="absolute -top-10 -right-10 p-20 bg-blue-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex-grow space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full text-xs font-black uppercase tracking-widest">
                  {currentExercise.discipline}
                </div>
                {currentExercise.reps && (
                  <div className="text-2xl font-orbitron font-black text-white bg-slate-800 px-4 py-2 rounded-xl">
                    {currentExercise.reps}
                  </div>
                )}
              </div>
              
              <h3 className="text-5xl font-orbitron font-bold mb-4 leading-none tracking-tighter">{currentExercise.name}</h3>
              <p className="text-slate-400 text-xl leading-relaxed">
                {currentExercise.description}
              </p>
            </div>

            <div className="mt-12 flex gap-4 relative z-10">
              <Button variant="secondary" onClick={handlePrev} disabled={currentStep === 0} className="px-8">
                <ChevronLeft size={24} />
              </Button>
              <Button fullWidth onClick={handleNext} className="scale-105 shadow-xl shadow-blue-500/20 py-5 text-xl">
                {currentStep === session.exercises.length - 1 ? 'FINISH WORKOUT' : 'NEXT EXERCISE'}
                <ChevronRight size={24} />
              </Button>
            </div>
          </div>

          <div className="bg-blue-600/5 p-8 rounded-3xl border border-blue-500/10 flex gap-4">
             <Info className="text-blue-500 shrink-0 mt-1" size={24} />
             <div>
               <h5 className="font-bold text-blue-200">Execution Tip</h5>
               <p className="text-sm text-slate-400 italic mt-1 leading-relaxed">
                 Maintain controlled, mindful breathing during this set. Quality of movement is superior to speed.
               </p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-6">
              <Search size={20} className="text-blue-500" />
              <h4 className="font-orbitron text-sm font-bold tracking-widest uppercase">Form Reference</h4>
            </div>
            
            <div className="space-y-6">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                  <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Sourcing Demonstration...</p>
                </div>
              ) : (
                <>
                  <div className="aspect-video bg-slate-950 rounded-3xl overflow-hidden relative border border-slate-800 group">
                    <img 
                      src={`https://picsum.photos/seed/${currentExercise.name}/800/450`} 
                      alt="Instructional" 
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-6 bg-blue-600/20 backdrop-blur-md rounded-full border border-blue-500/30 group-hover:scale-110 transition-transform shadow-2xl">
                        <Video size={40} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Mastery Resources</p>
                    {resources.map((res, i) => (
                      <a 
                        key={i} 
                        href={res.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800 rounded-2xl border border-slate-700/50 transition-all hover:translate-x-1"
                      >
                        <span className="truncate max-w-[250px] text-sm font-semibold text-slate-200">{res.title}</span>
                        <Video size={16} className="text-blue-500 shrink-0" />
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
