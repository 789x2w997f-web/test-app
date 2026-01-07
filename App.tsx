
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Journey } from './components/Journey';
import { LogActivityModal } from './components/LogActivityModal';
import { AppView, UserStats, Habit, ActivityType } from './types';
// Import Zap icon from lucide-react
import { Zap } from 'lucide-react';

// Updated INITIAL_STATS to match expanded UserStats interface
const INITIAL_STATS: UserStats = {
  leisureBalance: 124,
  dailyGoalProgress: 68,
  streak: 14,
  totalWorkHours: 142,
  xp: 450,
  xpToNextLevel: 1000,
  level: 5,
  streakDays: 14,
  screentimeBalanceMinutes: 124
};

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Cold Shower', completed: true, color: 'bg-blue-400' },
  { id: '2', name: 'No Sugar', completed: false, color: 'bg-rose-400' },
  { id: '3', name: 'Read 20 Pages', completed: false, color: 'bg-indigo-400' },
  { id: '4', name: 'Meditation', completed: true, color: 'bg-emerald-400' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Toast for feedback
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogActivity = (type: ActivityType, minutes: number) => {
    let multiplier = 0.25; // Work
    if (type === 'WORKOUT') multiplier = 0.5;
    if (type === 'SLEEP') multiplier = 0.15;
    if (type === 'HABIT') multiplier = 0.1;

    const earned = Math.floor(minutes * multiplier);
    
    setStats(prev => ({
      ...prev,
      leisureBalance: prev.leisureBalance + earned,
      dailyGoalProgress: Math.min(100, prev.dailyGoalProgress + Math.floor(earned / 2)),
      totalWorkHours: type === 'WORK' ? prev.totalWorkHours + (minutes / 60) : prev.totalWorkHours,
      // Update screentime balance in sync with leisure balance
      screentimeBalanceMinutes: prev.screentimeBalanceMinutes + earned
    }));

    setToast({ message: `Deposited ${earned}m Leisure Credit`, type: 'success' });
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        if (!h.completed) {
          handleLogActivity('HABIT', 100); // Habits reward equivalent to 100 effort units
        }
        return { ...h, completed: !h.completed };
      }
      return h;
    }));
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onOpenLog={() => setIsLogModalOpen(true)} 
      />

      <main className="md:ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto p-8 pt-12">
          {currentView === AppView.DASHBOARD && (
            <Dashboard stats={stats} habits={habits} onToggleHabit={toggleHabit} />
          )}
          {currentView === AppView.JOURNEY && (
            <Journey />
          )}
          {(currentView === AppView.COMMUNITY || currentView === AppView.CALENDAR) && (
            <div className="h-[70vh] flex flex-col items-center justify-center bg-slate-900/30 rounded-[3rem] border border-slate-800">
               <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-slate-500 animate-pulse">
                 <Zap size={40} />
               </div>
               <h3 className="text-2xl font-black text-white">Feature in Staging</h3>
               <p className="text-slate-500">Reach Level 10 to unlock beta access.</p>
            </div>
          )}
        </div>
      </main>

      {isLogModalOpen && (
        <LogActivityModal 
          onClose={() => setIsLogModalOpen(false)} 
          onLog={handleLogActivity} 
        />
      )}

      {/* Dynamic Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-right-10">
          <div className="bg-white text-slate-950 px-8 py-4 rounded-2xl shadow-2xl font-black border-4 border-slate-950 flex items-center space-x-3">
            <Zap size={20} className="text-indigo-600" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
