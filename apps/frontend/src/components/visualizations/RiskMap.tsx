'use client';

import { motion } from 'framer-motion';

export default function RiskMap({ data = [] }: { data: any[] }) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 border-green-500/40 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
      case 'High': return 'bg-red-500/20 border-red-500/40 text-red-400';
      default: return 'bg-gray-800 border-gray-700 text-gray-400';
    }
  };

  const getHeatColor = (proficiency: number) => {
    if (proficiency >= 80) return 'bg-green-500';
    if (proficiency >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Target Role Risk Map</h3>
          <p className="text-gray-400 text-sm">Visualizing proficiency gaps against role requirements.</p>
        </div>
        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> Low Risk</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /> Medium</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> High Risk</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <motion.div 
            key={item.skill}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-2xl border ${getRiskColor(item.risk)} backdrop-blur-md relative overflow-hidden group`}
          >
            {/* Heat indicator background glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${getHeatColor(item.proficiency)} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
            
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg">{item.skill}</h4>
              {item.required && (
                <span className="text-[10px] uppercase font-black px-2 py-1 bg-black/40 rounded-full backdrop-blur-md">
                  Required
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold opacity-80">
                <span>Proficiency</span>
                <span>{item.proficiency}%</span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.proficiency}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full ${getHeatColor(item.proficiency)}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
