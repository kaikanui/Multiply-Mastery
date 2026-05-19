/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { PlayerProfile } from '../types';
import { User, ChevronLeft, Shield, FastForward, Activity } from 'lucide-react';

interface ProfileProps {
  profile: PlayerProfile;
  onBack: () => void;
}

export function Profile({ profile, onBack }: ProfileProps) {
  const xpProgress = (profile.experience % 1000) / 10; // Percentage to next level (assuming 1000xp per level)

  return (
    <div 
      className="mx-auto max-w-4xl px-10 py-12"
    >
      <div className="flex items-end justify-between mb-16">
        <div className="flex items-center gap-8">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-accent to-orange-500 flex items-center justify-center text-zinc-950">
                <User className="h-12 w-12" />
            </div>
            <div>
                <span className="heading-label mb-2 block">Operator Profile</span>
                <h1 className="font-black text-7xl tracking-tighter uppercase italic">{profile.name}</h1>
            </div>
        </div>
        <button onClick={onBack} className="bold-btn hover:bg-white hover:text-zinc-950 transition-all">
            <ChevronLeft className="h-4 w-4" /> Go Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bold-card bg-zinc-900 border-2 border-zinc-800 p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute -top-10 -right-10 font-black text-[20vw] opacity-[0.03] italic pointer-events-none">{profile.level}</div>
            <div>
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-2">Current Standing</span>
                <span className="font-black text-8xl italic">L-{profile.level}</span>
            </div>
            <div className="mt-12">
                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500 mb-2">
                    <span>XP PROGRESS</span>
                    <span>{xpProgress}%</span>
                </div>
                <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-1000" style={{ width: `${xpProgress}%` }} />
                </div>
            </div>
        </div>

        <div className="bold-card border-2 border-zinc-800 bg-zinc-950 p-8 space-y-10">
            <div>
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-4">Core Statistics</span>
              <div className="space-y-6">
                  <div className="flex justify-between items-baseline border-b border-zinc-900 pb-4">
                      <span className="text-xs font-black uppercase text-zinc-600">Peak Performance</span>
                      <span className="text-6xl font-black text-accent tracking-tighter">{profile.highScore}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-zinc-900 pb-4">
                      <span className="text-xs font-black uppercase text-zinc-600">Cycles Run</span>
                      <span className="text-6xl font-black text-white tracking-tighter">{profile.totalGames}</span>
                  </div>
              </div>
            </div>
        </div>
      </div>

      <div className="bold-card border-none bg-zinc-900/10 p-10">
        <div className="flex items-center gap-3 text-accent mb-8">
            <FastForward className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Algorithm Advancement</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4">
                <div className={`h-16 w-16 border-4 rounded-2xl ${profile.level >= 1 ? 'border-accent text-accent' : 'border-zinc-800 text-zinc-800'} flex items-center justify-center font-black text-3xl italic`}>01</div>
                <div>
                    <span className="block font-black text-sm uppercase tracking-tight">Basic Logic</span>
                    <span className="block text-[10px] font-black text-zinc-600 uppercase">Status: Active</span>
                </div>
            </div>
            <div className="flex flex-col gap-4 relative">
                <div className={`h-16 w-16 border-4 rounded-2xl ${profile.level >= 5 ? 'border-accent text-accent' : 'border-zinc-800 text-zinc-800'} flex items-center justify-center font-black text-3xl italic`}>05</div>
                <div>
                    <span className="block font-black text-sm uppercase tracking-tight">Rapid Calculation</span>
                    <span className="block text-[10px] font-black text-zinc-600 uppercase">{profile.level >= 5 ? 'Status: Active' : 'Required: L-5'}</span>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className={`h-16 w-16 border-4 rounded-2xl ${profile.level >= 10 ? 'border-accent text-accent' : 'border-zinc-800 text-zinc-800'} flex items-center justify-center font-black text-3xl italic`}>10</div>
                <div>
                    <span className="block font-black text-sm uppercase tracking-tight">Master Algorithm</span>
                    <span className="block text-[10px] font-black text-zinc-600 uppercase">{profile.level >= 10 ? 'Status: Active' : 'Required: L-10'}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
