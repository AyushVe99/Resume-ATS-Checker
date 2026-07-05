'use client';

import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

interface TimelineItem {
  role: string;
  company: string;
  year: string;
  domain: string;
  achievement: string;
}

export default function EvidenceTimeline({ data = [] }: { data: TimelineItem[] }) {
  return (
    <div className="w-full max-w-3xl mx-auto py-12">
      <h3 className="text-3xl font-extrabold text-center mb-16 text-white tracking-tight">Career Evidence Timeline</h3>
      
      <div className="relative border-l border-gray-800 ml-6 md:ml-12 space-y-12">
        {data.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative pl-10 md:pl-16"
          >
            {/* Timeline Node */}
            <div className="absolute -left-[20px] top-1 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/30 border-4 border-black">
              <Briefcase className="w-4 h-4 text-white" />
            </div>

            {/* Content Card */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl hover:bg-gray-800/50 transition-colors group border border-gray-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors">
                    {item.role}
                  </h4>
                  <p className="text-gray-400 font-medium">{item.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-900 rounded-full text-xs font-bold text-gray-400 border border-gray-700">
                    {item.year}
                  </span>
                  <span className="px-3 py-1 bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] rounded-full text-xs font-bold border border-[var(--accent-secondary)]/20">
                    {item.domain}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                &quot;{item.achievement}&quot;
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
