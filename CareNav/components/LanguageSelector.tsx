
import React from 'react';
import { LANGUAGES } from '../constants';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  current: string;
  onChange: (code: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ current, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
      <Globe className="w-4 h-4 text-slate-500" />
      <select 
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
