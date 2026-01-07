
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  JOURNEY = 'JOURNEY',
  COMMUNITY = 'COMMUNITY',
  CALENDAR = 'CALENDAR',
  HABITS = 'HABITS',
  SLEEP = 'SLEEP',
  WORKOUT = 'WORKOUT'
}

// Added Difficulty type for HabitTracker
export type Difficulty = 'easy' | 'medium' | 'hard';

// Added XP_TABLE constant for Habit rewards
export const XP_TABLE = {
  easy: 10,
  medium: 25,
  hard: 50
};

export type ActivityType = 'WORK' | 'WORKOUT' | 'SLEEP' | 'HABIT';

export interface Activity {
  id: string;
  type: ActivityType;
  label: string;
  durationMinutes: number;
  earnedLeisureMinutes: number;
  timestamp: Date;
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  // Added optional fields for HabitTracker consistency
  completedToday?: boolean;
  color: string;
  difficulty?: Difficulty;
  xpReward?: number;
  streak?: number;
}

// Added SleepLog interface for SleepTracker
export interface SleepLog {
  date: string;
  hours: number;
  quality: number;
}

export interface UserStats {
  leisureBalance: number; // in minutes
  dailyGoalProgress: number; // 0-100
  streak: number;
  totalWorkHours: number;
  // Added properties used in Layout.tsx
  xp: number;
  xpToNextLevel: number;
  level: number;
  streakDays: number;
  screentimeBalanceMinutes: number;
