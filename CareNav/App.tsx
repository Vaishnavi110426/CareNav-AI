
import React, { useState, useEffect } from 'react';
import { 
  Heart, Mic, MicOff, Send, RotateCcw, ArrowLeft, AlertCircle, 
  Download, Volume2, MapPin, ChevronRight, ShieldCheck, Home as HomeIcon, 
  History as HistoryIcon, User, Stethoscope, FileText, Trash2, 
  Hospital, Globe, CheckCircle2, LogOut, X, Lock, Mail
} from 'lucide-react';
import { AppState, MedicalGuidance, UserInput, Report, UserProfile } from './types';
import { classifyDepartment } from './services/ruleEngine';
import { getAIGuidance, playGuidanceSpeech } from './services/geminiService';
import { LANGUAGES, URGENCY_THEMES } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [input, setInput] = useState<UserInput>({ symptoms: '', language: 'en' });
  const [result, setResult] = useState<MedicalGuidance | null>(null);
  const [history, setHistory] = useState<Report[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('carenav_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedUser = localStorage.getItem('carenav_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setState('home');
    }
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { name: 'John Doe', email: 'john@example.com' };
    setUser(newUser);
    localStorage.setItem('carenav_user', JSON.stringify(newUser));
    setState('home');
    triggerToast("Welcome to CareNav AI");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('carenav_user');
    setState('login');
    triggerToast("Logged out successfully");
  };

  const handleSymptomSubmit = async () => {
    if (!input.symptoms.trim()) return;
    setState('processing');
    try {
      const dept = classifyDepartment(input.symptoms);
      const guidance = await getAIGuidance(input.symptoms, dept, input.language);
      
      const newReport: Report = {
        ...guidance,
        id: Math.random().toString(36).substr(2, 9),
        symptoms: input.symptoms,
        timestamp: Date.now()
      };
      
      setResult(guidance);
      const updatedHistory = [newReport, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('carenav_history', JSON.stringify(updatedHistory));
      setState('result');
      triggerToast("Analysis complete");
    } catch (error) {
      setState('input');
      triggerToast("Error analyzing symptoms.");
    }
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        const langMap: Record<string, string> = {
          en: 'en-US', hi: 'hi-IN', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
          zh: 'zh-CN', ja: 'ja-JP', pt: 'pt-PT', ar: 'ar-SA', ru: 'ru-RU',
          it: 'it-IT', ko: 'ko-KR', tr: 'tr-TR', vi: 'vi-VN'
        };
        recognition.lang = langMap[input.language] || 'en-US';
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => ({ ...prev, symptoms: prev.symptoms + (prev.symptoms ? ' ' : '') + transcript }));
          setIsListening(false);
          if (state === 'voice') setState('input');
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } else {
        triggerToast("Voice not supported");
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = history.filter(h => h.id !== id);
    setHistory(filtered);
    localStorage.setItem('carenav_history', JSON.stringify(filtered));
    triggerToast("Report removed");
  };

  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center">
            <Heart className="text-blue-600 w-10 h-10 fill-current" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 text-center mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-10 font-medium">Your personal healthcare navigator awaits.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                required
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-400 focus:bg-white transition-all text-black"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-400 focus:bg-white transition-all text-black"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-100 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Log In
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-400 font-bold uppercase tracking-widest cursor-pointer hover:text-blue-600">
          Forgot Password?
        </p>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center animate-in fade-in duration-1000">
      <div className="relative mb-10 floating">
        <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-400 via-blue-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-200">
          <Heart className="text-white w-16 h-16 fill-current" />
        </div>
      </div>
      <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">CareNav AI</h1>
      <p className="text-xl text-slate-500 mb-12 max-w-sm font-medium leading-relaxed">
        Hello {user?.name.split(' ')[0]}! Ready to navigate your health safely?
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={() => setState('input')}
          className="group relative py-6 rounded-3xl bg-slate-900 text-white font-bold text-xl shadow-xl hover:-translate-y-1 transition-all"
        >
          Check My Symptoms <ChevronRight className="inline-block ml-2 w-6 h-6" />
        </button>
        <button 
          onClick={() => setState('voice')}
          className="py-5 rounded-3xl bg-white border-2 border-slate-100 text-slate-600 font-bold text-lg shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
        >
          <Mic className="w-5 h-5 text-emerald-500" /> Use Voice Input
        </button>
      </div>
    </div>
  );

  const renderInput = () => (
    <div className="animate-in slide-in-from-bottom-12 duration-500 pt-6 space-y-6">
      <div className="bg-white rounded-[3rem] p-6 md:p-10 shadow-2xl border border-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-blue-400"></div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">Symptom Check</h2>
          <button 
            onClick={() => setShowLangPicker(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all border border-blue-100"
          >
            <Globe className="w-4 h-4" />
            {LANGUAGES.find(l => l.code === input.language)?.label || 'Language'}
          </button>
        </div>
        <div className="relative mb-10">
          <textarea
            value={input.symptoms}
            onChange={(e) => setInput(prev => ({ ...prev, symptoms: e.target.value }))}
            placeholder="Tell me what's wrong..."
            className="w-full min-h-[250px] p-8 text-2xl bg-slate-50 border-2 border-transparent rounded-[2.5rem] outline-none focus:bg-white focus:border-blue-400 transition-all resize-none text-black font-medium"
          />
          <button 
            onClick={handleVoiceInput}
            className={`absolute bottom-6 right-6 p-5 rounded-3xl shadow-lg transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-blue-600'}`}
          >
            {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
          </button>
        </div>
        <button 
          disabled={!input.symptoms.trim()}
          onClick={handleSymptomSubmit}
          className="w-full py-6 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-2xl shadow-xl disabled:opacity-30 transition-all"
        >
          Submit Analysis
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    const theme = URGENCY_THEMES[result.urgency];
    return (
      <div className="animate-in slide-in-from-right-8 duration-500 space-y-8 pt-4 pb-12">
        <div className={`p-10 rounded-[3rem] border-2 shadow-2xl transition-all ${theme.bg} ${theme.border} ${theme.glow}`}>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-xl">
              <AlertCircle className={`w-12 h-12 ${theme.text}`} />
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${theme.text} opacity-60`}>Urgency</p>
              <h3 className="text-3xl font-black text-slate-900 leading-tight">{theme.label}</h3>
            </div>
          </div>
          <p className="text-xl text-slate-800 leading-relaxed font-semibold italic bg-white/40 p-6 rounded-3xl border border-white/50">
            "{result.explanation}"
          </p>
        </div>
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <Hospital className="text-blue-600 w-8 h-8" />
            <h4 className="text-2xl font-bold text-slate-800">{result.department}</h4>
          </div>
          <div className="space-y-4">
            {result.checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <span className="text-lg font-bold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => playGuidanceSpeech(result.explanation)} className="flex items-center justify-center gap-3 p-6 bg-white border border-slate-100 rounded-3xl font-bold text-slate-600 shadow-sm hover:shadow-md transition-all">
            <Volume2 /> Play Audio
          </button>
          <button className="flex items-center justify-center gap-3 p-6 bg-white border border-slate-100 rounded-3xl font-bold text-slate-600 shadow-sm hover:shadow-md transition-all">
            <Download /> Save PDF
          </button>
        </div>
      </div>
    );
  };

  const renderLanguagePicker = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLangPicker(false)}></div>
      <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setShowLangPicker(false)}
          className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-2xl">
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Choose Language</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setInput(prev => ({ ...prev, language: lang.code })); setShowLangPicker(false); }}
              className={`flex flex-col items-start p-5 rounded-3xl border-2 transition-all text-left ${
                input.language === lang.code 
                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
              }`}
            >
              <span className="text-lg font-black">{lang.label}</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${input.language === lang.code ? 'text-blue-100' : 'text-slate-300'}`}>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-50 transition-all ${accessibilityMode ? 'text-lg' : 'text-base'}`}>
      {state !== 'login' && (
        <header className="sticky top-0 z-[100] bg-white/70 backdrop-blur-3xl border-b border-slate-100/50 px-6 py-5">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {state !== 'home' && (
                <button onClick={() => setState('home')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
              )}
              <div className="flex items-center gap-3" onClick={() => setState('home')}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Heart className="text-white w-6 h-6 fill-current" />
                </div>
                <span className="font-black text-2xl text-slate-900 cursor-pointer">CareNav</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAccessibilityMode(!accessibilityMode)}
                className={`p-3 rounded-2xl border-2 transition-all ${accessibilityMode ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
              >
                <span className="font-black text-sm">Aa</span>
              </button>
              <div className="group relative">
                <button className="p-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all">
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{user?.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 transition-all">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-xl mx-auto px-6 py-6 pb-32">
        {state === 'login' && renderLogin()}
        {state === 'home' && renderHome()}
        {state === 'input' && renderInput()}
        {state === 'processing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10">
            <div className="w-24 h-24 border-[6px] border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <h3 className="text-3xl font-black text-slate-800 text-center">Analyzing Symptoms...</h3>
          </div>
        )}
        {state === 'result' && renderResult()}
        {state === 'voice' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-16">
            <div className={`w-48 h-48 rounded-[4rem] flex items-center justify-center transition-all ${isListening ? 'bg-emerald-500 scale-110 shadow-[0_0_80px_rgba(16,185,129,0.3)]' : 'bg-white shadow-xl'}`}>
              <Mic className={`w-24 h-24 ${isListening ? 'text-white' : 'text-slate-300'}`} />
            </div>
            <button onClick={handleVoiceInput} className="px-12 py-6 bg-emerald-500 text-white rounded-full font-black text-xl shadow-2xl">
              {isListening ? "Stop Analysis" : "Start Speaking"}
            </button>
          </div>
        )}
        {state === 'history' && (
          <div className="animate-in slide-in-from-bottom-12 duration-500 pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900">Health Reports</h2>
              {history.length > 0 && <button onClick={() => { setHistory([]); localStorage.removeItem('carenav_history'); }} className="p-3 bg-rose-50 text-rose-500 rounded-2xl"><Trash2 className="w-5 h-5" /></button>}
            </div>
            {history.length === 0 ? <p className="text-center py-20 text-slate-400 font-bold">No reports yet.</p> : history.map(report => (
              <div key={report.id} onClick={() => { setResult(report); setState('result'); }} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                <h4 className="text-xl font-black text-slate-800 truncate">{report.symptoms}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(report.timestamp).toLocaleDateString()} • {report.department}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {state !== 'login' && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[3rem] shadow-2xl p-2.5 flex items-center justify-around z-[110]">
          <button onClick={() => setState('home')} className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-[2.5rem] transition-all ${['home', 'input', 'result'].includes(state) ? 'bg-slate-900 text-white shadow-xl translate-y-[-4px]' : 'text-slate-400'}`}>
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button onClick={() => setState('voice')} className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-[2.5rem] transition-all ${state === 'voice' ? 'bg-emerald-500 text-white shadow-xl translate-y-[-4px]' : 'text-slate-400'}`}>
            <Mic className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Voice</span>
          </button>
          <button onClick={() => setState('history')} className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-[2.5rem] transition-all ${state === 'history' ? 'bg-blue-600 text-white shadow-xl translate-y-[-4px]' : 'text-slate-400'}`}>
            <HistoryIcon className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Reports</span>
          </button>
        </nav>
      )}

      {showLangPicker && renderLanguagePicker()}

      {showToast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl z-[150] animate-in slide-in-from-bottom-6 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-base font-bold">{showToast}</span>
        </div>
      )}
    </div>
  );
};

export default App;
