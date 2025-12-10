import React from 'react';
import { AnalysisResult, AppTranslations } from '../types';
import { CheckCircle, RefreshCcw } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
  t: AppTranslations;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset, t }) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-200/50 border border-white overflow-hidden w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 px-6 py-10 text-white text-center relative overflow-hidden">
        {/* Abstract shapes for visual interest */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        
        <h2 className="text-lg font-semibold opacity-90 mb-3 relative z-10 tracking-wide uppercase text-violet-100">{t.recTitle}</h2>
        <div className="flex items-center justify-center gap-3 relative z-10">
            <span className="text-6xl font-extrabold tracking-tight drop-shadow-md">{result.recommendedSize}</span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* Estimated Measurements */}
        <div>
            <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4 text-center">{t.aiEstimates}</h3>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl text-center border border-violet-100 shadow-lg shadow-violet-100/50 hover:scale-105 transition-transform duration-300">
                    <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">{t.chest}</p>
                    <p className="text-xl font-extrabold text-slate-800">{result.estimatedChest}</p>
                    <span className="text-[10px] text-violet-400 font-medium">см</span>
                </div>
                <div className="bg-white p-4 rounded-2xl text-center border border-fuchsia-100 shadow-lg shadow-fuchsia-100/50 hover:scale-105 transition-transform duration-300 delay-75">
                    <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">{t.waist}</p>
                    <p className="text-xl font-extrabold text-slate-800">{result.estimatedWaist}</p>
                    <span className="text-[10px] text-fuchsia-400 font-medium">см</span>
                </div>
                <div className="bg-white p-4 rounded-2xl text-center border border-pink-100 shadow-lg shadow-pink-100/50 hover:scale-105 transition-transform duration-300 delay-150">
                    <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">{t.hips}</p>
                    <p className="text-xl font-extrabold text-slate-800">{result.estimatedHips}</p>
                    <span className="text-[10px] text-pink-400 font-medium">см</span>
                </div>
            </div>
        </div>

        {/* Reasoning */}
        <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-5 rounded-2xl border border-violet-100">
            <div className="flex items-start gap-4">
                <div className="bg-white p-1.5 rounded-full shadow-sm mt-0.5">
                    <CheckCircle className="w-5 h-5 text-violet-600" />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {result.reasoning}
                </p>
            </div>
        </div>

        <button 
            onClick={onReset}
            className="w-full py-4 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:text-violet-600 hover:border-violet-200 transition-all flex items-center justify-center gap-2 group"
        >
            <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
            {t.tryAgain}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;