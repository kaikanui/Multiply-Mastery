/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useState } from 'react';
import { PlayerProfile } from '../types';
import { Play, Calculator, Target, Zap, ChevronRight } from 'lucide-react';

interface MenuProps {
  profile: PlayerProfile | null;
  onStart: (mode: 'competitive' | 'practice') => void;
  onCreateProfile: (name: string) => void;
}

export function Menu({ profile, onStart, onCreateProfile }: MenuProps) {
  const [name, setName] = useState('');

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-10 py-12">
        <div className="bold-card bg-zinc-900 border-2 border-zinc-700">
          <div className="mb-8">
            <span className="heading-label mb-2 block">Registration Required</span>
            <h2 className="font-display text-6xl tracking-tighter italic italic">OPERATOR_ID</h2>
          </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) onCreateProfile(name.trim());
            }}
            className="space-y-10"
          >
            <div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                placeholder="ENTER_NAME..."
                className="w-full border-b-4 border-zinc-800 bg-transparent py-4 font-black text-4xl outline-none focus:border-accent transition-colors placeholder:text-zinc-800"
              />
            </div>
            <button 
              type="submit"
              disabled={!name.trim()}
              className="bold-btn w-full py-6 text-xl bg-white text-zinc-950 border-white hover:bg-accent hover:border-accent disabled:opacity-20 transition-all font-black"
            >
              INITIALIZE_CORE
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-20 py-12">
      <div className="space-y-12">
        <header>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">System Live // Multiples Engine Active</span>
          </div>
          <h1 className="font-black text-[12vw] lg:text-9xl leading-[0.8] tracking-tighter mb-8 uppercase italic italic">
            CALCULATE <br/> <span className="text-accent underline decoration-8 underline-offset-8">COMMON</span> <br/> MULTIPLES
          </h1>
          <p className="font-bold text-zinc-500 max-w-md text-lg leading-tight uppercase tracking-tight">
            High-speed mathematical processing required. Optimize throughput to maintain global rank.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-6">
          <button 
            onClick={() => onStart('competitive')}
            className="group bold-btn flex flex-col items-start gap-4 p-8 h-auto bg-accent text-zinc-950 border-accent hover:bg-white hover:border-white transition-all"
          >
            <Play className="h-10 w-10 fill-current" />
            <div className="text-left">
              <span className="block text-3xl font-black tracking-tighter leading-none mb-1">COMPETITIVE</span>
              <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Ranked Cycle // Active Timer</span>
            </div>
          </button>

          <button 
            onClick={() => onStart('practice')}
            className="group bold-btn flex flex-col items-start gap-4 p-8 h-auto hover:bg-white hover:text-zinc-950 transition-all"
          >
            <Calculator className="h-10 w-10" />
            <div className="text-left">
              <span className="block text-3xl font-black tracking-tighter leading-none mb-1">PRACTICE</span>
              <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Zero Pressure // Skill Hone</span>
            </div>
          </button>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="bold-card border-2 border-zinc-800 bg-zinc-900/20 h-full flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 font-black text-[25vw] leading-none opacity-[0.03] select-none italic">
            {profile.level}
          </div>
          
          <div>
            <h3 className="heading-label mb-10">Operational Stats</h3>
            <div className="space-y-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Performance Level</span>
                <span className="text-7xl font-black tracking-tighter italic">L-{profile.level}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Max Throughput</span>
                <span className="text-7xl font-black tracking-tighter text-accent">{profile.highScore}</span>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-zinc-800/50">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white text-zinc-950 rounded-xl flex items-center justify-center font-black text-xl">
                 {profile.name.charAt(0).toUpperCase()}
               </div>
               <div>
                 <div className="text-xl font-black tracking-tight">{profile.name}</div>
                 <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Operator</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
