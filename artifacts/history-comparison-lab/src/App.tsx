import { useMemo, useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  Cpu,
  FileText,
  Flag,
  History,
  Lightbulb,
  RotateCcw,
  SearchCheck,
  ShieldCheck,
  ScrollText,
  Landmark,
  Feather
} from 'lucide-react';
import { questionsData, topicInfo, type ComparisonData } from './data';

type Step = 'landing' | 'topics' | 'questions' | 'intro' | 'ai' | 'textbook' | 'comparison' | 'final';

const stepOrder: Step[] = ['landing', 'topics', 'questions', 'intro', 'ai', 'textbook', 'comparison', 'final'];

function ArchivalPlaceholder({ modelPath }: { modelPath: string }) {
  return (
    <div className="archival-doc p-6 text-[#1A3A36]" data-testid="placeholder-history-model">
      <div className="ornament-corner-tl" />
      <div className="ornament-corner-tr" />
      <div className="ornament-corner-bl" />
      <div className="ornament-corner-br" />
      
      <div className="absolute right-4 top-4 opacity-10">
        <Landmark size={80} strokeWidth={1} />
      </div>
      
      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#1A3A36] text-[#CFA052]">
          <ScrollText size={24} strokeWidth={1.5} />
        </div>
        <div>
          <p className="mono mb-1 text-[10px] uppercase tracking-[.2em] text-[#8C3A2B]">Архивтік құжат</p>
          <p className="font-serif font-bold text-lg leading-tight">Тарихи жәдігер сканері</p>
          <p className="mt-2 text-xs leading-relaxed text-[#5A635A] max-w-[200px]">Зерттеуге қажетті тарихи құжаттардың цифрлық көшірмелері жүктеліп жатыр.</p>
        </div>
      </div>
      <div className="mono relative mt-6 border-t border-[#CFC5B1] pt-3 flex justify-between text-[10px] text-[#5A635A]" data-testid="text-model-path" data-model-path={modelPath}>
        <span>КОД: {modelPath.split('/').pop()?.toUpperCase()}</span>
        <span>ҚОР: 04-89A</span>
      </div>
    </div>
  );
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-4 text-left" data-testid="button-brand-home">
      <span className="relative flex h-11 w-11 items-center justify-center rounded-sm bg-[#1A3A36] text-[#CFA052] transition-transform duration-500 group-hover:rotate-180">
        <div className="absolute inset-1 border border-[#CFA052]/30" />
        <History size={22} strokeWidth={1.5} />
      </span>
      <span>
        <span className="serif block text-lg font-bold tracking-wide text-[#1A3A36]">Дерек Lab</span>
        <span className="mono block text-[9px] uppercase tracking-[.15em] text-[#8C3A2B]">Қазақстан тарихы · 7-сынып</span>
      </span>
    </button>
  );
}

function TopBar({ step, onHome, onRestart }: { step: Step; onHome: () => void; onRestart: () => void }) {
  const current = Math.max(0, stepOrder.indexOf(step) - 1);
  const progress = step === 'landing' ? 0 : Math.min(100, (current / 6) * 100);
  
  return (
    <header className="sticky top-0 z-40 border-b border-[#CFC5B1] bg-[#F5F2EA]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-3 sm:px-8">
        <Brand onClick={onHome} />
        <div className="hidden items-center gap-4 md:flex">
          <span className="mono text-[10px] uppercase tracking-[.2em] text-[#5A635A]">Зерттеу барысы</span>
          <div className="h-[2px] w-40 bg-[#D1C9B8]">
            <div className="h-full bg-[#8C3A2B] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
          {step !== 'landing' && <span className="mono text-[10px] text-[#1A3A36] font-medium">{Math.max(current, 1)} / 6</span>}
        </div>
        {step !== 'landing' ? (
          <button onClick={onRestart} className="group flex items-center gap-2 rounded-sm border border-transparent px-3 py-2 text-xs font-semibold text-[#8C3A2B] transition-colors hover:border-[#CFC5B1] hover:bg-[#EBE5DA]" data-testid="button-restart">
            <RotateCcw size={15} className="transition-transform duration-500 group-hover:-rotate-90" />
            <span className="hidden sm:inline">Қайта бастау</span>
          </button>
        ) : <span className="mono hidden text-[10px] tracking-[.16em] text-[#5A635A] sm:block">ЗЕРТТЕУ ДӘПТЕРІ  /  ТАРИХИ МҰРА</span>}
      </div>
      {step !== 'landing' && <div className="progress-line h-[1px]" style={{ '--progress': `${progress}%` } as CSSProperties} />}
    </header>
  );
}

