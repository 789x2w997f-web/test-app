import React from 'react';
import { Habit, XP_TABLE } from '../types';
import { Check, Flame, Plus } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (name: string, diff: 'easy' | 'medium' | 'hard') => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggleHabit, onAddHabit }) => {
  const [newHabitName, setNewHabitName] = React.useState('');
  const [newHabitDiff, setNewHabitDiff] = React.useState<'easy' | 'medium' | 'hard'>('easy');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName, newHabitDiff);
    setNewHabitName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Daily Quests</h2>
        <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-400 border border-slate-700">
          {habits.filter(h => h.completedToday).length}/{habits.length} Complete
        </span>
      </div>

      <div className="grid gap-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => !habit.completedToday && onToggleHabit(habit.id)}
            className={`relative group p-4 rounded-xl border transition-all cursor-pointer overflow-hidden ${
              habit.completedToday
                ? 'bg-emerald-900/20 border-emerald-500/30'
                : 'bg-surface border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    habit.completedToday
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-500 group-hover:bg-slate-600'
                  }`}
                >
                  {habit.completedToday && <Check size={18} />}
                </div>
                <div>
                  <h3 className={`font-medium ${habit.completedToday ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                    {habit.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className={`uppercase font-bold text-[10px] px-1.5 py-0.5 rounded ${
                        habit.difficulty === 'hard' ? 'bg-red-900/50 text-red-400' : 
                        habit.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-blue-900/50 text-blue-400'
                    }`}>
                        {habit.difficulty}
                    </span>
                    <span>+{habit.xpReward} XP</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-orange-500">
                <Flame size={16} className={habit.streak > 0 ? 'fill-orange-500' : ''} />
                <span className="font-mono font-bold">{habit.streak}</span>
              </div>
            </div>
            
            {/* Progress Bar Background Effect */}
            {habit.completedToday && (
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      {/* Add New Habit */}
      <form onSubmit={handleAdd} className="bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-700 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="New Habit Name..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <select
          value={newHabitDiff}
          onChange={(e) => setNewHabitDiff(e.target.value as any)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
        >
          <option value="easy">Easy (+{XP_TABLE.easy} XP)</option>
          <option value="medium">Medium (+{XP_TABLE.medium} XP)</option>
          <option value="hard">Hard (+{XP_TABLE.hard} XP)</option>
        </select>
        <button
          type="submit"
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
        >
          <Plus size={16} /> Add
        </button>
      </form>
    </div>
  );
};