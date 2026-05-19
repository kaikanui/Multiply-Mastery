/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { getLeaderboard } from '../lib/storage';
import { ScoreEntry } from '../types';
import { Trophy, ChevronLeft, Calendar } from 'lucide-react';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const scores = getLeaderboard();

  return (
    <div 
      className="mx-auto max-w-4xl px-10 py-12"
    >
      <div className="flex items-end justify-between mb-12">
        <div className="flex flex-col">
            <span className="heading-label mb-2">Hall of Fame</span>
            <h1 className="font-black text-7xl tracking-tighter uppercase italic">TOP_CONTENDERS</h1>
        </div>
        <button onClick={onBack} className="bold-btn flex items-center gap-2 hover:bg-white hover:text-zinc-950 transition-all">
            <ChevronLeft className="h-4 w-4" /> Go Back
        </button>
      </div>

      <div className="bold-card border-2 border-zinc-800 bg-zinc-900 overflow-hidden p-0">
        <div className="grid grid-cols-[80px_1fr_150px] px-8 py-4 border-b border-zinc-800 bg-zinc-950/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Rank</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Operator</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 text-right">Score</span>
        </div>

        <div className="divide-y divide-zinc-800">
            {scores.length === 0 ? (
                <div className="p-12 text-center font-black text-zinc-700 uppercase tracking-widest text-xs">
                    No data recorded yet
                </div>
            ) : (
                scores.map((score, index) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={score.id}
                        className={`grid grid-cols-[80px_1fr_150px] px-8 py-6 items-center group transition-all hover:bg-white/5 ${index === 0 ? 'bg-accent/5' : ''}`}
                    >
                        <span className={`font-black text-4xl italic ${index === 0 ? 'text-accent' : index === 1 ? 'text-zinc-300' : index === 2 ? 'text-zinc-500' : 'text-zinc-700'}`}>
                            {index + 1}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tight group-hover:text-accent transition-colors">{score.userName}</span>
                            <span className="text-[10px] font-black uppercase text-zinc-600 flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" /> {new Date(score.timestamp).toLocaleDateString()} <span className="opacity-40">//</span> {score.mode}
                            </span>
                        </div>
                        <span className={`font-black text-4xl text-right tracking-tighter ${index === 0 ? 'text-accent' : 'text-white'}`}>
                            {score.score.toLocaleString()}
                        </span>
                    </motion.div>
                ))
            )}
        </div>
      </div>

      <div className="mt-12 p-8 border-l-4 border-zinc-800 bg-zinc-900/10">
        <h3 className="heading-label mb-2">Algorithm Note</h3>
        <p className="font-bold text-zinc-600 text-sm max-w-2xl leading-snug">
            RANKINGS ARE DETERMINED BY PEAK LOGICAL THROUGHPUT RECORDED DURING AUTHENTICATED CYCLES. 
            CONTINUOUS OPTIMIZATION IS MANDATORY FOR RETENTION.
        </p>
      </div>
    </div>
  );
}
