import React from 'react';
import { SleepLog } from '../types';
import { Moon, Star, Brain } from 'lucide-react';
import { analyzeSleepPattern } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SleepTrackerProps {
  logs: SleepLog[];
  onAddLog: (log: SleepLog) => void;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({ logs, onAddLog }) => {
  const [hours, setHours] = React.useState(7);
  const [quality, setQuality] = React.useState(7);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [aiAdvice, setAiAdvice] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Call Gemini API
    const advice = await analyzeSleepPattern(hours, quality, logs);
    setAiAdvice(advice);
    
    onAddLog({
      date: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
      hours,
      quality,
      aiAnalysis: advice
    });
    
    setIsAnalyzing(false);
  };

  const chartData = logs.map(l => ({ name: l.date, hours: l.hours, quality: l.quality }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="bg-surface p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Moon className="text-secondary" /> Log Sleep
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Duration (Hours)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <span className="text-2xl font-bold font-mono w-16 text-right">{hours}h</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Quality (1-10)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <span className="text-2xl font-bold font-mono w-16 text-right flex items-center justify-end gap-1">
                    {quality}<Star size={16} className="fill-yellow-500 text-yellow-500" />
                </span>
              </div>
            </div>

            <button
              disabled={isAnalyzing}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isAnalyzing ? 'bg-slate-700 text-slate-400' : 'bg-secondary hover:bg-indigo-600 text-white'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Brain className="animate-pulse" /> Analyzing...
                </>
              ) : (
                'Save & Analyze'
              )}
            </button>
          </form>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={100} />
            </div>
          <h3 className="text-lg font-bold mb-4 text-slate-200">AI Sleep Coach</h3>
          <div className="h-full flex flex-col justify-center">
             {aiAdvice ? (
                <div className="prose prose-invert">
                    <p className="text-indigo-200 text-lg leading-relaxed italic">"{aiAdvice}"</p>
                </div>
             ) : (
                 <p className="text-slate-500 text-sm">Log your sleep to receive personalized, AI-generated recovery advice using Gemini.</p>
             )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-surface p-6 rounded-2xl border border-slate-700 h-64">
        <h4 className="text-sm font-semibold text-slate-400 mb-4">Weekly Trends</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#818cf8' }}
            />
            <Area type="monotone" dataKey="hours" stroke="#6366f1" fillOpacity={1} fill="url(#colorHours)" />
            <Area type="monotone" dataKey="quality" stroke="#fbbf24" strokeDasharray="3 3" fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};