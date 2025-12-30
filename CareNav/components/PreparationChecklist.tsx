
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PreparationChecklistProps {
  items: string[];
}

const PreparationChecklist: React.FC<PreparationChecklistProps> = ({ items }) => {
  return (
    <div className="space-y-3 mt-4">
      <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
        Preparation Checklist
      </h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:border-blue-200"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-slate-600 text-sm md:text-base leading-snug">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreparationChecklist;
