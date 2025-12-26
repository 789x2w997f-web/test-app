import React from 'react';
import { UserStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, TrendingUp, Zap, Lock } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const productivityData = [
    { name: 'Mon', hours: 4, type: 'Work' },
    { name: 'Tue', hours: 6, type: 'Work' },
    { name: 'Wed', hours: 3, type: 'Work' },
    { name: 'Thu', hours: 7, type: 'Work' },
    { name: 'Fri', hours: 5, type: 'Work' },
    { name: 'Sat', hours: 2, type: 'Personal' },
    { name: 'Sun', hours: 1, type: 'Personal' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <Zap size={20} /> <span className="text-sm font-bold uppercase">Streak</span>
          </div>
          <div className="text-4xl font-bold">{stats.streakDays} <span className="text-lg font-normal opacity-70">Days</span></div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-slate-700">
           <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Clock size={20} /> <span className="text-sm font-bold uppercase">Screentime Bank</span>
          </div>
          <div className="text-4xl font-bold text-emerald-400">{stats.screentimeBalanceMinutes} <span className="text-lg font-normal text-slate-500">mins</span></div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-slate-700">
           <div className="flex items-center gap-3 mb-2 text-slate-400">
            <TrendingUp size={20} /> <span className="text-sm font-bold uppercase">Productivity</span>
          </div>
          <div className="text-4xl font-bold text-blue-400">28 <span className="text-lg font-normal text-slate-500">hours</span></div>
        </div>
      </div>

      {/* Deep Work Chart */}
      <div className="bg-surface p-6 rounded-2xl border border-slate-700 h-80">
        <h3 className="text-lg font-bold text-white mb-6">Deep Work Hours</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productivityData}>
            <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
            <Tooltip 
                cursor={{fill: '#334155'}}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            />
            <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {productivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'Work' ? '#6366f1' : '#10b981'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
            <h4 className="text-slate-400 text-xs font-bold uppercase mb-4">Focus Modes</h4>
            <div className="flex gap-2">
                <button className="flex-1 bg-surface hover:bg-slate-700 py-3 rounded-lg border border-slate-700 text-sm font-medium transition-colors">
                    Pomodoro
                </button>
                 <button className="flex-1 bg-surface hover:bg-slate-700 py-3 rounded-lg border border-slate-700 text-sm font-medium transition-colors">
                    Deep Work
                </button>
            </div>
         </div>
         <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
                <h4 className="text-slate-400 text-xs font-bold uppercase mb-1">Next Reward</h4>
                <p className="text-white font-medium">Unlock "Gaming" Category</p>
            </div>
            <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                <Lock size={16} className="text-slate-500" />
            </div>
         </div>
      </div>
    </div>
  );
};