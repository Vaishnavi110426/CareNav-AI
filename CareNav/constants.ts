
export const LANGUAGES = [
  { code: 'en', name: 'English', label: 'English' },
  { code: 'hi', name: 'Hindi', label: 'हिन्दी' },
  { code: 'es', name: 'Spanish', label: 'Español' },
  { code: 'fr', name: 'French', label: 'Français' },
  { code: 'de', name: 'German', label: 'Deutsch' },
  { code: 'zh', name: 'Chinese', label: '中文' },
  { code: 'ja', name: 'Japanese', label: '日本語' },
  { code: 'pt', name: 'Portuguese', label: 'Português' },
  { code: 'ar', name: 'Arabic', label: 'العربية' },
  { code: 'ru', name: 'Russian', label: 'Русский' },
  { code: 'it', name: 'Italian', label: 'Italiano' },
  { code: 'ko', name: 'Korean', label: '한국어' },
  { code: 'tr', name: 'Turkish', label: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', label: 'Tiếng Việt' }
];

export const DEPARTMENT_RULES = [
  { keywords: ['chest pain', 'heart pain', 'palpitations', 'shortness of breath', 'heart attack'], department: 'Cardiology' },
  { keywords: ['headache', 'dizziness', 'migraine', 'seizure', 'stroke', 'numbness'], department: 'Neurology' },
  { keywords: ['cough', 'sore throat', 'runny nose', 'asthma', 'wheezing', 'congestion'], department: 'ENT / Pulmonology' },
  { keywords: ['stomach pain', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'acid reflux'], department: 'Gastroenterology' },
  { keywords: ['fever', 'fatigue', 'weakness', 'body ache', 'chills'], department: 'General Medicine' }
];

export const URGENCY_THEMES: Record<string, { bg: string, text: string, border: string, label: string, glow: string, pulse: string }> = {
  Green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Safe to manage at home',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    pulse: ''
  },
  Yellow: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Clinic visit recommended',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    pulse: 'animate-pulse'
  },
  Red: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    label: 'Urgent medical attention needed',
    glow: 'shadow-[0_0_25px_rgba(225,29,72,0.3)]',
    pulse: 'animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]'
  }
};
