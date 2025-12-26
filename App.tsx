import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HabitTracker } from './components/HabitTracker';
import { SleepTracker } from './components/SleepTracker';
import { WorkoutUnlock } from './components/WorkoutUnlock';
import { AppView, Habit, SleepLog, UserStats, XP_TABLE } from './types';

// Mock Data Initialization
const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Read 20 pages', difficulty: 'medium', completedToday: false, streak: 5, xpReward: 25 },
  { id: '2', name: 'No Sugar', difficulty: 'hard', completedToday: true, streak: 12, xpReward: 50 },
  { id: '3', name: 'Drink 3L Water', difficulty: 'easy', completedToday: false, streak: 2, xpReward: 10 },
];

const INITIAL_STATS: UserStats = {
  level: 5,
  xp: 450,
  xpToNextLevel: 1000,
  screentimeBalanceMinutes: 45,
  streakDays: 12
};

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([
    { date: 'Mon', hours: 7.5, quality: 8 },
    { date: 'Tue', hours: 6, quality: 5 },
    { date: 'Wed', hours: 8, quality: 9 },
  ]);

  // Toast State (Simple Alert substitute)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const awardXP = (amount: number, message: string) => {
    setStats(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;

      if (newXp >= prev.xpToNextLevel) {
        newXp = newXp - prev.xpToNextLevel;
        newLevel += 1;
        newXpToNext = Math.floor(prev.xpToNextLevel * 1.2);
        setToast({ message: `LEVEL UP! You are now level ${newLevel}`, type: 'success' });
      } else {
        setToast({ message: `+${amount} XP: ${message}`, type: 'success' });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext
      };
    });
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id && !h.completedToday) {
        awardXP(h.xpReward, `Completed ${h.name}`);
        // Add screentime bonus
        setStats(s => ({ ...s, screentimeBalanceMinutes: s.screentimeBalanceMinutes + 10 }));
        return { ...h, completedToday: true, streak: h.streak + 1 };
      }
      return h;
    }));
  };

  const handleAddHabit = (name: string, diff: 'easy' | 'medium' | 'hard') => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      difficulty: diff,
      completedToday: false,
      streak: 0,
      xpReward: XP_TABLE[diff]
    };
    setHabits([...habits, newHabit]);
  };

  const handleAddSleepLog = (log: SleepLog) => {
    setSleepLogs([...sleepLogs, log]);
    awardXP(15, 'Sleep Logged');
  };

  const handleUnlockScreentime = (minutes: number, xp: number) => {
    setStats(prev => ({
      ...prev,
      screentimeBalanceMinutes: prev.screentimeBalanceMinutes + minutes
    }));
    awardXP(xp, 'Workout Verified');
  };

  return (
    <Layout stats={stats} currentView={currentView} setView={setCurrentView}>
      
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg shadow-emerald-500/30 font-bold border border-emerald-400">
                {toast.message}
            </div>
        </div>
      )}

      {currentView === AppView.DASHBOARD && <Dashboard stats={stats} />}
      {currentView === AppView.HABITS && <HabitTracker habits={habits} onToggleHabit={handleToggleHabit} onAddHabit={handleAddHabit} />}
      {currentView === AppView.SLEEP && <SleepTracker logs={sleepLogs} onAddLog={handleAddSleepLog} />}
      {currentView === AppView.WORKOUT && <WorkoutUnlock onUnlock={handleUnlockScreentime} />}
      
    </Layout>
  );
}