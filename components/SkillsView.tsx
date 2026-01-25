
import React, { useState, useEffect } from 'react';
import { Search, Shield, Sword, Target, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { findTechniqueResources } from '../services/geminiService';
import { SearchResult } from '../types';

export const SkillsView: React.FC = () => {
  const [query, setQuery] = useState('Krav Maga basics');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = ['Krav Maga', 'Jiu-Jitsu', 'Tai Chi', 'Yoga Flow', 'Street Safety'];

  const searchTechniques = async (searchTerm: string) => {
    setLoading(true);
    setQuery(searchTerm);
    try {
      const data = await findTechniqueResources(searchTerm);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchTechniques(query);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter">Combat Skill Library</h1>
        <p className="text-slate-400">Master the arts of defense and internal balance.</p>
      </div>

      <div className="max-w-2xl mx-auto flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white"
            placeholder="Search techniques (e.g. Throat strike, escape mount...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchTechniques(query)}
          />
        </div>
        <Button onClick={() => searchTechniques(query)} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => searchTechniques(cat)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-bold text-slate-300 transition-colors uppercase border border-slate-700"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4 text-slate-500">
            <Loader2 className="animate-spin" size={32} />
            <p className="font-orbitron text-xs">Consulting the Grandmasters...</p>
          </div>
        ) : (
          results.map((res, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Shield size={20} />
                </div>
                <a href={res.uri} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
                  <ExternalLink size={18} />
                </a>
              </div>
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{res.title}</h3>
              <p className="text-sm text-slate-400 mb-6">Expert instructional resource for mastering tactical movements.</p>
              <Button variant="secondary" fullWidth className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
                Study Technique
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
