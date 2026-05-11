import React from 'react';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  score: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score }) => {
  const colors = {
    low: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    medium: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
    high: 'text-accent-pink bg-accent-pink/10 border-accent-pink/20',
  };

  return (
    <div className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-tighter flex items-center gap-2 ${colors[level]}`}>
      <div className={`w-2 h-2 rounded-full animate-pulse ${level === 'low' ? 'bg-accent-green' : level === 'medium' ? 'bg-accent-orange' : 'bg-accent-pink'}`} />
      {level} Risk · {score}%
    </div>
  );
};

export const RiskScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const getColor = () => {
    if (score < 30) return 'bg-accent-green';
    if (score < 60) return 'bg-accent-orange';
    return 'bg-accent-pink';
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase">
        <span>Average Risk Score</span>
        <span className="text-white">{score}%</span>
      </div>
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${getColor()} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
