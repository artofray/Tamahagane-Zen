
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sword, Loader2, ScrollText, Volume2 } from 'lucide-react';
import { Button } from './Button';
import { chatWithPiRai, decodeBase64, decodeAudio, encodeBase64 } from '../services/geminiService';
import { GoogleGenAI, Modality } from "@google/genai";

export const AcademyView: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [chat, setChat] = useState<{role: 'user' | 'model', text: string}[]>([
    {role: 'model', text: "Greetings, Practitioner. I am Pi Rai. I hover between the realms of discipline and failure. If you are late, keep your excuses; I carry chopsticks for eyes, not for food. How shall we sharpen your edge?"}
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
    } catch (e) { setChat(prev => [...prev, { role: 'model', text: "The spirit connection is weak. Discipline your internet." }]); }
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
        systemInstruction: "You are Pi Rai. Ruthless but fair. Tough love. Disciplinarian. Chopsticks ready."
      }
    });
    liveSessionRef.current = session;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center space-y-6 shadow-xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 mx-auto flex items-center justify-center border border-slate-700 shadow-2xl">
              <Sword size={40} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-orbitron font-bold">MASTER PI RAI</h2>
              <p className="text-xs text-orange-500 font-black uppercase tracking-widest mt-1">Hovering Mentor</p>
            </div>
            <div className="space-y-3">
              <Button fullWidth variant={isLive ? 'danger' : 'primary'} onClick={toggleLive}>
                {isLive ? <MicOff size={18}/> : <Mic size={18}/>}
                {isLive ? 'End Voice Session' : 'Start Live Training'}
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setShowScroll(!showScroll)}>
                <ScrollText size={18}/> The Initiation Scroll
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ancient Drills</h3>
             {['Breath Control', 'Postural Sovereignty', 'Mental Stillness'].map((drill, i) => (
               <div key={i} className="flex items-center gap-3 p-4 bg-slate-800/40 rounded-2xl border border-transparent hover:border-blue-500/30 transition-all cursor-pointer">
                 <Volume2 size={16} className="text-blue-500" />
                 <span className="text-sm font-bold">{drill}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col h-[700px] bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          {showScroll && (
            <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-12 overflow-y-auto animate-in fade-in zoom-in duration-300">
               <div className="max-w-lg mx-auto space-y-8 text-center">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-orbitron font-bold text-orange-500">INITIATION</h2>
                    <button onClick={() => setShowScroll(false)} className="text-slate-500 hover:text-white">Close</button>
                 </div>
                 <div className="space-y-6 text-slate-300 font-serif italic text-lg leading-relaxed">
                   <p>We do not do excuses. We do not coddle. And we are not victims of anyone’s circumstances but our own.</p>
                   <p>To believe otherwise is to deny who you truly are — a multi-dimensional, battle-tested being who chose this life, this body, this resistance.</p>
                   <p>You struggled because it was necessary. Contrast was not cruelty. It was instruction.</p>
                   <p>Every challenge you faced was an opportunity — to remember your inner divinity, to remember from whence you came.</p>
                   <p>We do not suffer to be broken. We suffer to remember.</p>
                   <p>We come to remember the faces of our fathers. To honor our father, and his father, and all the fathers who came before — not with words, but with discipline, presence, and action.</p>
                   <p>We will not bring shame to such an esteemed lineage.</p>
                   <p>Today, we remember. Today, we rejoice. Tomorrow, the work begins.</p>
                   <p className="font-bold text-orange-400">Eat well tonight.</p>
                 </div>
               </div>
            </div>
          )}

          <div className="bg-slate-900/80 backdrop-blur-md p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isLive ? 'LIVE TRANSMISSION' : 'FORGE CONVERSATION'}</p>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-6">
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
                className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                placeholder="Declare your intent to the Master..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} className="h-14 w-14 rounded-2xl bg-orange-600 hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/30">
                <Send size={20}/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