function PrimaryButton({ children, onClick, testId, variant = 'dark', disabled = false }: { children: ReactNode; onClick: () => void; testId: string; variant?: 'dark' | 'gold' | 'quiet'; disabled?: boolean }) {
  const styles = variant === 'gold'
    ? 'bg-[#CFA052] text-[#1A3A36] hover:bg-[#b88c44] border-transparent'
    : variant === 'quiet'
      ? 'border border-[#CFC5B1] bg-transparent text-[#1A3A36] hover:border-[#1A3A36] hover:bg-[#EBE5DA]'
      : 'bg-[#1A3A36] text-[#F5F2EA] hover:bg-[#122a27] border-transparent';
      
  return (
    <button onClick={onClick} disabled={disabled} className={`group relative inline-flex min-h-12 items-center justify-center gap-3 rounded-sm px-7 text-sm font-semibold uppercase tracking-wider transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 border ${styles}`} data-testid={testId}>
      {/* Decorative inner border for hover effect */}
      <div className="absolute inset-[3px] border border-current opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
      {children}
    </button>
  );
}

function SectionKicker({ children }: { children: ReactNode }) {
  return <p className="mono mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[.25em] text-[#8C3A2B]"><span className="h-[1px] w-8 bg-[#8C3A2B]" />{children}</p>;
}

