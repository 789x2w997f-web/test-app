export enum AppView {
  DASHBOARD = 'DASHBOARD',
  HABITS = 'HABITS',
  SLEEP = 'SLEEP',
  WORKOUT = 'WORKOUT',
  PROFILE = 'PROFILE'
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  screentimeBalanceMinutes: number; // Earned minutes
  streakDays: number;
}

export interface Habit {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completedToday: boolean;
  streak: number;
  xpReward: number;
}

export interface SleepLog {
  date: string;
  hours: number;
  quality: number; // 1-10
  aiAnalysis?: string;
}

export interface WorkoutLog {
  id: string;
  timestamp: Date;
  type: string;
  reps: number;
  verifiedByAI: boolean;
  xpEarned: number;
  screentimeEarned: number;
}

export const XP_TABLE = {
  easy: 10,
  medium: 25,
  hard: 50,
  workoutBase: 20,
};