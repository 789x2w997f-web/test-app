import React, { useRef, useState, useCallback } from 'react';
import { Camera, Lock, Unlock, Zap, Loader2, AlertCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { verifyWorkoutWithAI } from '../services/geminiService';

interface WorkoutUnlockProps {
  onUnlock: (minutes: number, xp: number) => void;
}

export const WorkoutUnlock: React.FC<WorkoutUnlockProps> = ({ onUnlock }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    verified: boolean;
    minutes?: number;
    message?: string;
  } | null>(null);

  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current) return;
    
    setAnalyzing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
        // Remove header for API
        const base64Data = imageSrc.split(',')[1];
        
        try {
            const aiResult = await verifyWorkoutWithAI(base64Data);
            
            if (aiResult.verified) {
                setResult({
                    verified: true,
                    minutes: aiResult.screentimeMinutesAwarded,
                    message: aiResult.motivationalComment
                });
                onUnlock(aiResult.screentimeMinutesAwarded, 20); // 20 XP base
            } else {
                 setResult({
                    verified: false,
                    message: "Workout not detected. Try framing your exercise equipment or pose clearly."
                });
            }
        } catch (e) {
            setResult({ verified: false, message: "Error connecting to AI." });
        }
    }
    setAnalyzing(false);
    setIsCapturing(false);
  }, [webcamRef, onUnlock]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-orange-500">
          Work to Unlock
        </h2>
        <p className="text-slate-400">
          Screentime is locked. Perform physical activity and let AI verify it to earn minutes.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-black rounded-2xl overflow-hidden border-2 border-slate-800 relative shadow-2xl">
        {isCapturing ? (
          <div className="relative">
             <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-64 object-cover"
                videoConstraints={{ facingMode: "user" }}
             />
             <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                 <button
                    onClick={captureAndVerify}
                    disabled={analyzing}
                    className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                 >
                    {analyzing ? <Loader2 className="animate-spin" /> : <Camera />}
                    {analyzing ? 'Analyzing...' : 'Snap Verification'}
                 </button>
             </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center bg-slate-900 p-6 text-center">
            {result?.verified ? (
                <div className="space-y-4 animate-pulse-fast">
                    <Unlock size={48} className="text-emerald-500 mx-auto" />
                    <div>
                        <h3 className="text-2xl font-bold text-white">UNLOCKED</h3>
                        <p className="text-emerald-400">+{result.minutes} Minutes Earned</p>
                    </div>
                    <p className="text-sm text-slate-400 italic">"{result.message}"</p>
                </div>
            ) : (
                <div className="space-y-4">
                     <Lock size={48} className="text-accent mx-auto" />
                     {result && !result.verified && (
                         <div className="bg-red-900/20 text-red-400 p-2 rounded text-sm flex items-center gap-2">
                             <AlertCircle size={14} /> {result.message}
                         </div>
                     )}
                     <div>
                        <h3 className="text-xl font-bold text-white">System Locked</h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Complete 10 pushups, hold a plank, or show gym equipment.
                        </p>
                     </div>
                </div>
            )}
          </div>
        )}
      </div>
      
      {!isCapturing && !result?.verified && (
        <div className="flex justify-center">
             <button
                onClick={() => { setIsCapturing(true); setResult(null); }}
                className="bg-accent hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center gap-2"
            >
                <Zap /> Start Challenge
            </button>
        </div>
      )}

      {/* Rules Section */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-surface p-4 rounded-xl border border-slate-700">
            <div className="text-2xl font-bold text-white mb-1">10</div>
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Squats</div>
            <div className="text-xs text-primary mt-1">+5 Mins</div>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-slate-700">
            <div className="text-2xl font-bold text-white mb-1">20</div>
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Pushups</div>
            <div className="text-xs text-primary mt-1">+15 Mins</div>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-slate-700">
            <div className="text-2xl font-bold text-white mb-1">Img</div>
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Gym Selfie</div>
            <div className="text-xs text-primary mt-1">+30 Mins</div>
        </div>
      </div>
    </div>
  );
};