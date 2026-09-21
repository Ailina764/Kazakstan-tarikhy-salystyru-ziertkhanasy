import React, { useState, useEffect, type ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Cpu, History, Lightbulb, RotateCcw, SearchCheck, ShieldCheck, ScrollText, Landmark, Feather, Info
} from 'lucide-react';
import { questionsData, topicInfo, type ComparisonData } from './data';
import { Scene } from './components/3d/Scene';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

type Step = 'landing' | 'topics' | 'questions' | 'intro' | 'ai' | 'textbook' | 'comparison' | 'final';

const stepOrder: Step[] = ['landing', 'topics', 'questions', 'intro', 'ai', 'textbook', 'comparison', 'final'];

// Common Animations
const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
};

// --- Subcomponents ---

function ArchivalPlaceholder({ topicId, isAi = false, id }: { topicId: string, isAi?: boolean, id: string }) {
  return (
    <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center cinematic-border bg-black/5 dark:bg-white/5 backdrop-blur-sm p-4 rounded-lg overflow-hidden group">
      <div className="absolute inset-0 z-0">
         <Scene id={id} isAi={isAi} topicId={topicId} />
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground">{isAi ? 'Жасанды Интеллект' : '3D Нысан'}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground">Интерактивті</span>
      </div>
    </div>
  );
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-4 text-left">
      <span className="relative flex h-12 w-12 items-center justify-center border border-foreground/20 rounded-full text-gold transition-transform duration-700 group-hover:rotate-180 bg-background">
        <History size={20} strokeWidth={1.5} />
      </span>
      <span>
        <span className="font-serif block text-xl font-bold tracking-wide text-foreground">Шындық пен ЖИ</span>
        <span className="font-mono block text-[9px] uppercase tracking-[.2em] text-muted-foreground mt-0.5">Зерттеу зертханасы</span>
      </span>
    </button>
  );
}

function TopBar({ step, onHome, onRestart }: { step: Step; onHome: () => void; onRestart: () => void }) {
  const current = Math.max(0, stepOrder.indexOf(step) - 1);
  const total = stepOrder.length - 2; // exclude landing and final from fraction
  const progress = step === 'landing' ? 0 : Math.min(100, (current / total) * 100);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <Brand onClick={onHome} />
        
        <div className="hidden md:flex items-center gap-12">
          {step !== 'landing' && (
            <div className="flex items-center gap-6">
              <span className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Барысы</span>
              <div className="h-[1px] w-48 bg-border relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 bg-gold transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <span className="font-mono text-[10px] text-foreground font-medium">{Math.max(current, 1)} / {total}</span>
            </div>
          )}
        </div>

        {step !== 'landing' ? (
          <button onClick={onRestart} className="group flex items-center gap-3 px-4 py-2 border border-border rounded-full text-xs font-medium text-foreground transition-all hover:bg-foreground hover:text-background">
            <RotateCcw size={14} className="transition-transform duration-500 group-hover:-rotate-90" />
            <span className="hidden sm:inline font-sans tracking-wide">Қайта бастау</span>
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>Басты бет</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Сұрақтар</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Тақырыптар</span>
          </div>
        )}
      </div>
    </header>
  );
}

function PrimaryButton({ children, onClick, variant = 'primary', disabled = false, className = '' }: { children: ReactNode; onClick: () => void; variant?: 'primary' | 'secondary' | 'ai' | 'history'; disabled?: boolean; className?: string }) {
  const base = "relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group rounded-full";
  
  const variants = {
    primary: "bg-foreground text-background hover:bg-gold hover:text-foreground",
    secondary: "border border-border text-foreground hover:bg-foreground/5",
    ai: "bg-[#4A6D7C] text-white hover:bg-[#3A5663]",
    history: "bg-[#8C3A2B] text-white hover:bg-[#732f22]"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="h-[1px] w-12 bg-gold" />
      <span className="font-mono text-[10px] uppercase tracking-[.3em] text-muted-foreground">{children}</span>
    </div>
  );
}

// --- Screens ---

