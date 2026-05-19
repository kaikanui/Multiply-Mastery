/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameState = 'MENU' | 'PLAYING' | 'PRACTICE' | 'LEADERBOARD' | 'PROFILE';

export interface ScoreEntry {
  id: string;
  userId: string;
  userName: string;
  score: number;
  mode: 'competitive' | 'practice';
  timestamp: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  highScore: number;
  totalGames: number;
  experience: number;
  level: number;
}

export interface GameSettings {
  roundDuration: number; // seconds
  gridSize: number;
}

export const STORAGE_KEYS = {
  PROFILE: 'multiply_master_profile',
  LEADERBOARD: 'multiply_master_leaderboard',
};
