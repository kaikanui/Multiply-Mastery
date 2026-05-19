/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerProfile, ScoreEntry } from '../types';
import { saveScore } from '../lib/storage';
import { Zap, Timer, Target, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameProps {
  mode: 'competitive' | 'practice';
  profile: PlayerProfile;
  onGameOver: (score: number) => void;
  onExit: () => void;
}

interface NumberTile {
  value: number;
  id: string;
  isCorrect: boolean;
  clicked: boolean;
}

export function Game({ mode, profile, onGameOver, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'competitive' ? 60 : 0);
  const [level, setLevel] = useState(1);
  const [currentProblem, setCurrentProblem] = useState<{ a: number; b: number; lcm: number }>({ a: 2, b: 3, lcm: 6 });
  const [tiles, setTiles] = useState<NumberTile[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'plus' | 'minus'; value: number } | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Lowest Common Multiple
  const getLCM = (a: number, b: number): number => {
    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
    return (a * b) / gcd(a, b);
  };

  const generateProblem = useCallback(() => {
    // Difficulty scaling based on level
    const max = Math.min(2 + level, 12);
    const a = Math.floor(Math.random() * (max - 2 + 1)) + 2;
    let b = Math.floor(Math.random() * (max - 2 + 1)) + 2;
    while (a === b) b = Math.floor(Math.random() * (max - 2 + 1)) + 2;
    
    const lcm = getLCM(a, b);
    setCurrentProblem({ a, b, lcm });

    // Generate tiles
    const newTiles: NumberTile[] = [];
    const correctCount = 3 + Math.floor(level / 2);
    const totalCount = 16;

    // Add correct ones (multiples of LCM)
    for (let i = 1; i <= correctCount; i++) {
        const val = lcm * (Math.floor(Math.random() * 5) + i);
        newTiles.push({
            value: val,
            id: crypto.randomUUID(),
            isCorrect: true,
            clicked: false
        });
    }

    // Add decoys
    while (newTiles.length < totalCount) {
        const val = Math.floor(Math.random() * (lcm * (5 + correctCount))) + 1;
        // Ensure not a common multiple and not already in
        if (val % a !== 0 || val % b !== 0) {
            newTiles.push({
                value: val,
                id: crypto.randomUUID(),
                isCorrect: false,
                clicked: false
            });
        }
    }

    // Shuffle
    setTiles(newTiles.sort(() => Math.random() - 0.5));
  }, [level]);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    if (mode === 'competitive') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleGameOver = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const finalScore = score;
    const scoreEntry: ScoreEntry = {
        id: crypto.randomUUID(),
        userId: profile.id,
        userName: profile.name,
        score: finalScore,
        mode: mode,
        timestamp: Date.now()
    };
    saveScore(scoreEntry);
    onGameOver(finalScore);
  };

  const handleTileClick = (tile: NumberTile) => {
    if (tile.clicked) return;

    if (tile.isCorrect) {
      const points = level * 10;
      setScore(s => s + points);
      setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, clicked: true } : t));
      setFeedback({ type: 'plus', value: points });
      
      if (mode === 'competitive') {
        setTimeLeft(t => Math.min(60, t + 2));
      }

      // Check if all correct tiles are clicked
      const remainingCorrect = tiles.filter(t => t.isCorrect && !t.clicked && t.id !== tile.id).length;
      if (remainingCorrect === 0) {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ccff00', '#ffffff', '#00ffff']
        });
        setLevel(l => l + 1);
        setTimeout(generateProblem, 600);
      }
    } else {
      const penalty = level * 5;
      setScore(s => Math.max(0, s - penalty));
      setFeedback({ type: 'minus', value: penalty });
      if (mode === 'competitive') {
        setTimeLeft(t => Math.max(0, t - 5));
      }
      setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, clicked: true } : t));
    }

    setTimeout(() => setFeedback(null), 1000);
  };

  return (
    <div className="mx-auto max-w-7xl px-10 flex flex-col lg:flex-row gap-10">
      {/* HUD & CONTROLS */}
      <aside className="lg:w-[320px] space-y-4 order-2 lg:order-1">
        <div className="bold-card p-6 flex flex-col justify-center border-2 border-zinc-800 bg-zinc-900">
            <span className="heading-label mb-2 flex items-center gap-1">
                <Target className="h-3 w-3" /> Total Score
            </span>
            <span className="font-black text-6xl tracking-tighter text-accent">{score.toLocaleString()}</span>
        </div>

        {mode === 'competitive' && (
            <div className={`bold-card p-6 flex flex-col justify-center border-2 transition-colors ${timeLeft < 10 ? 'bg-red-950 border-red-500' : 'bg-white border-white text-zinc-950'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest leading-none mb-2 opacity-60 ${timeLeft < 10 ? 'text-white' : 'text-zinc-500'}`}>
                    Time Remaining
                </span>
                <span className="font-black text-6xl tabular-nums leading-none italic">{timeLeft}s</span>
            </div>
        )}

        <div className="bold-card p-6 flex flex-col justify-center border-2 border-zinc-800 bg-zinc-900">
            <span className="heading-label mb-2">Stage Level</span>
            <span className="font-black text-6xl tracking-tighter italic">L-{level}</span>
        </div>

        <button 
            onClick={onExit}
            className="bold-btn w-full py-4 bg-zinc-900 border-zinc-800 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors flex items-center gap-2"
        >
            <X className="h-4 w-4" /> Terminate Session
        </button>
      </aside>

      {/* GAMEPLAY GRID */}
      <div className="flex-1 order-1 lg:order-2">
        <div className="mb-12">
            <h2 className="heading-label mb-2">Select Common Multiples of</h2>
            <div className="flex items-baseline gap-6">
                <motion.span 
                    key={currentProblem.a}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-8xl md:text-9xl font-black tracking-tighter italic"
                >
                    {currentProblem.a}
                </motion.span>
                <span className="text-4xl font-black text-zinc-700">&</span>
                <motion.span
                    key={currentProblem.b}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-8xl md:text-9xl font-black tracking-tighter italic text-accent"
                >
                    {currentProblem.b}
                </motion.span>
            </div>
            
            {mode === 'practice' && (
               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="mt-4 font-bold text-zinc-500 uppercase text-xs tracking-tight max-w-xl"
               >
                 LCM is <span className="text-white">{currentProblem.lcm}</span>. 
                 Look for numbers divisible by both {currentProblem.a} and {currentProblem.b}.
               </motion.p>
            )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
                {tiles.map((tile) => (
                    <motion.button
                        layout
                        key={tile.id}
                        disabled={tile.clicked}
                        onClick={() => handleTileClick(tile)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            h-32 rounded-2xl border-2 flex items-center justify-center font-black text-5xl transition-all
                            ${tile.clicked 
                                ? (tile.isCorrect ? 'bg-accent border-accent text-zinc-950 ring-8 ring-accent/20' : 'bg-red-500 border-red-500 text-white opacity-40')
                                : 'bg-zinc-900 border-zinc-700 hover:border-white text-white'
                            }
                        `}
                    >
                        {tile.value}
                    </motion.button>
                ))}
            </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
            <motion.div
                initial={{ opacity: 0, scale: 0.5, x: '-50%' }}
                animate={{ opacity: 1, scale: 2, y: -150 }}
                exit={{ opacity: 0 }}
                className={`fixed left-1/2 bottom-1/2 pointer-events-none font-black text-8xl z-[100] italic ${feedback.type === 'plus' ? 'text-accent' : 'text-red-500'}`}
            >
                {feedback.type === 'plus' ? '+' : '-'}{feedback.value}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
