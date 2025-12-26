import React from 'react';
import { UserStats, AppView } from '../types';
import { Trophy, Activity, Moon, Dumbbell, LayoutDashboard, Lock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  stats: UserStats;
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, stats, currentView, setView }) => {
  const progressPercent = Math.min((stats.xp / stats.xpToNextLevel) * 100, 100);

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${
        currentView === view ? 'text-primary' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <Icon size={24} />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col md:flex-row max-w-7xl mx-auto overflow-hidden">
      {/* Mobile Header / Desktop Sidebar */}
      <aside className="md:w-64 bg-surface border-b md:border-b-0 md:border-r border-slate-700 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">LevelUp</h1>
            <p className="text-xs text-slate-400">Focus & Conquer</p>
          </div>
        </div>

        {/* Gamification Stats (Always Visible) */}
        <div className="px-6 pb-6">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-primary">Lvl {stats.level}</span>
              <span className="text-xs text-slate-400">{stats.xp} / {stats.xpToNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Lock size={12} className="text-accent" />
                  <span>Credits</span>
               </div>
               <span className="text-sm font-bold text-white">{stats.screentimeBalanceMinutes}m</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-col gap-1 px-4 flex-1">
          {[
            { id: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
            { id: AppView.HABITS, icon: Activity, label: 'Habits' },
            { id: AppView.SLEEP, icon: Moon, label: 'Sleep' },
            { id: AppView.WORKOUT, icon: Dumbbell, label: 'Workout Unlock' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentView === item.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-80px)] md:h-screen p-4 md:p-8 relative">
        <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-700 flex justify-between px-2 pb-safe z-30">
        <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Home" />
        <NavItem view={AppView.HABITS} icon={Activity} label="Habits" />
        <NavItem view={AppView.SLEEP} icon={Moon} label="Sleep" />
        <NavItem view={AppView.WORKOUT} icon={Dumbbell} label="Unlock" />
      </div>
    </div>
  );
};