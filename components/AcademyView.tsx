
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sword, Loader2, ScrollText, Volume2, Info, Compass } from 'lucide-react';
import { Button } from './Button';
import { chatWithPiRai, decodeBase64, decodeAudio, encodeBase64 } from '../services/geminiService';
import { GoogleGenAI, Modality } from "@google/genai";

const APPLICATIONS = [
  { name: "Peng (Ward Off)", dir: "South", trigram: "Heaven", icon: "S" },
  { name: "Lu (Roll Back)", dir: "North", trigram: "Earth", icon: "N" },
  { name: "Ji (Press)", dir: "West", trigram: "Water", icon: "W" },
  { name: "An (Push Down)", dir: "East", trigram: "Fire", icon: "E" },
];

const SECONDARY_APPS = [
  { name: "Cai (Pluck)", trigram: "Wind" },
  { name: "Lie (Split)", trigram: "Thunder" },
  { name: "Zhou (Elbow)", trigram: "Valley" },
  { name: "Kao (Shoulder)", trigram: "Mountain" },
];

export const AcademyView: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [chat, setChat] = useState<{role: 'user' | 'model', text: string}[]>([
    {role: 'model', text: "Greetings, Practitioner. I am Pi Rai. I hover between the realms of discipline and failure. How shall we sharpen your edge today?"}
  ]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    const msg = message; setMessage('');
    setChat(prev => [...prev, { role: 'user', text: msg }]);
    setIsLoading(true);
    try {
      const response = await chatWithPiRai(msg);
      setChat(prev => [...prev, { role: 'model', text: response || '' }]);
    } catch (e) { setChat(prev => [...prev, { role: 'model', text: "The spirit connection is weak." }]); }
    finally { setIsLoading(false); }
  };

  const toggleLive = async () => {
    if (isLive) {
      if (liveSessionRef.current) liveSessionRef.current.close();
      setIsLive(false);
      return;
    }
    setIsLive(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    const ctx = audioContextRef.current;
    const inputCtx = new AudioContext({ sampleRate: 16000 });
    const session = await ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(input.length);
              for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
              const base64 = encodeBase64(new Uint8Array(int16.buffer));
              session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          });
        },
        onmessage: async (msg) => {
          const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const buffer = await decodeAudio(decodeBase64(audio), ctx);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
          }
        },
        onclose: () => setIsLive(false),
        onerror: () => setIsLive(false)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
        systemInstruction: "You are Pi Rai. Ruthless disciplinarian."
      }
    });
    liveSessionRef.current = session;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center space-y-6 shadow-xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 mx-auto flex items-center justify-center border border-slate-700 shadow-2xl relative">
              <Sword size={40} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-orbitron font-bold">PI RAI</h2>
              <p className="text-xs text-orange-500 font-black uppercase tracking-widest mt-1">Master of Flow</p>
            </div>
            <div className="space-y-3">
              <Button fullWidth variant={isLive ? 'danger' : 'primary'} onClick={toggleLive}>
                {isLive ? <MicOff size={18}/> : <Mic size={18}/>}
                {isLive ? 'End Transmission' : 'Live Dialogue'}
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setShowScroll(!showScroll)}>
                <ScrollText size={18}/> Initiation Scroll
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setShowReference(!showReference)}>
                <Compass size={18}/> Bagua Reference
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Direct Applications</h3>
             <div className="grid grid-cols-2 gap-3">
                {APPLICATIONS.map(app => (
                  <div key={app.name} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex flex-col items-center">
                    <span className="text-[10px] text-orange-500 font-black">{app.dir}</span>
                    <span className="text-xs font-bold text-white text-center mt-1">{app.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Main Chat/Reference Area */}
        <div className="lg:col-span-2 flex flex-col h-[750px] bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          
          {/* Scroll Overlay */}
          {showScroll && (
            <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-12 overflow-y-auto animate-in fade-in zoom-in duration-300">
               <div className="max-w-lg mx-auto space-y-8 text-center">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-orbitron font-bold text-orange-500">SCROLL OF REMEMBRANCE</h2>
                    <button onClick={() => setShowScroll(false)} className="text-slate-500 hover:text-white">Close</button>
                 </div>
                 <div className="space-y-6 text-slate-300 font-serif italic text-lg leading-relaxed">
                   <p>We do not do excuses. We do not coddle. We are not victims.</p>
                   <p>To believe otherwise is to deny who you truly are — a multi-dimensional, battle-tested being.</p>
                   <p>Today, we remember. Tomorrow, the work begins. Eat well tonight.</p>
                 </div>
               </div>
            </div>
          )}

          {/* Reference Overlay */}
          {showReference && (
            <div className="absolute inset-0 z-50 bg-slate-950/98 backdrop-blur-xl p-8 overflow-y-auto animate-in slide-in-from-right-4 duration-300">
               <div className="space-y-10">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-orbitron font-bold text-blue-500">BAGUA & DIRECT APPLICATIONS</h2>
                    <button onClick={() => setShowReference(false)} className="text-slate-500 hover:text-white">Back to Chat</button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <h3 className="text-lg font-bold border-b border-slate-800 pb-2">The 4 Primary Directions</h3>
                      <div className="space-y-4">
                        {APPLICATIONS.map(app => (
                          <div key={app.name} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                             <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-xl border border-orange-500/20">
                               {app.icon}
                             </div>
                             <div>
                               <p className="font-bold text-white">{app.name}</p>
                               <p className="text-[10px] text-slate-500 uppercase tracking-widest">{app.trigram} / {app.dir}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-lg font-bold border-b border-slate-800 pb-2">Secondary Applications</h3>
                      <div className="space-y-4">
                        {SECONDARY_APPS.map(app => (
                          <div key={app.name} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                             <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xl border border-blue-500/20 italic">
                               {app.name.charAt(0)}
                             </div>
                             <div>
                               <p className="font-bold text-white">{app.name}</p>
                               <p className="text-[10px] text-slate-500 uppercase tracking-widest">{app.trigram}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                 </div>

                 <div className="p-8 bg-slate-900/50 rounded-[2rem] border border-slate-800">
                    <h3 className="font-orbitron text-xs font-black uppercase mb-4 text-slate-500">The 24 Form Path</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                       {["Commencing", "Wild Horse", "White Crane", "Brush Knee", "Playing Lute", "Repulse Monkey", "Grasp Tail", "Single Whip"].map(form => (
                         <div key={form} className="text-[10px] font-bold p-2 bg-slate-800/40 rounded-lg border border-transparent hover:border-blue-500/30 text-slate-400">
                            {form}
                         </div>
                       ))}
                       <div className="col-span-full text-center text-[10px] text-slate-600 italic">... and 16 more steps to mastery</div>
                    </div>
                 </div>
               </div>
            </div>
          )}

          <div className="bg-slate-900/80 backdrop-blur-md p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isLive ? 'LIVE' : 'CONVERSATION'}</p>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-xl' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700 shadow-xl'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <Loader2 className="animate-spin text-orange-500 mx-auto" />}
          </div>

          <div className="p-6 bg-slate-900/50 backdrop-blur-md border-t border-slate-800">
            <div className="flex gap-3">
              <input 
                type="text" 
                className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 text-sm text-white"
                placeholder="Consult with Pi Rai..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} className="h-14 w-14 rounded-2xl bg-orange-600 hover:bg-orange-500">
                <Send size={20}/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