function Landing({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="animate-enter-soft relative min-h-[calc(100dvh-73px)] flex flex-col">
      <section className="relative flex-1 overflow-hidden bg-[#1A3A36] text-[#F5F2EA] flex items-center">
        {/* Background Art */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay transition-opacity duration-1000" style={{ backgroundImage: 'url(/assets/steppe-bg.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A3A36] via-[#1A3A36]/90 to-transparent" />
        
        {/* Abstract topographic lines from CSS */}
        <div className="absolute inset-0 topography-bg opacity-30 mix-blend-soft-light" />
        
        <div className="relative mx-auto grid w-full max-w-[1240px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.2fr_.8fr] md:items-center">
          <div>
            <div className="animate-enter-up delay-1">
              <span className="mono inline-flex items-center gap-3 border border-[#CFA052]/40 px-4 py-2 text-[10px] uppercase tracking-[.25em] text-[#CFA052] bg-[#1A3A36]/50 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CFA052] animate-pulse" />Зерттеу алаңы · 07
              </span>
            </div>
            <h1 className="serif animate-enter-up delay-2 mt-8 max-w-[720px] text-6xl leading-[1.05] sm:text-7xl lg:text-[5rem]">
              Тарихты<br /><span className="italic text-[#CFA052]">салыстырып</span> таны.
            </h1>
            <p className="animate-enter-up delay-3 mt-7 max-w-[560px] text-base leading-8 text-[#D1C9B8] sm:text-lg">
              ЖИ түсіндірмесі мен оқулық дерегін қатар қой. Ұқсастықты тап, айырмашылықты байқа, тексеруді қажет ететін сұрақтарды өзің анықта.
            </p>
            <div className="animate-enter-up delay-4 mt-10 flex flex-wrap items-center gap-6">
              <PrimaryButton onClick={onBegin} testId="button-begin" variant="gold">
                Зерттеуді бастау <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </PrimaryButton>
              <div className="flex items-center gap-2">
                <span className="mono text-[10px] tracking-[.2em] text-[#CFC5B1] uppercase">10 дайын салыстыру</span>
              </div>
            </div>
          </div>
          
          <div className="relative hidden md:flex items-center justify-center h-[500px]">
            {/* Seal image */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] opacity-10 animate-spin-slow pointer-events-none">
               <img src="/assets/tamga-seal.png" alt="" className="w-full h-full object-contain" />
            </div>

            {/* Floating Documents */}
            <div className="relative z-10 w-full max-w-[380px]">
              <div className="animate-float-gently absolute right-0 top-[-80px] w-[300px] rotate-2 archival-doc p-6 text-[#1A3A36]">
                <div className="ornament-corner-tl" />
                <div className="ornament-corner-tr" />
                <div className="flex items-center justify-between border-b border-[#CFC5B1] pb-3">
                  <span className="mono text-[9px] uppercase tracking-[.2em] text-[#8C3A2B]">Дерек 01</span>
                  <BookOpen size={16} className="text-[#CFA052]" />
                </div>
                <p className="serif mt-5 text-2xl leading-snug font-bold">«Жеті жарғы»<br />ел тәртібінің<br />тірегі болды.</p>
                <div className="mt-8 flex items-center justify-between text-[10px] text-[#5A635A]">
                  <span className="mono uppercase">Оқулық жазбасы</span>
                  <div className="h-6 w-6 rounded-full border border-[#8C3A2B] flex items-center justify-center text-[#8C3A2B]">1</div>
                </div>
              </div>
              
              <div className="absolute bottom-[-140px] left-[-20px] w-[280px] -rotate-3 archival-doc bg-[#F5F2EA] p-6 text-[#1A3A36] shadow-2xl z-20">
                <div className="ornament-corner-bl" />
                <div className="ornament-corner-br" />
                <div className="flex items-center justify-between border-b border-[#CFC5B1] pb-3">
                  <span className="mono text-[9px] uppercase tracking-[.2em] text-[#1A3A36]">ЖИ Талдауы</span>
                  <Cpu size={16} className="text-[#1A3A36]" />
                </div>
                <p className="serif mt-5 text-2xl leading-snug font-bold italic">Бірлік —<br />негізгі<br />тақырып.</p>
                <div className="mt-8 flex gap-1 items-center">
                  <span className="h-[2px] w-12 bg-[#CFA052]" />
                  <span className="h-[2px] w-8 bg-[#CFC5B1]" />
                  <span className="h-[2px] w-4 bg-[#CFC5B1]" />
                </div>
              </div>

              <div className="absolute top-[80px] left-[-60px] rounded-sm bg-[#8C3A2B] px-5 py-4 text-center text-[#F5F2EA] shadow-xl z-30 transform -rotate-12 border border-[#F5F2EA]/20">
                <span className="serif block text-3xl font-bold">75%</span>
                <span className="mono mt-1 block text-[9px] tracking-widest uppercase">ұқсастық</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mx-auto grid w-full max-w-[1240px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-3 md:py-16">
        {[
          { icon: Feather, no: 'I', title: 'Екі деректі оқы', text: 'Бір сұраққа берілген оқулық және ЖИ жауаптарын жеке-жеке қара.' },
          { icon: SearchCheck, no: 'II', title: 'Дәлелді салыстыр', text: 'Қайсысы сәйкес? Қандай маңызды деталь тек бір жауапта бар?' },
          { icon: Lightbulb, no: 'III', title: 'Зерттеу сұрағын тап', text: 'Күмәнді немесе тексеруді қажет ететін тұсты өзің белгіле.' },
        ].map(({ icon: Icon, no, title, text }, index) => (
          <div key={no} className={`animate-enter-up delay-${index + 1} flex gap-5`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#CFC5B1] rounded-sm text-[#8C3A2B] bg-[#F5F2EA]">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <div>
              <span className="mono text-[10px] text-[#5A635A] tracking-widest">{no} - ҚАДАМ</span>
              <h2 className="serif mt-1 text-lg font-bold text-[#1A3A36]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5A635A]">{text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function Topics({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <main className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="animate-enter-up max-w-2xl">
        <SectionKicker>Бірінші қадам · Тақырыпты таңда</SectionKicker>
        <h1 className="serif text-5xl leading-[1.1] text-[#1A3A36] sm:text-6xl">Қай кезеңнің<br /><span className="italic text-[#8C3A2B]">ізін зерттейміз?</span></h1>
        <p className="mt-6 text-base leading-7 text-[#5A635A]">Бес тақырыптың бірін таңдап, сол кезеңге қатысты екі сұрақтың біріне жауап ізде. Әр тақырып тарихи мұра ретінде сақталған.</p>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {topicInfo.map((topic, index) => (
          <button key={topic.id} onClick={() => onSelect(topic.id)} className={`group animate-enter-up delay-${Math.min(index + 1, 4)} archival-doc flex flex-col justify-between p-6 text-left transition-all duration-300 hover:border-[#8C3A2B] hover:-translate-y-1 ${index === 0 ? 'lg:col-span-2' : ''}`} data-testid={`button-topic-${topic.id}`}>
            <div className="flex items-start justify-between">
              <span className="mono border border-[#CFC5B1] px-2 py-1 text-[10px] text-[#8C3A2B]">{topic.mark}</span>
              <ChevronRight size={20} className="text-[#CFC5B1] transition-transform group-hover:translate-x-1 group-hover:text-[#8C3A2B]" />
            </div>
            <div className="mt-12">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-6 bg-[#CFA052]" />
                <p className="mono text-[10px] uppercase tracking-[.2em] text-[#5A635A]">{topic.period}</p>
              </div>
              <h2 className="serif mt-3 text-3xl font-bold text-[#1A3A36]">{topic.title}</h2>
              <p className="mt-3 text-sm text-[#5A635A] italic">{topic.note}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-16 flex items-center gap-3 border-t border-[#CFC5B1] pt-6 text-xs text-[#5A635A] uppercase tracking-wider mono">
        <ShieldCheck size={16} className="text-[#8C3A2B]" />
        Барлық дерек 7-сынып оқулығындағы негізгі тақырыптарға негізделген
      </div>
    </main>
  );
}

function Questions({ topicId, onSelect, onBack }: { topicId: string; onSelect: (id: number) => void; onBack: () => void }) {
  const topic = topicInfo.find((item) => item.id === topicId);
  const questions = questionsData.filter((item) => item.topicId === topicId);
  return (
    <main className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8 sm:py-16">
      <button onClick={onBack} className="mono mb-12 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#5A635A] transition-colors hover:text-[#8C3A2B]" data-testid="button-back-topics">
        <ArrowLeft size={14} /> Тақырыптарға оралу
      </button>
      <div className="animate-enter-up">
        <SectionKicker>Екінші қадам · Сұрақты таңда</SectionKicker>
        <h1 className="serif text-5xl leading-tight text-[#1A3A36]">{topic?.title}</h1>
        <p className="mt-5 text-[#5A635A] text-lg">Осы тақырыптың қай қырын салыстырып көргің келеді?</p>
      </div>
      <div className="mt-12 space-y-5">
        {questions.map((question, index) => (
          <button key={question.id} onClick={() => onSelect(question.id)} className="group animate-enter-up archival-doc flex w-full items-center gap-6 p-6 text-left transition-all duration-300 hover:border-[#CFA052] sm:p-8" data-testid={`button-question-${question.id}`}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span className="mono text-[10px] text-[#5A635A]">СҰРАҚ</span>
              <span className="serif text-3xl font-bold text-[#8C3A2B]">0{index + 1}</span>
            </div>
            <div className="h-16 w-[1px] bg-[#CFC5B1] hidden sm:block" />
            <div className="flex-1">
              <span className="serif block text-xl font-semibold leading-relaxed text-[#1A3A36]">{question.question}</span>
              <span className="mono mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#5A635A]">
                <FileText size={13} /> 2 дереккөз · салыстыру дайын
              </span>
            </div>
            <div className="h-10 w-10 shrink-0 border border-[#CFC5B1] rounded-sm flex items-center justify-center transition-colors group-hover:bg-[#CFA052] group-hover:border-[#CFA052] group-hover:text-[#1A3A36] text-[#CFC5B1]">
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}

function Intro({ item, onNext, onBack }: { item: ComparisonData; onNext: () => void; onBack: () => void }) {
  return (
    <main className="mx-auto max-w-[1020px] px-5 py-10 sm:px-8 sm:py-16">
      <button onClick={onBack} className="mono mb-12 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#5A635A] transition-colors hover:text-[#8C3A2B]" data-testid="button-back-questions">
        <ArrowLeft size={14} /> Сұрақтарға оралу
      </button>
      <div className="grid gap-12 md:grid-cols-[1.2fr_.8fr] md:items-center">
        <div className="animate-enter-up">
          <SectionKicker>Салыстыруға дайындал</SectionKicker>
          <h1 className="serif text-4xl sm:text-5xl leading-[1.2] text-[#1A3A36] font-bold">{item.question}</h1>
          <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-[#CFC5B1] to-transparent" />
          <p className="mt-8 max-w-xl text-base leading-8 text-[#5A635A]">
            Алдымен екі жауапты бөлек оқимыз. Оқығанда даталарға, есімдерге және нақты дәлелдерге назар аудар. Тарихи құжаттарды сараптау дәлдікті қажет етеді.
          </p>
          <div className="mt-10">
            <PrimaryButton onClick={onNext} testId="button-start-reading">
              Жауаптарды оқу <ArrowRight size={17} />
            </PrimaryButton>
          </div>
        </div>
        <div className="animate-enter-soft delay-2">
          <ArchivalPlaceholder modelPath={item.modelPath} />
          <div className="mt-6 flex items-start gap-4 border-l-2 border-[#CFA052] bg-[#F5F2EA] p-4 text-xs leading-6 text-[#1A3A36]">
            <CircleHelp size={18} className="shrink-0 text-[#8C3A2B] mt-0.5" />
            Әр жауаптан кейін өз ойыңды белгілеуге уақыт бөл.
          </div>
        </div>
      </div>
    </main>
  );
}

function SourceAnswer({ item, source, onNext, onBack }: { item: ComparisonData; source: 'ai' | 'textbook'; onNext: () => void; onBack: () => void }) {
  const isAi = source === 'ai';
  const points = isAi ? item.aiAnswer : item.textbookAnswer;
  
  return (
    <main className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
      <button onClick={onBack} className="mono mb-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#5A635A] transition-colors hover:text-[#8C3A2B]" data-testid={`button-back-${source}`}>
        <ArrowLeft size={14} /> Алдыңғы қадам
      </button>
      
      <div className="animate-enter-up flex flex-wrap items-end justify-between gap-6 border-b-2 border-[#1A3A36] pb-8">
        <div>
          <SectionKicker>{isAi ? 'Бірінші дерек · ЖИ жауабы' : 'Екінші дерек · Оқулық жауабы'}</SectionKicker>
          <h1 className="serif max-w-3xl text-4xl sm:text-5xl leading-[1.1] text-[#1A3A36]">
            {isAi ? 'ЖИ бұл сұраққа қалай жауап берді?' : 'Оқулықта қандай дерек бар?'}
          </h1>
        </div>
        <div className={`flex items-center gap-3 border px-4 py-2 text-xs font-bold uppercase tracking-widest mono ${isAi ? 'border-[#5A635A] text-[#5A635A]' : 'border-[#8C3A2B] text-[#8C3A2B]'}`}>
          {isAi ? <Cpu size={16} /> : <BookOpen size={16} />}
          {isAi ? 'Жасанды интеллект' : '7-сынып оқулығы'}
        </div>
      </div>
      
      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
        <div className="archival-doc p-8 sm:p-10">
          <p className="mb-8 text-sm font-semibold leading-7 text-[#8C3A2B] uppercase tracking-wider mono border-b border-[#CFC5B1] pb-4">Сұрақ: {item.question}</p>
          <ol className="space-y-6">
            {points.map((point, index) => (
              <li key={point} className="animate-enter-up flex gap-5" style={{ animationDelay: `${index * 80}ms` }} data-testid={`text-${source}-point-${index}`}>
                <span className={`serif mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-sm border ${isAi ? 'border-[#5A635A] text-[#5A635A]' : 'border-[#CFA052] bg-[#F5F2EA] text-[#1A3A36] font-bold'}`}>
                  {index + 1}
                </span>
                <span className="text-base leading-8 text-[#1A3A36]">{point}</span>
              </li>
            ))}
          </ol>
        </div>
        
        <aside className="space-y-6">
          <div className="archival-doc bg-[#1A3A36] p-6 text-[#F5F2EA] border-transparent">
            <div className="ornament-corner-tl !border-[#CFA052]" />
            <div className="ornament-corner-br !border-[#CFA052]" />
            <p className="mono text-[10px] uppercase tracking-[.25em] text-[#CFA052] flex items-center gap-2">
              <Lightbulb size={12} /> Оқығанда ойлан
            </p>
            <p className="mt-4 text-sm leading-7 text-[#D1C9B8]">
              {isAi ? 'Бұл жауапта нақты қандай есімдер, даталар немесе себептер аталды?' : 'Оқулық қандай нақты деректермен немесе атаулармен толықтырды?'}
            </p>
          </div>
          <ArchivalPlaceholder modelPath={item.modelPath} />
        </aside>
      </div>
      
      <div className="mt-12 flex justify-end">
        <PrimaryButton onClick={onNext} testId={`button-next-${source}`}>
          {isAi ? 'Оқулық жауабына өту' : 'Екі жауапты салыстыру'} <ArrowRight size={17} />
        </PrimaryButton>
      </div>
    </main>
  );
}

function FindingList({ title, items, tone, icon: Icon }: { title: string; items: string[]; tone: 'green' | 'gold' | 'red' | 'purple'; icon: typeof Check }) {
  const tones = { 
    green: 'border-[#1A3A36] bg-[#1A3A36]/5 text-[#1A3A36]', 
    gold: 'border-[#CFA052] bg-[#CFA052]/5 text-[#916b2a]', 
    red: 'border-[#8C3A2B] bg-[#8C3A2B]/5 text-[#8C3A2B]', 
    purple: 'border-[#5A635A] bg-[#5A635A]/5 text-[#5A635A]' 
  };
  
  return (
    <div className={`archival-doc border-t-4 p-5 sm:p-6 ${tones[tone]} border-x-0 border-b-0 shadow-none bg-transparent`}>
      <div className="mb-5 flex items-center gap-3 border-b border-current/20 pb-3">
        <Icon size={18} strokeWidth={2} />
        <span className="font-bold serif text-lg">{title}</span>
        <span className="mono ml-auto text-[10px] opacity-70 px-2 border border-current rounded-sm">{items.length}</span>
      </div>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 text-sm leading-6" data-testid={`finding-${tone}-${index}`}>
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
            <span className="opacity-90">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Comparison({ item, onNext, onBack }: { item: ComparisonData; onNext: () => void; onBack: () => void }) {
  return (
    <main className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14">
      <button onClick={onBack} className="mono mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#5A635A] transition-colors hover:text-[#8C3A2B]" data-testid="button-back-textbook">
        <ArrowLeft size={14} /> Оқулық жауабына оралу
      </button>
      
      <div className="animate-enter-up flex flex-wrap items-end justify-between gap-6 border-b border-[#CFC5B1] pb-6">
        <div>
          <SectionKicker>Негізгі зерттеу · Салыстыру</SectionKicker>
          <h1 className="serif text-5xl leading-none text-[#1A3A36]">Екі дерек, <span className="italic text-[#8C3A2B]">бір сұрақ.</span></h1>
        </div>
        <p className="max-w-sm text-sm leading-7 text-[#5A635A]">Ұқсас ойларды, тек бір деректе кездесетін мәліметтерді және тексеруге тұрарлық тұстарды бөліп қара.</p>
      </div>
      
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="archival-doc p-6 sm:p-8 bg-[#FAFAFA]">
          <div className="mb-6 flex items-center justify-between border-b border-[#CFC5B1] pb-4">
            <div className="flex items-center gap-3">
               <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#5A635A] text-[#5A635A]"><Cpu size={18} /></span>
               <div>
                 <p className="serif text-xl font-bold text-[#1A3A36]">ЖИ жауабы</p>
                 <p className="mono text-[9px] uppercase tracking-[.2em] text-[#5A635A]">Жасанды интеллект</p>
               </div>
            </div>
          </div>
          <ul className="space-y-4">
            {item.aiAnswer.map((point, index) => (
              <li key={point} className="flex gap-4 text-sm leading-7 text-[#1A3A36]">
                <span className="mono text-[10px] text-[#5A635A] pt-1 border-r border-[#CFC5B1] pr-3">0{index + 1}</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="archival-doc p-6 sm:p-8 bg-[#F5F2EA]">
          <div className="mb-6 flex items-center justify-between border-b border-[#CFA052]/50 pb-4">
            <div className="flex items-center gap-3">
               <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#CFA052] bg-[#CFA052]/10 text-[#8C3A2B]"><BookOpen size={18} /></span>
               <div>
                 <p className="serif text-xl font-bold text-[#1A3A36]">Оқулық жауабы</p>
                 <p className="mono text-[9px] uppercase tracking-[.2em] text-[#8C3A2B]">Негізгі дереккөз</p>
               </div>
            </div>
          </div>
          <ul className="space-y-4">
            {item.textbookAnswer.map((point, index) => (
              <li key={point} className="flex gap-4 text-sm leading-7 text-[#1A3A36]">
                <span className="mono text-[10px] text-[#8C3A2B] pt-1 border-r border-[#CFA052]/50 pr-3">0{index + 1}</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8 grid gap-1 md:grid-cols-2 lg:grid-cols-4 bg-[#CFC5B1] border border-[#CFC5B1] p-[1px]">
        <div className="bg-[#EBE5DA]"><FindingList title="Ұқсастықтар" items={item.similarities} tone="green" icon={Check} /></div>
        <div className="bg-[#EBE5DA]"><FindingList title="Айырмашылық" items={item.differences} tone="gold" icon={SearchCheck} /></div>
        <div className="bg-[#EBE5DA]"><FindingList title="Оқулықта ғана" items={item.textbookOnly} tone="red" icon={BookOpen} /></div>
        <div className="bg-[#EBE5DA]"><FindingList title="ЖИ-де ғана" items={item.aiOnly} tone="purple" icon={Cpu} /></div>
      </div>
      
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 archival-doc border-l-4 border-l-[#8C3A2B] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8C3A2B]/10 text-[#8C3A2B]">
            <SearchCheck size={20} />
          </div>
          <div>
            <p className="serif text-xl font-bold text-[#1A3A36]">Тексеруді қажет ететін нүкте</p>
            <p className="mt-2 text-sm leading-7 text-[#5A635A] max-w-2xl">{item.pointsToCheck.join(' ')}</p>
          </div>
        </div>
        <PrimaryButton onClick={onNext} testId="button-see-analysis" variant="gold">
          Талдауды көру <ArrowRight size={17} />
        </PrimaryButton>
      </div>
    </main>
  );
}

function Final({ item, onRestart, onTopics }: { item: ComparisonData; onRestart: () => void; onTopics: () => void }) {
  return (
    <main className="mx-auto max-w-[1050px] px-5 py-12 sm:px-8 sm:py-20">
      <div className="animate-enter-up text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center border-2 border-[#CFA052] rounded-full text-[#1A3A36] mb-6">
          <Flag size={30} strokeWidth={1.5} className="text-[#8C3A2B]" />
        </div>
        <SectionKicker><span className="mx-auto">Зерттеу аяқталды</span></SectionKicker>
        <h1 className="serif text-5xl sm:text-6xl leading-[1.1] text-[#1A3A36] mt-4">
          Жақсы жұмыс,<br /><span className="italic text-[#CFA052]">жас зерттеуші.</span>
        </h1>
        <div className="mx-auto mt-8 max-w-2xl archival-doc p-6 text-base leading-8 text-[#1A3A36] italic border-[#CFC5B1] bg-[#F5F2EA]">
          "{item.analysis}"
        </div>
      </div>
      
      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          { value: `${item.similarityPercentage}%`, label: 'жауаптар ұқсас', border: 'border-[#1A3A36]', text: 'text-[#1A3A36]' }, 
          { value: `${item.differencePercentage}%`, label: 'нақты айырмашылық', border: 'border-[#CFA052]', text: 'text-[#916b2a]' }, 
          { value: `${item.pointsToCheck.length}`, label: 'тексеру нүктесі', border: 'border-[#8C3A2B]', text: 'text-[#8C3A2B]' }
        ].map((stat) => (
          <div key={stat.label} className={`archival-doc p-8 text-center border-t-4 ${stat.border}`} data-testid={`stat-${stat.label}`}>
            <p className={`serif text-5xl font-bold ${stat.text}`}>{stat.value}</p>
            <p className="mono mt-4 text-[10px] uppercase tracking-widest text-[#5A635A]">{stat.label}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-10 archival-doc p-8 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#CFC5B1] pb-6">
          <div>
            <p className="mono text-[10px] uppercase tracking-[.25em] text-[#CFA052]">Зерттеу жазбасы</p>
            <h2 className="serif mt-2 text-2xl font-bold text-[#1A3A36]">{item.topicTitle}</h2>
          </div>
          <span className="border border-[#CFC5B1] px-4 py-2 text-[10px] uppercase tracking-widest mono text-[#5A635A]">Сұрақ {item.id}</span>
        </div>
        
        <div className="mt-8 grid gap-8 md:grid-cols-2 relative">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#CFC5B1] -translate-x-1/2" />
          <div className="md:pr-8">
            <p className="mono mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#1A3A36]">
              <Bookmark size={14} /> Есте сақта
            </p>
            <p className="text-sm leading-8 text-[#1A3A36]">{item.similarities[0]} {item.textbookOnly[0]}</p>
          </div>
          <div className="md:pl-8">
            <p className="mono mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8C3A2B]">
              <Compass size={14} /> Келесі іздеу
            </p>
            <p className="text-sm leading-8 text-[#1A3A36]">{item.pointsToCheck[0]}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-14 flex flex-col justify-center gap-4 sm:flex-row">
        <PrimaryButton onClick={onTopics} testId="button-choose-another" variant="quiet">
          Басқа тақырыпты таңдау
        </PrimaryButton>
        <PrimaryButton onClick={onRestart} testId="button-finish-restart" variant="dark">
          Жаңа зерттеу бастау <ArrowRight size={17} />
        </PrimaryButton>
      </div>
    </main>
  );
}


function App() {
  const [currentTopicId, setCurrentTopicId] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const currentQuestion = useMemo(() => questionsData.find((question) => question.id === currentQuestionId), [currentQuestionId]);

  const restart = () => { setCurrentTopicId(''); setCurrentQuestionId(null); setCurrentStep('landing'); };
  const chooseTopics = () => { setCurrentQuestionId(null); setCurrentStep('topics'); };

  let content: React.ReactNode;
  if (currentStep === 'landing') content = <Landing onBegin={() => setCurrentStep('topics')} />;
  if (currentStep === 'topics') content = <Topics onSelect={(id) => { setCurrentTopicId(id); setCurrentStep('questions'); }} />;
  if (currentStep === 'questions') content = <Questions topicId={currentTopicId} onBack={() => setCurrentStep('topics')} onSelect={(id) => { setCurrentQuestionId(id); setCurrentStep('intro'); }} />;
  if (currentStep === 'intro' && currentQuestion) content = <Intro item={currentQuestion} onBack={() => setCurrentStep('questions')} onNext={() => setCurrentStep('ai')} />;
  if (currentStep === 'ai' && currentQuestion) content = <SourceAnswer item={currentQuestion} source="ai" onBack={() => setCurrentStep('intro')} onNext={() => setCurrentStep('textbook')} />;
  if (currentStep === 'textbook' && currentQuestion) content = <SourceAnswer item={currentQuestion} source="textbook" onBack={() => setCurrentStep('ai')} onNext={() => setCurrentStep('comparison')} />;
  if (currentStep === 'comparison' && currentQuestion) content = <Comparison item={currentQuestion} onBack={() => setCurrentStep('textbook')} onNext={() => setCurrentStep('final')} />;
  if (currentStep === 'final' && currentQuestion) content = <Final item={currentQuestion} onRestart={restart} onTopics={chooseTopics} />;

  return (
    <div className="paper-grain min-h-[100dvh] bg-[#EBE5DA] flex flex-col font-sans selection:bg-[#CFA052] selection:text-[#1A3A36]">
      <TopBar step={currentStep} onHome={restart} onRestart={restart} />
      <div className="flex-1">
        {content}
      </div>
    </div>
  );
}

export default App;
