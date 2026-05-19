/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { GameState, PlayerProfile } from './types';
import { getProfile, saveProfile, createDefaultProfile } from './lib/storage';
import { Menu } from './components/Menu';
import { Game } from './components/Game';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Trophy, User, Home, Zap } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const saved = getProfile();
    if (saved) {
      setProfile(saved);
    }
    setIsInitializing(false);
  }, []);

  const handleCreateProfile = (name: string) => {
    const newProfile = createDefaultProfile(name);
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const updateProfileStats = (newScore: number) => {
    if (!profile) return;
    const updated = {
      ...profile,
      highScore: Math.max(profile.highScore, newScore),
      totalGames: profile.totalGames + 1,
      experience: profile.experience + (newScore * 10),
      level: Math.floor((profile.experience + newScore * 10) / 1000) + 1
    };
    setProfile(updated);
    saveProfile(updated);
  };

  if (isInitializing) {
    return <div className="flex h-screen items-center justify-center font-mono">INITIALIZING_SYSTEM...</div>;
  }

  if (!profile && gameState !== 'MENU') {
    setGameState('MENU');
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-accent selection:text-zinc-950">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-end justify-between px-10 py-6">
          <button 
            onClick={() => setGameState('MENU')}
            className="flex flex-col group"
          >
            <span className="text-zinc-500 text-[10px] font-black tracking-[0.3em] uppercase leading-none mb-1 group-hover:text-accent transition-colors">Project</span>
            <span className="font-display text-4xl tracking-tighter leading-none italic group-hover:text-accent transition-colors">MULTIPLY_MASTER</span>
          </button>

          <nav className="flex items-center gap-10">
            <button
              onClick={() => setGameState('LEADERBOARD')}
              className={`flex flex-col items-center group transition-colors ${gameState === 'LEADERBOARD' ? 'text-accent' : 'text-zinc-500 hover:text-white'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Ranks</span>
              <Trophy className={`h-4 w-4 mt-1 ${gameState === 'LEADERBOARD' ? 'fill-accent' : ''}`} />
            </button>
            <button
              onClick={() => setGameState('PROFILE')}
              className={`flex flex-col items-center group transition-colors ${gameState === 'PROFILE' ? 'text-accent' : 'text-zinc-500 hover:text-white'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{profile?.name || 'Profile'}</span>
              <User className={`h-4 w-4 mt-1 ${gameState === 'PROFILE' ? 'fill-accent' : ''}`} />
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-12">
        <AnimatePresence mode="wait">
          {gameState === 'MENU' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Menu 
                profile={profile} 
                onStart={(mode) => setGameState(mode === 'competitive' ? 'PLAYING' : 'PRACTICE')}
                onCreateProfile={handleCreateProfile}
              />
            </motion.div>
          )}

          {(gameState === 'PLAYING' || gameState === 'PRACTICE') && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Game 
                mode={gameState === 'PLAYING' ? 'competitive' : 'practice'}
                profile={profile!}
                onGameOver={(score) => {
                  updateProfileStats(score);
                  setGameState('LEADERBOARD');
                }}
                onExit={() => setGameState('MENU')}
              />
            </motion.div>
          )}

          {gameState === 'LEADERBOARD' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Leaderboard 
                onBack={() => setGameState('MENU')}
              />
            </motion.div>
          )}

          {gameState === 'PROFILE' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Profile 
                profile={profile!}
                onBack={() => setGameState('MENU')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-zinc-900 bg-zinc-950 py-2 px-6 text-center font-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
        v1.0.4 // SYSTEM_ACTIVE // FEEDBACK_LOOP_STABLE
      </footer>
    </div>
  );
}