function Landing({ onBegin }: { onBegin: () => void }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative min-h-[100dvh] flex flex-col pt-[89px]">
      {/* Uniform page background — the robot has no separate backdrop. */}
      <div className="absolute inset-0 z-0 bg-background overflow-hidden pointer-events-none">
      </div>

      <div className="flex-1 relative z-10 w-full flex flex-col lg:flex-row max-w-[1600px] mx-auto">

        {/* Left Side: Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-start px-6 sm:px-12 lg:pl-20 lg:pr-4 xl:pl-24 xl:pr-6 py-4 lg:pt-6 xl:pt-10 order-1 text-center lg:text-left z-20 pb-6">
          <div className="max-w-2xl mx-auto lg:mx-0">
             <span className="inline-block font-mono text-[10px] sm:text-xs uppercase tracking-[.3em] text-[#4A6D7C] mb-4 sm:mb-5 px-4 py-2 rounded-full border border-[#4A6D7C]/30 bg-[#4A6D7C]/5 backdrop-blur-sm">
               Зерттеу зертханасы
             </span>
             
             <h1 className="font-display font-semibold uppercase text-5xl sm:text-6xl lg:text-6xl xl:text-7xl leading-[0.92] tracking-[0.015em] text-foreground mb-5">
               Шындық пен <br />
               <span className="text-[#4A6D7C]">ЖИ</span>
             </h1>
             
             <p className="font-sans text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed text-muted-foreground mb-6 border-l-0 lg:border-l-2 border-[#4A6D7C]/30 lg:pl-6">
               Қазақстан тарихын екі дереккөз арқылы тереңірек зертте. ЖИ ұсынған түсіндірмені оқулықтағы нақты деректермен салыстыр. Оқиғалардың себептері мен салдарын талдап, ұқсастықтарды анықта, айырмашылықтарды байқап, өз қорытындыңды жаса.
             </p>
             
             <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
               <PrimaryButton onClick={onBegin} className="w-full sm:w-auto py-4 sm:py-5 px-8 sm:px-10 text-sm sm:text-base shadow-xl">
                 Зерттеуді бастау <ArrowRight size={18} className="ml-2" />
               </PrimaryButton>
             </div>
          </div>
        </div>

        {/* Right Side: Robot */}
        <div className="w-full lg:w-1/2 h-[42vh] min-h-[320px] lg:h-[calc(100vh-89px)] relative group order-2 pb-4 lg:pb-0 lg:-translate-x-16 xl:-translate-x-20">
          <Scene 
            id="landing-ai"
            isAi={true} 
            autoActivate
            webglClassName="opacity-100 transition-opacity duration-1000" 
            fallbackClassName="opacity-100 transition-transform duration-1000 group-hover:scale-105"
          />
        </div>

      </div>

    </motion.div>
  );
}

