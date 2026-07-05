'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';


interface MatrixData {
  name: string;
  domain: string;
  complexity: number;
  impact: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: MatrixData }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-xl">
        <p className="font-bold text-white mb-1">{data.name}</p>
        <p className="text-sm text-gray-400">Domain: {data.domain}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-[var(--accent-primary)]">Technical Complexity: {data.complexity}/100</p>
          <p className="text-[var(--accent-secondary)]">Business Impact: {data.impact}/100</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function ComplexityMatrix({ data = [] }: { data: MatrixData[] }) {
  return (
    <div className="w-full h-[500px] bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
      <h3 className="text-xl font-bold mb-6 text-white text-center">Project Complexity vs. Impact Matrix</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            dataKey="complexity" 
            name="Complexity" 
            stroke="#9ca3af" 
            tick={{ fill: '#9ca3af' }}
            domain={[0, 100]}
            label={{ value: 'Technical Complexity ➔', position: 'bottom', fill: '#9ca3af' }} 
          />
          <YAxis 
            type="number" 
            dataKey="impact" 
            name="Impact" 
            stroke="#9ca3af" 
            tick={{ fill: '#9ca3af' }}
            domain={[0, 100]}
            label={{ value: 'Business Impact ➔', angle: -90, position: 'left', fill: '#9ca3af' }}
          />
          <ZAxis type="category" dataKey="name" name="Project" />
          <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#6b7280' }} content={<CustomTooltip />} />
          <Scatter name="Projects" data={data} fill="var(--accent-primary)">
            {data.map((entry: MatrixData, index: number) => (
              <circle 
                key={`cell-${index}`} 
                cx={0} 
                cy={0} 
                r={15} 
                fill={entry.domain === 'Backend' ? 'var(--accent-secondary)' : entry.domain === 'Architecture' ? '#3b82f6' : 'var(--accent-primary)'} 
                className="hover:scale-110 transition-transform cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                style={{ filter: 'drop-shadow(0px 0px 8px rgba(139,92,246,0.4))' }}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
