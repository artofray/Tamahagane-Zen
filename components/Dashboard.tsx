
import React, { useRef, useState } from 'react';
import { UserProfile, DailyZen } from '../types';
import { Button } from './Button';
import { Play, Flame, Snowflake, Camera, Loader2, Sword, Zap, Image as ImageIcon, Video, Wand2, Sparkles, BrainCircuit } from 'lucide-react';
import { generateForgeImage, editForgeImage, generateForgeVideo, analyzeTechnique } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  onStartWorkout: () => void;
  isLoading: boolean;
  zen: DailyZen | null;
  onPhotoUpload: (url: string) => void;
  onVideoUpload: (url: string) => void;
  isZenLoading?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  profile, 
  onStartWorkout, 
  isLoading, 
  zen, 
  onPhotoUpload,
  onVideoUpload,
  isZenLoading = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [mediaPrompt, setMediaPrompt] = useState('');
  const [mediaSize, setMediaSize] = useState<"1K" | "2K" | "4K">("1K");
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleGen = async () => {
    if (!mediaPrompt) return;
    setIsMediaLoading(true);
    try {
      const url = await generateForgeImage(mediaPrompt, mediaSize);
      if (url) onPhotoUpload(url);
    } catch (e) { console.error(e); } finally { setIsMediaLoading(false); }
  };

  const handleEdit = async () => {
    if (!profile.photoUrl || !mediaPrompt) return;
    setIsMediaLoading(true);
    try {
      const url = await editForgeImage(profile.photoUrl, mediaPrompt);
      if (url) onPhotoUpload(url);
    } catch (e) { console.error(e); } finally { setIsMediaLoading(false); }
  };

  const handleVeo = async () => {
    if (!profile.photoUrl) return;
    setIsMediaLoading(true);
    try {
      const url = await generateForgeVideo(profile.photoUrl, mediaPrompt, true);
      if (url) onVideoUpload(url);
    } catch (e) { console.error(e); } finally { setIsMediaLoading(false); }
  };

  const handleAnalyze = async () => {
    if (!profile.videoUrl) return;
    setIsMediaLoading(true);
    try {
      const result = await analyzeTechnique(profile.videoUrl, "Check my form and give me the Pi Rai tough love.");
      setAnalysis(result);
    } catch (e) { console.error(e); } finally { setIsMediaLoading(false); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsMediaLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => { onPhotoUpload(reader.result as string); setIsMediaLoading(false); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-5xl mx-auto">
      {/* Brand Hero - Clashing Visuals from User Input */}
      <div className="relative group overflow-hidden rounded-[3rem] border border-slate-800 shadow-2xl h-[450px] flex flex-col items-center justify-center bg-slate-950">
        <img 
          src="https://raw.githubusercontent.com/google-gemini/aistudio-frame/main/examples/assets/iron_sharpens_iron.png" 
          alt="Iron Sharpens Iron" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[10s] ease-linear"
          onError={(e) => {
            // Fallback to the user's base64/image if external link fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80';
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950"></div>

        <div className="relative z-10 p-12 text-center space-y-4">
           {/* Minimal overlay branding since image has text */}
           <div className="flex items-center justify-center gap-6 mb-4">
              <Flame className="text-orange-500 animate-pulse" size={48} />
              <div className="h-12 w-px bg-white/20"></div>
              <Snowflake className="text-blue-500 animate-pulse" size={48} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main CTAs */}
          <div className={`bg-gradient-to-br from-slate-900 ${profile.alignment === 'fire' ? 'to-orange-950/20' : 'to-blue-950/20'} p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group`}>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
             
             <div className="flex justify-between items-start mb-8 relative z-10">
               <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Initiation Protocol</p>
                 <h2 className="text-5xl font-orbitron font-bold tracking-tighter text-white">STAGE {profile.currentDay}</h2>
               </div>
               <div className={`h-16 w-16 rounded-3xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner group-hover:rotate-6 transition-transform`}>
                 {profile.alignment === 'fire' ? <Flame className="text-orange-500" size={32} /> : <Snowflake className="text-blue-500" size={32} />}
               </div>
             </div>

             <Button 
               fullWidth 
               className={`py-8 text-3xl font-black tracking-tighter transition-all hover:scale-[1.02] active:scale-95 ${profile.alignment === 'fire' ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/40' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'}`} 
               onClick={onStartWorkout} 
               disabled={isLoading}
             >
               {isLoading ? <Loader2 className="animate-spin" /> : <><Play size={32} fill="currentColor"/> ENTER THE FORGE</>}
             </Button>
          </div>

          {/* Gemini Forge Engine */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="text-blue-400" size={24} />
              <h3 className="font-orbitron font-bold text-lg text-slate-200">GEMINI FORGE ENGINE</h3>
            </div>
            <div className="space-y-4">
              <textarea 
                placeholder="Declare your vision to the forge master..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-200 placeholder:text-slate-600"
                value={mediaPrompt}
                onChange={e => setMediaPrompt(e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl">
                  {(['1K', '2K', '4K'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setMediaSize(size)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${mediaSize === size ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={handleGen} disabled={isMediaLoading} className="py-2 px-4 text-xs">
                    <ImageIcon size={16}/> Forge Image
                  </Button>
                  <Button variant="secondary" onClick={handleEdit} disabled={isMediaLoading || !profile.photoUrl} className="py-2 px-4 text-xs">
                    <Wand2 size={16}/> Refine Photo
                  </Button>
                  <Button variant="secondary" onClick={handleVeo} disabled={isMediaLoading || !profile.photoUrl} className="py-2 px-4 text-xs">
                    <Video size={16}/> Animate (Veo)
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {analysis && (
            <div className="bg-slate-900 border-l-4 border-orange-500 p-8 rounded-r-3xl animate-in fade-in slide-in-from-left-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                 <BrainCircuit className="text-orange-500" size={20} />
                 <h4 className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em]">Pi Rai's Technical Verdict</h4>
              </div>
              <p className="text-slate-300 italic text-lg leading-relaxed font-serif">"{analysis}"</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 shadow-xl">
            <h3 className="font-orbitron font-bold text-slate-500 text-[10px] tracking-[0.3em] uppercase">The Forge Log</h3>
            {profile.photoUrl ? (
              <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border-4 border-slate-800 shadow-2xl group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img src={profile.photoUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Camera className="text-white" size={32} />
                </div>
                {isMediaLoading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-orange-500" size={32} />
                    <span className="text-[10px] font-black text-slate-500 uppercase">Quenching Steel...</span>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square bg-slate-950 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-orange-500/50 transition-colors group"
              >
                <div className="p-4 rounded-2xl bg-slate-900 group-hover:bg-orange-500/10 transition-colors">
                  <Camera size={40} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Seal Your Progress</span>
              </button>
            )}
            
            {profile.videoUrl && (
              <div className="space-y-4 w-full">
                <div className="aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-black shadow-2xl">
                  <video src={profile.videoUrl} controls className="w-full h-full" />
                </div>
                <Button fullWidth variant="ghost" onClick={handleAnalyze} disabled={isMediaLoading} className="py-2 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-800">
                  {isMediaLoading ? <Loader2 className="animate-spin" /> : <><BrainCircuit size={16}/> Analyze Discipline</>}
                </Button>
              </div>
            )}
            
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
          </div>

          {zen && (
            <div className={`bg-gradient-to-br from-slate-900 ${profile.alignment === 'fire' ? 'to-orange-600/10 border-orange-500/20' : 'to-blue-600/10 border-blue-500/20'} p-8 rounded-[2rem] border relative overflow-hidden group`}>
              <Sword className={`absolute -top-4 -right-4 w-20 h-20 rotate-12 opacity-5 ${profile.alignment === 'fire' ? 'text-orange-500' : 'text-blue-500'}`} />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap size={16} className={profile.alignment === 'fire' ? 'text-orange-500' : 'text-blue-500'} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Master's Quench</span>
                </div>
                <p className="text-xl font-bold text-white leading-tight italic font-serif">"{zen.mantra}"</p>
                <p className="text-xs text-slate-500 leading-relaxed italic">{zen.inspiration}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
