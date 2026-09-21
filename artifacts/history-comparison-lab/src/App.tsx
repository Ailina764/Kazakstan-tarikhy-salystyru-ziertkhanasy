import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
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
} from 'lucide-react';
import { questionsData, topicInfo, type ComparisonData } from './data';

type Step = 'landing' | 'topics' | 'questions' | 'intro' | 'ai' | 'textbook' | 'comparison' | 'final';

const stepOrder: Step[] = ['landing', 'topics', 'questions', 'intro', 'ai', 'textbook', 'comparison', 'final'];

function HistoryObject3DPlaceholder({ modelPath }: { modelPath: string }) {
  return (
    <div className="relative overflow-hidden rounded-[1.4rem] border border-[#c6d9d2] bg-[#e7f0ea] p-5" data-testid="placeholder-history-model">
      <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full border-[18px] border-[#d2a451]/25" />
      <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full border-[22px] border-[#193b3d]/10" />
      <div className="relative flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#193b3d] text-[#e8be64] shadow-md">
          <Compass size={26} strokeWidth={1.5} />
        </div>
        <div>
          <p className="mono mb-1 text-[10px] uppercase tracking-[.18em] text-[#617c76]">Келесі қабат</p>
          <p className="font-semibold text-[#193b3d]">Тарихи нысан дайындалып жатыр</p>
          <p className="mt-1 text-xs leading-relaxed text-[#617c76]">3D нысанды көру мүмкіндігі болашақ интеграцияда іске қосылады.</p>
        </div>
      </div>
      <div className="mono relative mt-4 border-t border-[#c6d9d2] pt-3 text-[10px] text-[#617c76]" data-testid="text-model-path" data-model-path={modelPath}>
        Тарихи нысан коды сақталды · болашақ 3D модулі
      </div>
    </div>
  );
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-3 text-left" data-testid="button-brand-home">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#193b3d] text-[#e8be64] transition-transform duration-300 group-hover:rotate-[-8deg]">
        <History size={21} strokeWidth={1.7} />
      </span>
      <span>
        <span className="block font-bold tracking-[-.03em] text-[#193b3d]">Дерек Lab</span>
        <span className="mono block text-[9px] uppercase tracking-[.15em] text-[#778d86]">Қазақстан тарихы · 7-сынып</span>
      </span>
    </button>
  );
}

function TopBar({ step, onHome, onRestart }: { step: Step; onHome: () => void; onRestart: () => void }) {
  const current = Math.max(0, stepOrder.indexOf(step) - 1);
  const progress = step === 'landing' ? 0 : Math.min(100, (current / 6) * 100);
  return (
    <header className="sticky top-0 z-10 border-b border-[#d8d5c8] bg-[#f6f3ea]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 sm:px-8">
        <Brand onClick={onHome} />
        <div className="hidden items-center gap-3 md:flex">
          <span className="mono text-[10px] uppercase tracking-[.16em] text-[#778d86]">Зерттеу барысы</span>
          <div className="h-1.5 w-36 overflow-hidden rounded-full bg-[#dce5df]">
            <div className="h-full rounded-full bg-[#d2a451] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          {step !== 'landing' && <span className="mono text-[10px] text-[#193b3d]">{Math.max(current, 1)} / 6</span>}
        </div>
        {step !== 'landing' ? (
          <button onClick={onRestart} className="group flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[#617c76] transition-colors hover:bg-[#e7ebe2] hover:text-[#193b3d]" data-testid="button-restart">
            <RotateCcw size={15} className="transition-transform duration-300 group-hover:-rotate-45" />
            <span className="hidden sm:inline">Қайта бастау</span>
          </button>
        ) : <span className="mono hidden text-[10px] tracking-[.16em] text-[#778d86] sm:block">ЗЕРТТЕУ ДӘПТЕРІ  /  01</span>}
      </div>
      {step !== 'landing' && <div className="progress-line h-[2px]" style={{ '--progress': `${progress}%` } as CSSProperties} />}
    </header>
  );
}

function PrimaryButton({ children, onClick, testId, variant = 'dark', disabled = false }: { children: ReactNode; onClick: () => void; testId: string; variant?: 'dark' | 'gold' | 'quiet'; disabled?: boolean }) {
  const styles = variant === 'gold'
    ? 'bg-[#d2a451] text-[#193b3d] hover:bg-[#e0b867]'
    : variant === 'quiet'
      ? 'border border-[#ccd6ce] bg-transparent text-[#193b3d] hover:border-[#193b3d] hover:bg-[#e7ebe2]'
      : 'bg-[#193b3d] text-[#f9f6ed] hover:bg-[#275457]';
  return (
    <button onClick={onClick} disabled={disabled} className={`group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl px-5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${styles}`} data-testid={testId}>
      {children}
    </button>
  );
}

function SectionKicker({ children }: { children: ReactNode }) {
  return <p className="mono mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-[#a16c27]"><span className="h-1.5 w-1.5 rounded-full bg-[#d2a451]" />{children}</p>;
}

function Landing({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="animate-enter-soft">
      <section className="relative overflow-hidden bg-[#193b3d] text-[#f9f6ed]">
        <div className="absolute -right-20 -top-32 h-[500px] w-[500px] rounded-full border border-[#d2a451]/20" />
        <div className="absolute right-20 top-20 h-[340px] w-[340px] rounded-full border border-[#d2a451]/15" />
        <div className="absolute bottom-[-150px] left-[42%] h-[360px] w-[360px] rounded-full bg-[#d2a451]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 pb-20 pt-16 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:items-center md:pb-28 md:pt-24">
          <div>
            <div className="animate-enter-up delay-1">
              <span className="mono inline-flex items-center gap-2 border border-[#e8be64]/35 px-3 py-2 text-[10px] uppercase tracking-[.18em] text-[#e8be64]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e8be64]" />Зерттеу алаңы · 07
              </span>
            </div>
            <h1 className="serif animate-enter-up delay-2 mt-7 max-w-[720px] text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl">
              Тарихты<br /><span className="text-[#e8be64]">салыстырып</span> таны.
            </h1>
            <p className="animate-enter-up delay-3 mt-7 max-w-[560px] text-base leading-8 text-[#c6d9d2] sm:text-lg">
              ЖИ түсіндірмесі мен оқулық дерегін қатар қой. Ұқсастықты тап, айырмашылықты байқа, тексеруді қажет ететін сұрақтарды өзің анықта.
            </p>
            <div className="animate-enter-up delay-4 mt-9 flex flex-wrap items-center gap-4">
              <PrimaryButton onClick={onBegin} testId="button-begin" variant="gold">Зерттеуді бастау <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></PrimaryButton>
              <span className="mono text-[10px] tracking-[.12em] text-[#9bb8ad]">10 дайын салыстыру</span>
            </div>
          </div>
          <div className="relative hidden min-h-[365px] md:block">
            <div className="animate-float-gently absolute right-6 top-3 w-[280px] rotate-3 rounded-2xl border border-[#e8be64]/30 bg-[#f0ead9] p-5 text-[#193b3d] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#c9c3b1] pb-3"><span className="mono text-[9px] uppercase tracking-[.16em] text-[#778d86]">ДЕРЕК 01</span><BookOpen size={16} /></div>
              <p className="serif mt-5 text-2xl leading-tight">«Жеті жарғы»<br />ел тәртібінің<br />тірегі болды.</p>
              <div className="mt-10 flex items-center justify-between text-[10px] text-[#778d86]"><span>Оқулық жазбасы</span><span className="h-2 w-2 rounded-full bg-[#d2a451]" /></div>
            </div>
            <div className="absolute bottom-3 left-4 w-[270px] -rotate-6 rounded-2xl border border-[#a8c3b8]/40 bg-[#e7f0ea] p-5 text-[#193b3d] shadow-xl">
              <div className="flex items-center justify-between border-b border-[#bdd1c7] pb-3"><span className="mono text-[9px] uppercase tracking-[.16em] text-[#617c76]">ЖИ ТАЛДАУЫ</span><Cpu size={16} /></div>
              <p className="serif mt-5 text-2xl leading-tight">Бірлік —<br />негізгі<br />тақырып.</p>
              <div className="mt-9 flex gap-1"><span className="h-1.5 w-16 rounded-full bg-[#d2a451]" /><span className="h-1.5 w-10 rounded-full bg-[#193b3d]/20" /><span className="h-1.5 w-6 rounded-full bg-[#193b3d]/20" /></div>
            </div>
            <div className="absolute bottom-16 right-1 rounded-xl bg-[#d2a451] px-4 py-3 text-center text-[#193b3d] shadow-lg">
              <span className="mono block text-2xl font-medium">75%</span><span className="text-[10px] font-semibold">ұқсастық</span>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1240px] gap-5 px-5 py-16 sm:px-8 md:grid-cols-3 md:py-20">
        {[
          { icon: FileText, no: '01', title: 'Екі деректі оқы', text: 'Бір сұраққа берілген оқулық және ЖИ жауаптарын жеке-жеке қара.' },
          { icon: SearchCheck, no: '02', title: 'Дәлелді салыстыр', text: 'Қайсысы сәйкес? Қандай маңызды деталь тек бір жауапта бар?' },
          { icon: Lightbulb, no: '03', title: 'Зерттеу сұрағын тап', text: 'Күмәнді немесе тексеруді қажет ететін тұсты өзің белгіле.' },
        ].map(({ icon: Icon, no, title, text }, index) => (
          <div key={no} className={`animate-enter-up delay-${index + 1} border-t-2 border-[#d2a451] pt-5`}>
            <div className="flex items-start justify-between"><Icon size={22} strokeWidth={1.5} className="text-[#a16c27]" /><span className="mono text-[10px] text-[#a7b5aa]">{no}</span></div>
            <h2 className="mt-8 font-bold text-[#193b3d]">{title}</h2><p className="mt-2 text-sm leading-6 text-[#617c76]">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function Topics({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <main className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="animate-enter-up max-w-2xl"><SectionKicker>Бірінші қадам · Тақырыпты таңда</SectionKicker><h1 className="serif text-5xl leading-none tracking-[-.04em] text-[#193b3d] sm:text-6xl">Қай кезеңнің<br /><span className="text-[#a16c27]">ізін зерттейміз?</span></h1><p className="mt-5 text-base leading-7 text-[#617c76]">Бес тақырыптың бірін таңдап, сол кезеңге қатысты екі сұрақтың біріне жауап ізде.</p></div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topicInfo.map((topic, index) => (
          <button key={topic.id} onClick={() => onSelect(topic.id)} className={`group animate-enter-up delay-${Math.min(index + 1, 4)} relative min-h-[190px] overflow-hidden rounded-2xl border border-[#d8d5c8] bg-[#faf8f0] p-6 text-left shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:border-[#a8c3b8] hover:shadow-[var(--shadow-md)] ${index === 0 ? 'lg:col-span-2' : ''}`} data-testid={`button-topic-${topic.id}`}>
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[14px] border-[#e7ebe2] transition-transform duration-500 group-hover:scale-125" />
            <div className="relative flex items-start justify-between"><span className="mono text-[11px] text-[#a16c27]">{topic.mark}</span><ChevronRight size={18} className="text-[#a7b5aa] transition-transform group-hover:translate-x-1 group-hover:text-[#193b3d]" /></div>
            <div className="relative mt-10"><p className="mono text-[10px] uppercase tracking-[.12em] text-[#778d86]">{topic.period}</p><h2 className="serif mt-1 text-3xl text-[#193b3d]">{topic.title}</h2><p className="mt-2 text-xs text-[#617c76]">{topic.note}</p></div>
          </button>
        ))}
      </div>
      <div className="mt-12 flex items-center gap-3 border-t border-[#d8d5c8] pt-5 text-xs text-[#778d86]"><ShieldCheck size={16} className="text-[#a16c27]" />Барлық дерек 7-сынып оқулығындағы негізгі тақырыптарға негізделген.</div>
    </main>
  );
}

function Questions({ topicId, onSelect, onBack }: { topicId: string; onSelect: (id: number) => void; onBack: () => void }) {
  const topic = topicInfo.find((item) => item.id === topicId);
  const questions = questionsData.filter((item) => item.topicId === topicId);
  return (
    <main className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8 sm:py-16">
      <button onClick={onBack} className="mb-12 inline-flex items-center gap-2 text-xs font-bold text-[#617c76] transition-colors hover:text-[#193b3d]" data-testid="button-back-topics"><ArrowLeft size={15} /> Тақырыптарға оралу</button>
      <div className="animate-enter-up"><SectionKicker>Екінші қадам · Сұрақты таңда</SectionKicker><h1 className="serif text-5xl leading-none tracking-[-.04em] text-[#193b3d]">{topic?.title}</h1><p className="mt-4 text-[#617c76]">Осы тақырыптың қай қырын салыстырып көргің келеді?</p></div>
      <div className="mt-10 space-y-4">
        {questions.map((question, index) => (
          <button key={question.id} onClick={() => onSelect(question.id)} className="group animate-enter-up flex w-full items-start gap-5 rounded-2xl border border-[#d8d5c8] bg-[#faf8f0] p-6 text-left shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d2a451] hover:shadow-[var(--shadow-md)] sm:p-8" data-testid={`button-question-${question.id}`}>
            <span className="mono flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e7ebe2] text-xs text-[#a16c27] transition-colors group-hover:bg-[#d2a451] group-hover:text-[#193b3d]">0{index + 1}</span>
            <span className="flex-1"><span className="block text-lg font-bold leading-7 text-[#193b3d] sm:text-xl">{question.question}</span><span className="mt-4 flex items-center gap-2 text-xs text-[#778d86]"><FileText size={14} /> 2 дереккөз · салыстыру дайын</span></span>
            <ArrowRight size={20} className="mt-1 shrink-0 text-[#a7b5aa] transition-transform group-hover:translate-x-1 group-hover:text-[#a16c27]" />
          </button>
        ))}
      </div>
    </main>
  );
}

function Intro({ item, onNext, onBack }: { item: ComparisonData; onNext: () => void; onBack: () => void }) {
  return (
    <main className="mx-auto max-w-[1020px] px-5 py-10 sm:px-8 sm:py-16">
      <button onClick={onBack} className="mb-12 inline-flex items-center gap-2 text-xs font-bold text-[#617c76] hover:text-[#193b3d]" data-testid="button-back-questions"><ArrowLeft size={15} /> Сұрақтарға оралу</button>
      <div className="grid gap-10 md:grid-cols-[1.1fr_.9fr] md:items-center">
        <div className="animate-enter-up"><SectionKicker>Салыстыруға дайындал</SectionKicker><h1 className="serif text-5xl leading-[1.02] tracking-[-.04em] text-[#193b3d] sm:text-6xl">{item.question}</h1><p className="mt-6 max-w-xl text-base leading-7 text-[#617c76]">Алдымен екі жауапты бөлек оқимыз. Оқығанда даталарға, есімдерге және нақты дәлелдерге назар аудар.</p><div className="mt-8"><PrimaryButton onClick={onNext} testId="button-start-reading">Жауаптарды оқу <ArrowRight size={17} /></PrimaryButton></div></div>
        <div className="animate-enter-soft delay-2"><HistoryObject3DPlaceholder modelPath={item.modelPath} /><div className="mt-4 flex items-center gap-3 rounded-xl border border-[#e3c98e] bg-[#fff7df] p-4 text-xs leading-5 text-[#80602c]"><CircleHelp size={17} className="shrink-0" />Әр жауаптан кейін өз ойыңды белгілеуге уақыт бөл.</div></div>
      </div>
    </main>
  );
}

function SourceAnswer({ item, source, onNext, onBack }: { item: ComparisonData; source: 'ai' | 'textbook'; onNext: () => void; onBack: () => void }) {
  const isAi = source === 'ai';
  const points = isAi ? item.aiAnswer : item.textbookAnswer;
  return (
    <main className="mx-auto max-w-[1050px] px-5 py-10 sm:px-8 sm:py-14">
      <button onClick={onBack} className="mb-10 inline-flex items-center gap-2 text-xs font-bold text-[#617c76] hover:text-[#193b3d]" data-testid={`button-back-${source}`}><ArrowLeft size={15} /> Алдыңғы қадам</button>
      <div className="animate-enter-up flex flex-wrap items-end justify-between gap-5 border-b border-[#d8d5c8] pb-8">
        <div><SectionKicker>{isAi ? 'Бірінші дерек · ЖИ жауабы' : 'Екінші дерек · Оқулық жауабы'}</SectionKicker><h1 className="serif max-w-3xl text-5xl leading-none tracking-[-.04em] text-[#193b3d]">{isAi ? 'ЖИ бұл сұраққа қалай жауап берді?' : 'Оқулықта қандай дерек бар?'}</h1></div>
        <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${isAi ? 'bg-[#e8e6f0] text-[#514d70]' : 'bg-[#fff0ca] text-[#80602c]'}`}>{isAi ? <Cpu size={15} /> : <BookOpen size={15} />}{isAi ? 'Жасанды интеллект' : '7-сынып оқулығы'}</div>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-[#d8d5c8] bg-[#faf8f0] p-6 shadow-[var(--shadow-sm)] sm:p-8">
          <p className="mb-7 text-sm font-semibold leading-6 text-[#617c76]">{item.question}</p>
          <ol className="space-y-5">
            {points.map((point, index) => <li key={point} className="animate-enter-up flex gap-4" style={{ animationDelay: `${index * 60}ms` }} data-testid={`text-${source}-point-${index}`}><span className={`mono mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${isAi ? 'bg-[#e8e6f0] text-[#514d70]' : 'bg-[#fff0ca] text-[#80602c]'}`}>{index + 1}</span><span className="text-sm leading-7 text-[#193b3d]">{point}</span></li>)}
          </ol>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-[#193b3d] p-5 text-[#f9f6ed]"><p className="mono text-[10px] uppercase tracking-[.16em] text-[#e8be64]">Оқығанда ойлан</p><p className="mt-4 text-sm leading-6 text-[#c6d9d2]">{isAi ? 'Бұл жауапта нақты қандай есімдер, даталар немесе себептер аталды?' : 'Оқулық қандай нақты деректермен немесе атаулармен толықтырды?'}</p></div>
          <HistoryObject3DPlaceholder modelPath={item.modelPath} />
        </aside>
      </div>
      <div className="mt-8 flex justify-end"><PrimaryButton onClick={onNext} testId={`button-next-${source}`}>{isAi ? 'Оқулық жауабына өту' : 'Екі жауапты салыстыру'} <ArrowRight size={17} /></PrimaryButton></div>
    </main>
  );
}

function FindingList({ title, items, tone, icon: Icon }: { title: string; items: string[]; tone: 'green' | 'gold' | 'red' | 'purple'; icon: typeof Check }) {
  const tones = { green: 'border-[#b9d3c6] bg-[#edf5ef] text-[#2d6655]', gold: 'border-[#e3c98e] bg-[#fff7df] text-[#80602c]', red: 'border-[#e2beb5] bg-[#fbefec] text-[#85463d]', purple: 'border-[#cbc8df] bg-[#f0eff7] text-[#514d70]' };
  return <div className={`rounded-2xl border p-5 ${tones[tone]}`}><div className="mb-4 flex items-center gap-2 text-sm font-bold"><Icon size={17} /><span>{title}</span><span className="mono ml-auto text-[10px] opacity-70">{items.length}</span></div><ul className="space-y-3">{items.map((item, index) => <li key={item} className="flex gap-2 text-xs leading-5" data-testid={`finding-${tone}-${index}`}><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />{item}</li>)}</ul></div>;
}

function Comparison({ item, onNext, onBack }: { item: ComparisonData; onNext: () => void; onBack: () => void }) {
  return (
    <main className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14">
      <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-[#617c76] hover:text-[#193b3d]" data-testid="button-back-textbook"><ArrowLeft size={15} /> Оқулық жауабына оралу</button>
      <div className="animate-enter-up flex flex-wrap items-end justify-between gap-5"><div><SectionKicker>Негізгі зерттеу · Салыстыру</SectionKicker><h1 className="serif text-5xl leading-none tracking-[-.04em] text-[#193b3d]">Екі дерек, <span className="text-[#a16c27]">бір сұрақ.</span></h1></div><p className="max-w-sm text-sm leading-6 text-[#617c76]">Ұқсас ойларды, тек бір деректе кездесетін мәліметтерді және тексеруге тұрарлық тұстарды бөліп қара.</p></div>
      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#cbc8df] bg-[#f0eff7] p-6 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#514d70] text-[#f0eff7]"><Cpu size={17} /></span><div><p className="text-sm font-bold text-[#3f3c5b]">ЖИ жауабы</p><p className="mono text-[9px] uppercase tracking-[.13em] text-[#777391]">Жасанды интеллект</p></div></div><ul className="space-y-3">{item.aiAnswer.map((point, index) => <li key={point} className="flex gap-3 text-sm leading-6 text-[#3f3c5b]"><span className="mono text-[10px] text-[#777391]">0{index + 1}</span>{point}</li>)}</ul></div>
        <div className="rounded-2xl border border-[#e3c98e] bg-[#fff7df] p-6 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d2a451] text-[#193b3d]"><BookOpen size={17} /></span><div><p className="text-sm font-bold text-[#6e5224]">Оқулық жауабы</p><p className="mono text-[9px] uppercase tracking-[.13em] text-[#a17b38]">Негізгі дереккөз</p></div></div><ul className="space-y-3">{item.textbookAnswer.map((point, index) => <li key={point} className="flex gap-3 text-sm leading-6 text-[#6e5224]"><span className="mono text-[10px] text-[#a17b38]">0{index + 1}</span>{point}</li>)}</ul></div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <FindingList title="Ұқсастықтар" items={item.similarities} tone="green" icon={Check} />
        <FindingList title="Айырмашылық" items={item.differences} tone="gold" icon={SearchCheck} />
        <FindingList title="Оқулықта ғана" items={item.textbookOnly} tone="red" icon={BookOpen} />
        <FindingList title="ЖИ-де ғана" items={item.aiOnly} tone="purple" icon={Cpu} />
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#c6d9d2] bg-[#e7f0ea] p-5 sm:p-6"><div className="flex items-start gap-3"><CircleHelp size={19} className="mt-0.5 shrink-0 text-[#a16c27]" /><div><p className="text-sm font-bold text-[#193b3d]">Тексеруді қажет ететін нүкте</p><p className="mt-1 text-xs leading-5 text-[#617c76]">{item.pointsToCheck.join(' ')}</p></div></div><PrimaryButton onClick={onNext} testId="button-see-analysis" variant="gold">Талдауды көру <ArrowRight size={17} /></PrimaryButton></div>
    </main>
  );
}

function Final({ item, onRestart, onTopics }: { item: ComparisonData; onRestart: () => void; onTopics: () => void }) {
  return (
    <main className="mx-auto max-w-[1050px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="animate-enter-up text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d2a451] text-[#193b3d]"><Flag size={27} /></div><SectionKicker>Зерттеу аяқталды</SectionKicker><h1 className="serif text-5xl leading-none tracking-[-.04em] text-[#193b3d] sm:text-6xl">Жақсы жұмыс,<br /><span className="text-[#a16c27]">жас зерттеуші.</span></h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#617c76]">{item.analysis}</p></div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[{ value: `${item.similarityPercentage}%`, label: 'жауаптар ұқсас', color: 'text-[#2d6655]', bg: 'bg-[#edf5ef]' }, { value: `${item.differencePercentage}%`, label: 'нақты айырмашылық', color: 'text-[#80602c]', bg: 'bg-[#fff7df]' }, { value: `${item.pointsToCheck.length}`, label: 'тексеру нүктесі', color: 'text-[#514d70]', bg: 'bg-[#f0eff7]' }].map((stat) => <div key={stat.label} className={`rounded-2xl p-6 text-center ${stat.bg}`} data-testid={`stat-${stat.label}`}><p className={`mono text-4xl ${stat.color}`}>{stat.value}</p><p className="mt-2 text-xs font-semibold text-[#617c76]">{stat.label}</p></div>)}
      </div>
      <div className="mt-8 rounded-2xl border border-[#d8d5c8] bg-[#faf8f0] p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8d5c8] pb-5"><div><p className="mono text-[10px] uppercase tracking-[.16em] text-[#a16c27]">Зерттеу жазбасы</p><h2 className="mt-2 text-lg font-bold text-[#193b3d]">{item.topicTitle}</h2></div><span className="rounded-full bg-[#e7ebe2] px-3 py-2 text-xs text-[#617c76]">Сұрақ {item.id}</span></div><div className="mt-6 grid gap-5 md:grid-cols-2"><div><p className="mb-3 text-xs font-bold text-[#193b3d]">Есте сақта</p><p className="text-sm leading-6 text-[#617c76]">{item.similarities[0]} {item.textbookOnly[0]}</p></div><div><p className="mb-3 text-xs font-bold text-[#193b3d]">Келесі іздеу</p><p className="text-sm leading-6 text-[#617c76]">{item.pointsToCheck[0]}</p></div></div></div>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><PrimaryButton onClick={onTopics} testId="button-choose-another" variant="quiet"><Compass size={17} /> Басқа тақырыпты таңдау</PrimaryButton><PrimaryButton onClick={onRestart} testId="button-finish-restart">Жаңа зерттеу бастау <ArrowRight size={17} /></PrimaryButton></div>
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

  return <div className="paper-grain min-h-[100dvh] bg-[#f6f3ea]"><TopBar step={currentStep} onHome={restart} onRestart={restart} />{content}</div>;
}

export default App;