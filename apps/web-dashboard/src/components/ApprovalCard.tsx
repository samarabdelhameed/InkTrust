import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertTriangle, ShieldCheck, Clock, Users } from 'lucide-react';

interface ApprovalCardProps {
  id: string;
  seniorName: string;
  merchant: string;
  amount: number;
  intent: string;
  riskScore: number;
  timestamp: string;
  onApprove: () => void;
  onReject: () => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  seniorName,
  merchant,
  amount,
  intent,
  riskScore,
  timestamp,
  onApprove,
  onReject
}) => {
  const getRiskColor = () => {
    if (riskScore < 30) return 'text-accent-green';
    if (riskScore < 60) return 'text-accent-orange';
    return 'text-accent-pink';
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden group"
    >
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${riskScore < 30 ? 'from-accent-green' : riskScore < 60 ? 'from-accent-orange' : 'from-accent-pink'} to-transparent opacity-50`} />
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50">
            <Users size={20} />
          </div>
          <div>
            <h4 className="font-bold text-lg">{seniorName} <span className="text-white/30 font-medium text-sm">requested</span></h4>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Clock size={12} /> {timestamp}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-white/60 leading-relaxed italic">"{intent}"</p>
        
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider font-bold text-white/40">
            Merchant: <span className="text-white/80">{merchant}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider font-bold text-white/40">
            Risk: <span className={getRiskColor()}>{riskScore}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-4 min-w-[140px]">
        <div className="text-2xl font-black neon-text">¥{amount.toLocaleString()}</div>
        <div className="flex gap-2">
          <button 
            onClick={onReject}
            className="w-12 h-12 rounded-2xl glass border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all"
          >
            <X size={20} />
          </button>
          <button 
            onClick={onApprove}
            className="w-12 h-12 rounded-2xl bg-accent-green/20 border border-accent-green/30 text-accent-green hover:bg-accent-green/40 flex items-center justify-center transition-all"
          >
            <Check size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