function Topics({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-[160px] pb-24 px-6">
      <main className="mx-auto max-w-[1200px]">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <SectionKicker>Тарихи тақырыптар</SectionKicker>
            <h1 className="font-serif text-5xl lg:text-6xl text-foreground">
              Қай кезеңнің <span className="italic text-gold">ізін зерттейміз?</span>
            </h1>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex gap-4 text-right">
            <span>7-СЫНЫП</span>
            <span>·</span>
            <span>10 СҰРАҚ</span>
            <span>·</span>
            <span>2 ДЕРЕККӨЗ</span>
          </div>
        </div>

        <div className="grid gap-4">
          {topicInfo.map((topic, index) => (
            <button 
              key={topic.id} 
              onClick={() => onSelect(topic.id)} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 border-b border-border hover:bg-foreground/5 transition-colors text-left"
            >
              <div className="flex items-center gap-12">
                <span className="font-serif text-4xl text-gold opacity-50 group-hover:opacity-100 transition-opacity w-16">{topic.mark}</span>
                <div>
                  <h2 className="font-serif text-3xl text-foreground mb-2">{topic.title}</h2>
                  <p className="font-sans text-sm text-muted-foreground">{topic.note}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 mt-6 sm:mt-0">
                 <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                   {questionsData.filter(q => q.topicId === topic.id).length} сұрақ
                 </span>
                 <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-gold group-hover:border-gold group-hover:text-background transition-all">
                   <ArrowRight size={16} />
                 </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </motion.div>
  );
}

function Questions({ topicId, onSelect, onBack }: { topicId: string; onSelect: (id: number) => void; onBack: () => void }) {
  const topic = topicInfo.find((item) => item.id === topicId);
  const questions = questionsData.filter((item) => item.topicId === topicId);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-[160px] pb-24 px-6 flex items-center">
      <main className="mx-auto max-w-[1400px] w-full grid lg:grid-cols-2 gap-20">
        <div>
          <button onClick={onBack} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 mb-16">
            <ArrowLeft size={14} /> Тақырыптарға оралу
          </button>
          
          <SectionKicker>{topic?.title}</SectionKicker>
          <h1 className="font-serif text-5xl lg:text-7xl leading-[1.1] text-foreground mb-6">Сұрақ таңда</h1>
          <p className="font-sans text-lg text-muted-foreground mb-16 max-w-md">
            Осы тақырыптың қай қырын салыстырып көргің келеді? Бұл сұраққа алдымен жасанды интеллект жауап береді.
          </p>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <button 
                key={question.id} 
                onClick={() => onSelect(question.id)} 
                className="w-full group glass-panel p-8 rounded-2xl flex items-center gap-8 hover:border-gold transition-colors text-left"
              >
                <span className="font-serif text-3xl text-gold opacity-50 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                <span className="font-serif text-xl leading-relaxed text-foreground flex-1">{question.question}</span>
                <ArrowRight size={20} className="text-muted-foreground group-hover:text-gold transition-colors" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="hidden lg:block relative">
           <ArchivalPlaceholder id="questions-placeholder" topicId={topicId} />
        </div>
      </main>
    </motion.div>
  );
}

function Intro({ item, onNext, onBack }: { item: ComparisonData; onNext: () => void; onBack: () => void }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-[160px] pb-24 px-6 flex items-center">
      <main className="mx-auto max-w-[1400px] w-full grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <button onClick={onBack} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 mb-16">
            <ArrowLeft size={14} /> Сұрақтарға оралу
          </button>

          <SectionKicker>Салыстыруға дайындал</SectionKicker>
          <h1 className="font-serif text-4xl lg:text-5xl leading-[1.3] text-foreground mb-12">
            {item.question}
          </h1>
          
          <div className="h-[1px] w-full bg-border mb-12" />
          
          <p className="font-sans text-lg leading-relaxed text-muted-foreground mb-12">
            Алдымен екі жауапты бөлек оқимыз. Оқығанда даталарға, есімдерге және нақты дәлелдерге назар аудар. Тарихи құжаттарды сараптау дәлдікті қажет етеді.
          </p>
          
          <PrimaryButton onClick={onNext}>
            Жауаптарды оқу <ArrowRight size={16} />
          </PrimaryButton>
        </div>

        <div className="relative">
          <ArchivalPlaceholder id="intro-placeholder" topicId={item.topicId} />
          <div className="absolute -bottom-6 -left-6 glass-panel p-6 rounded-2xl max-w-sm border border-border shadow-2xl flex items-start gap-4">
             <Info size={24} className="text-gold shrink-0" />
             <p className="font-sans text-sm text-foreground leading-relaxed">
               Әр жауаптан кейін өз ойыңды белгілеуге уақыт бөл.
             </p>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

function SourceAnswer({ item, source, onNext, onBack }: { item: ComparisonData; source: 'ai' | 'textbook'; onNext: () => void; onBack: () => void }) {
  const isAi = source === 'ai';
  const points = isAi ? item.aiAnswer : item.textbookAnswer;
  
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-[160px] pb-24 px-6 flex flex-col">
      <main className="mx-auto max-w-[1400px] w-full flex-1 flex flex-col">
        <button onClick={onBack} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 mb-12 self-start">
          <ArrowLeft size={14} /> Сұраққа оралу
        </button>
        
        <div className="mb-12">
          <SectionKicker>{isAi ? 'Жасанды Интеллект' : 'Оқулық Мәліметі'}</SectionKicker>
          <h1 className="font-serif text-5xl lg:text-7xl text-foreground mb-6">
            {isAi ? 'ЖИ жауабы' : 'Оқулық'}
          </h1>
          <p className="font-sans text-xl text-muted-foreground max-w-3xl">
            {item.question}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 flex-1">
          <div className="flex flex-col">
            <div className={`flex-1 rounded-3xl p-10 lg:p-16 mb-8 border ${isAi ? 'ai-panel' : 'history-panel'}`}>
              <div className="flex items-center justify-between mb-12 border-b border-current/10 pb-8">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAi ? 'bg-[#4A6D7C]/20 text-[#4A6D7C]' : 'bg-[#8C3A2B]/20 text-[#8C3A2B]'}`}>
                       {isAi ? <Cpu size={24} /> : <BookOpen size={24} />}
                    </div>
                    <div>
                       <p className="font-serif font-bold text-xl">{isAi ? 'Жасанды Интеллект' : 'Оқулық дерегі'}</p>
                       <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                         {isAi ? 'Жауап моделі: GPT-4o (демо)' : 'Қазақстан тарихы · 7-сынып'}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                <p className="font-sans text-lg leading-relaxed text-foreground/90">
                  {isAi 
                    ? "Бұл сұраққа қатысты негізгі тарихи жағдайлар мен себептерді төмендегідей жүйелеуге болады:"
                    : "Бұл кезеңнің тарихи алғышарттары мен негізгі факторлары оқулықта келесідей берілген:"}
                </p>
                <ul className="space-y-6">
                  {points.map((point, index) => (
                    <li key={index} className="flex gap-6 items-start">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm border ${isAi ? 'border-[#4A6D7C] text-[#4A6D7C]' : 'border-[#8C3A2B] text-[#8C3A2B]'}`}>
                        {index + 1}
                      </span>
                      <span className="font-sans text-lg leading-relaxed text-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                 <Info size={14} />
                 {isAi ? 'Бұл жауап демонстрациялық нұсқа үшін алдын ала дайындалған.' : 'Оқулықтағы дереккөз – ресми білім көзі.'}
              </div>
              <PrimaryButton onClick={onNext} variant={isAi ? 'ai' : 'history'}>
                {isAi ? 'Оқулықты көру' : 'Салыстыруға өту'} <ArrowRight size={16} />
              </PrimaryButton>
            </div>
          </div>
          
          {/* 3D Context visualization on the side */}
          <div
            className={`${
              isAi
                ? 'block h-[360px] mt-4 border-0 bg-transparent'
                : 'hidden border border-border glass-panel'
            } lg:block lg:h-full lg:mt-0 relative rounded-3xl overflow-hidden`}
          >
             <Scene id="source-answer-scene" isAi={isAi} topicId={item.topicId} autoActivate />
            <div className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between">
               <span
                 className={`font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-1 rounded-sm ${
                   isAi ? 'bg-transparent border-0' : 'bg-background/50 backdrop-blur-md border border-border'
                 }`}
               >
                  {isAi ? 'ЖИ Моделі' : 'Оқулық Моделі'}
               </span>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

function Comparison({ item, onNext, onBack }: { item: ComparisonData; onNext: () => void; onBack: () => void }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-[160px] pb-24 px-6">
      <main className="mx-auto max-w-[1400px]">
        <button onClick={onBack} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 mb-12">
          <ArrowLeft size={14} /> Алдыңғы қадам
        </button>

        <div className="mb-16">
          <SectionKicker>Талдау</SectionKicker>
          <h1 className="font-serif text-5xl lg:text-7xl text-foreground mb-6">Салыстыру</h1>
          <p className="font-sans text-xl text-muted-foreground max-w-3xl">
            ЖИ жауабы мен оқулықтағы мәліметті салыстырып, айырмашылықтарын анықта.
          </p>
        </div>

        {/* Split View */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12 relative">
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex w-16 h-16 rounded-full bg-background border border-border items-center justify-center shadow-xl">
             <RotateCcw size={20} className="text-gold transform rotate-45" />
           </div>

           <div className="ai-panel p-8 lg:p-12 rounded-3xl border-r-0 lg:rounded-r-none">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#4A6D7C]/20 text-[#4A6D7C] flex items-center justify-center">
                   <Cpu size={24} />
                </div>
                <div>
                   <p className="font-serif font-bold text-xl">Жасанды Интеллект</p>
                   <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">ЖИ Жауабы</p>
                </div>
             </div>
             <ul className="space-y-4">
               {item.aiAnswer.map((p, i) => (
                 <li key={i} className="font-sans text-sm leading-relaxed text-foreground/80 flex gap-3">
                   <span className="text-[#4A6D7C] font-bold">•</span> {p}
                 </li>
               ))}
             </ul>
           </div>

           <div className="history-panel p-8 lg:p-12 rounded-3xl border-l-0 lg:rounded-l-none">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#8C3A2B]/20 text-[#8C3A2B] flex items-center justify-center">
                   <BookOpen size={24} />
                </div>
                <div>
                   <p className="font-serif font-bold text-xl">Оқулық</p>
                   <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">Тарихи дерек</p>
                </div>
             </div>
             <ul className="space-y-4">
               {item.textbookAnswer.map((p, i) => (
                 <li key={i} className="font-sans text-sm leading-relaxed text-foreground/80 flex gap-3">
                   <span className="text-[#8C3A2B] font-bold">•</span> {p}
                 </li>
               ))}
             </ul>
           </div>
        </div>

        {/* Stats & Analysis */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
           <div className="glass-panel p-8 rounded-3xl flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-4 border-[#4A6D7C] flex items-center justify-center font-serif text-2xl font-bold text-foreground">
                {item.similarityPercentage}%
              </div>
              <div>
                 <p className="font-serif text-xl font-bold mb-2">Сәйкестік</p>
                 <p className="font-sans text-xs text-muted-foreground leading-relaxed">Екі дереккөздегі негізгі ақпарат бір-біріне сәйкес келеді.</p>
              </div>
           </div>
           
           <div className="glass-panel p-8 rounded-3xl flex items-center gap-6">
              <div className="w-20 h-20 rounded-full border-4 border-gold flex items-center justify-center font-serif text-2xl font-bold text-foreground">
                {item.differencePercentage}%
              </div>
              <div>
                 <p className="font-serif text-xl font-bold mb-2">Айырмашылық</p>
                 <p className="font-sans text-xs text-muted-foreground leading-relaxed">Кейбір мәліметтерде айырмашылықтар бар.</p>
              </div>
           </div>

           <div className="glass-panel p-8 rounded-3xl col-span-1 lg:col-span-1 flex flex-col justify-center">
              <p className="font-serif text-xl font-bold mb-4 flex items-center gap-3">
                <Info className="text-gold" size={20} />
                Назар аудар
              </p>
              <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                {item.pointsToCheck.join(' ')}
              </p>
           </div>
        </div>

        <div className="flex justify-end">
           <PrimaryButton onClick={onNext}>
             Қорытындыға өту <ArrowRight size={16} />
           </PrimaryButton>
        </div>
      </main>
    </motion.div>
  );
}

function Final({ item, onHome }: { item: ComparisonData; onHome: () => void }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen pt-[160px] pb-24 px-6 flex items-center">
      <main className="mx-auto max-w-[800px] w-full text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gold/20 text-gold flex items-center justify-center mb-12">
          <Check size={40} strokeWidth={3} />
        </div>
        
        <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-8">
          Зерттеу аяқталды
        </h1>
        
        <div className="glass-panel p-10 rounded-3xl mb-12 text-left shadow-2xl">
          <SectionKicker>Қорытынды</SectionKicker>
          <p className="font-sans text-xl leading-relaxed text-foreground mt-8">
            {item.analysis}
          </p>
        </div>
        
        <PrimaryButton onClick={onHome}>
          Басқа тақырыпты зерттеу <ArrowRight size={16} />
        </PrimaryButton>
      </main>
    </motion.div>
  );
}

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [topicId, setTopicId] = useState<string>('');
  const [questionId, setQuestionId] = useState<number>(0);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const activeItem = questionsData.find(q => q.id === questionId) || questionsData[0];

  const handleHome = () => {
    setStep('landing');
    setTopicId('');
    setQuestionId(0);
  };

  const handleRestart = () => {
    setStep('topics');
    setTopicId('');
    setQuestionId(0);
  };

  return (
    <div className="relative min-h-screen selection:bg-gold selection:text-background">
      {/* Global Textures */}
      <div className="texture-overlay" />
      <div className="vignette" />

      <TopBar step={step} onHome={handleHome} onRestart={handleRestart} />

      <AnimatePresence mode="wait">
        {step === 'landing' && <Landing key="landing" onBegin={() => setStep('topics')} />}
        {step === 'topics' && <Topics key="topics" onSelect={(id) => { setTopicId(id); setStep('questions'); }} />}
        {step === 'questions' && <Questions key="questions" topicId={topicId} onSelect={(id) => { setQuestionId(id); setStep('intro'); }} onBack={() => setStep('topics')} />}
        {step === 'intro' && <Intro key="intro" item={activeItem} onNext={() => setStep('ai')} onBack={() => setStep('questions')} />}
        {step === 'ai' && <SourceAnswer key="ai" item={activeItem} source="ai" onNext={() => setStep('textbook')} onBack={() => setStep('intro')} />}
        {step === 'textbook' && <SourceAnswer key="textbook" item={activeItem} source="textbook" onNext={() => setStep('comparison')} onBack={() => setStep('ai')} />}
        {step === 'comparison' && <Comparison key="comparison" item={activeItem} onNext={() => setStep('final')} onBack={() => setStep('textbook')} />}
        {step === 'final' && <Final key="final" item={activeItem} onHome={handleRestart} />}
      </AnimatePresence>
    </div>
  );
}
