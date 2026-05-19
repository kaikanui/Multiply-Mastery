/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerProfile, ScoreEntry, STORAGE_KEYS } from '../types';

export const getProfile = (): PlayerProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (profile: PlayerProfile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const getLeaderboard = (): ScoreEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
  return data ? JSON.parse(data) : [];
};

export const saveScore = (score: ScoreEntry) => {
  const leaderboard = getLeaderboard();
  leaderboard.push(score);
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard.slice(0, 50)));
};

export const createDefaultProfile = (name: string): PlayerProfile => ({
  id: crypto.randomUUID(),
  name,
  highScore: 0,
  totalGames: 0,
  experience: 0,
  level: 1,
});
