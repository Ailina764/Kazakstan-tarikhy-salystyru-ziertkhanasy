import React, { useState, useEffect, useRef } from 'react';

function OrbFallback() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 30px rgba(74, 109, 124, 0.6))' }}>
      <circle cx="50" cy="50" r="42" fill="url(#ai-glow)" opacity="0.3" className="animate-pulse-slow" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#6893A6" strokeWidth="1" strokeDasharray="8 4 2 4" style={{ animation: 'spin-slow 25s linear infinite' }} />
      <circle cx="50" cy="50" r="32" fill="none" stroke="#2B4653" strokeWidth="1.5" strokeDasharray="12 12" style={{ animation: 'spin-slow 15s linear reverse infinite' }} />
      <circle cx="50" cy="50" r="26" fill="#4A6D7C" opacity="0.2" stroke="#8BB8CD" strokeWidth="0.5" />
      
      {/* Inner core */}
      <circle cx="50" cy="50" r="14" fill="#8BB8CD" opacity="0.9" style={{ filter: 'drop-shadow(0 0 12px #8BB8CD)' }} />
      <circle cx="50" cy="50" r="10" fill="#FFFFFF" opacity="0.8" />
      <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
      
      {/* Decorative tech lines */}
      <path d="M50 5 L50 12 M50 88 L50 95 M5 50 L12 50 M88 50 L95 50" stroke="#6893A6" strokeWidth="1" opacity="0.5" />
      <path d="M20 20 L25 25 M80 80 L75 75 M20 80 L25 75 M80 20 L75 25" stroke="#4A6D7C" strokeWidth="1" opacity="0.5" />

      <defs>
        <radialGradient id="ai-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8BB8CD" stopOpacity="1" />
          <stop offset="100%" stopColor="#4A6D7C" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function ScrollFallback() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' }}>
      {/* Halo behind */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#CFA052" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="2 4" style={{ animation: 'spin-slow 40s linear infinite' }} />
      
      {/* Scroll Background */}
      <rect x="25" y="15" width="50" height="70" fill="#EBE5DA" rx="2" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }} />
      
      {/* Wooden Rollers */}
      <rect x="18" y="12" width="64" height="8" fill="#4A3025" rx="4" />
      <rect x="18" y="80" width="64" height="8" fill="#4A3025" rx="4" />
      
      {/* Gold Endcaps */}
      <circle cx="18" cy="16" r="5" fill="#CFA052" />
      <circle cx="82" cy="16" r="5" fill="#CFA052" />
      <circle cx="18" cy="84" r="5" fill="#CFA052" />
      <circle cx="82" cy="84" r="5" fill="#CFA052" />
      
      {/* Inner highlights on caps */}
      <circle cx="18" cy="16" r="2" fill="#FFE090" />
      <circle cx="82" cy="16" r="2" fill="#FFE090" />
      <circle cx="18" cy="84" r="2" fill="#FFE090" />
      <circle cx="82" cy="84" r="2" fill="#FFE090" />
      
      {/* Text / Runes */}
      <path d="M35 35 h30 M35 45 h30 M35 55 h20 M35 65 h25" stroke="#8C3A2B" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      
      {/* Ornament Stamp */}
      <circle cx="50" cy="25" r="4" fill="#CFA052" />
      <path d="M48 25 L52 25 M50 23 L50 27" stroke="#8C3A2B" strokeWidth="1" />
    </svg>
  );
}

function ShieldFallback() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))' }}>
      {/* Halo */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#CFA052" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="2 6" style={{ animation: 'spin-slow 40s linear infinite' }} />
      
      {/* Shield Body */}
      <circle cx="50" cy="50" r="42" fill="#2A221E" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#4A3025" strokeWidth="6" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="#CFA052" strokeWidth="1.5" opacity="0.8" />
      
      {/* Concentric rings */}
      <circle cx="50" cy="50" r="28" fill="none" stroke="#3A2822" strokeWidth="2" />
      
      {/* Center Boss Base */}
      <circle cx="50" cy="50" r="16" fill="#B38A44" />
      {/* Center Boss Highlight */}
      <circle cx="47" cy="47" r="12" fill="#CFA052" />
      <circle cx="44" cy="44" r="5" fill="#FFE090" />
      
      {/* Jewel */}
      <circle cx="50" cy="50" r="6" fill="#8C3A2B" />
      <circle cx="48" cy="48" r="2" fill="#A84C3D" />
      
      {/* Studs */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <g key={i} transform={`translate(${50 + Math.cos(angle * Math.PI / 180) * 33}, ${50 + Math.sin(angle * Math.PI / 180) * 33})`}>
          <circle r="3.5" fill="#4A3025" />
          <circle r="1.5" cx="-0.5" cy="-0.5" fill="#6B4536" />
        </g>
      ))}
    </svg>
  );
}

function HelmetFallback() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.35))' }}>
      {/* Decorative Halo/Ornament behind */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#CFA052" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="4 4" style={{ animation: 'spin-slow 35s linear infinite' }} />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#8C3A2B" strokeWidth="1" strokeOpacity="0.3" />
      
      {/* Helmet Body */}
      <path d="M20 65 C20 20, 80 20, 80 65" fill="#3A2822" />
      {/* Helmet highlights to make it dimensional bronze/red */}
      <path d="M30 65 C30 30, 70 30, 70 65" fill="#4A3025" />
      <path d="M40 65 C40 40, 60 40, 60 65" fill="#5A3A2C" />
      
      {/* Gold Rim Base */}
      <path d="M15 65 L85 65 L85 74 L15 74 Z" fill="#B38A44" />
      {/* Gold Rim Highlight */}
      <path d="M15 65 L85 65 L85 68 L15 68 Z" fill="#FFE090" />
      
      {/* Nose Guard Base */}
      <path d="M46 74 L54 74 L54 96 L46 96 Z" fill="#B38A44" />
      {/* Nose Guard Highlight */}
      <path d="M46 74 L49 74 L49 96 L46 96 Z" fill="#FFE090" />
      
      {/* Helmet Spike */}
      <path d="M48 5 L52 5 L55 35 L45 35 Z" fill="#B38A44" />
      <path d="M48 5 L50 5 L50 35 L45 35 Z" fill="#FFE090" />
      <circle cx="50" cy="5" r="4" fill="#CFA052" />
      <circle cx="50" cy="5" r="1.5" fill="#FFE090" />
      
      {/* Engravings/Studs on Rim */}
      <circle cx="25" cy="69.5" r="2.5" fill="#8C3A2B" />
      <circle cx="35" cy="69.5" r="2.5" fill="#8C3A2B" />
      <circle cx="65" cy="69.5" r="2.5" fill="#8C3A2B" />
      <circle cx="75" cy="69.5" r="2.5" fill="#8C3A2B" />
    </svg>
  );
}

function SaberFallback() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' }}>
      {/* Halo */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#CFA052" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="5 5" style={{ animation: 'spin-slow 35s linear infinite' }} />
      
      {/* Blade Base */}
      <path d="M15 85 Q 50 100, 85 15 Q 65 50, 25 75 Z" fill="#8A959E" />
      {/* Blade Edge Highlight */}
      <path d="M17 83 Q 50 97, 85 15 Q 70 45, 30 70 Z" fill="#BAC3C9" />
      <path d="M20 80 Q 50 94, 85 15 Q 75 40, 35 65 Z" fill="#E6EAED" />
      
      {/* Guard Base */}
      <path d="M12 88 L 32 68" stroke="#B38A44" strokeWidth="5" strokeLinecap="round" />
      {/* Guard Highlight */}
      <path d="M11 87 L 31 67" stroke="#FFE090" strokeWidth="2" strokeLinecap="round" />
      
      {/* Handle Base */}
      <path d="M5 95 L 20 80" stroke="#3A2822" strokeWidth="8" strokeLinecap="round" />
      {/* Handle Wrapping */}
      <path d="M8 92 L 17 83" stroke="#2A1C16" strokeWidth="3" strokeDasharray="3 3" />
      
      {/* Pommel Base */}
      <circle cx="5" cy="95" r="5" fill="#B38A44" />
      {/* Pommel Highlight */}
      <circle cx="4" cy="94" r="2.5" fill="#FFE090" />
      
      {/* Jewel on Guard */}
      <circle cx="21" cy="79" r="2.5" fill="#8C3A2B" />
    </svg>
  );
}

function DombraFallback() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.35))' }}>
      {/* Halo */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#CFA052" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="8 8" style={{ animation: 'spin-slow 45s linear infinite' }} />
      
      {/* Body Shadow/Base */}
      <ellipse cx="50" cy="72" rx="26" ry="22" fill="#5A3A2C" />
      {/* Body Front */}
      <ellipse cx="50" cy="70" rx="25" ry="21" fill="#E0C090" />
      {/* Body Highlight */}
      <ellipse cx="48" cy="68" rx="20" ry="17" fill="#F0D5AC" />
      
      {/* Sound Hole */}
      <circle cx="50" cy="68" r="6" fill="#201005" />
      <circle cx="50" cy="68" r="7" fill="none" stroke="#8C3A2B" strokeWidth="1" opacity="0.6" />
      
      {/* Bridge */}
      <rect x="42" y="82" width="16" height="3" fill="#3A2822" rx="1" />
      
      {/* Neck */}
      <rect x="46" y="15" width="8" height="42" fill="#5A3A2C" />
      <rect x="47" y="15" width="4" height="42" fill="#8C5A42" />
      
      {/* Head */}
      <rect x="44" y="8" width="12" height="7" fill="#4A3025" rx="2" />
      <rect x="45" y="9" width="10" height="5" fill="#5A3A2C" rx="1" />
      
      {/* Pegs */}
      <path d="M42 10 L32 10 M58 10 L68 10" stroke="#201005" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="10" r="2" fill="#3A2822" />
      <circle cx="68" cy="10" r="2" fill="#3A2822" />
      
      {/* Strings */}
      <line x1="48" y1="11" x2="48" y2="83" stroke="#FFF" strokeWidth="0.75" opacity="0.8" />
      <line x1="52" y1="11" x2="52" y2="83" stroke="#FFF" strokeWidth="0.75" opacity="0.8" />
      
      {/* Frets */}
      {[25, 30, 34, 38, 42, 45, 48, 51, 54].map((y, i) => (
         <line key={i} x1="46" y1={y} x2="54" y2={y} stroke="#E0C090" strokeWidth="0.5" opacity="0.7" />
      ))}
    </svg>
  );
}

export function FallbackModel({ isAi, topicId }: { isAi?: boolean, topicId?: string }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setMouse({ x, y });
    };
    
    // Only add listener if user prefers motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const rx = mouse.y * -15;
  const ry = mouse.x * 15;

  const transformStyle = {
    transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`,
    transition: 'transform 0.1s ease-out'
  };

  let SvgComponent = ScrollFallback;
  if (isAi) {
    SvgComponent = OrbFallback;
  } else {
    switch (topicId) {
      case 'tauke-khan': SvgComponent = ScrollFallback; break;
      case 'aktaban-shubyryndi': SvgComponent = ShieldFallback; break;
      case 'abulkhair-khan': SvgComponent = HelmetFallback; break;
      case 'bogenbay-batyr': SvgComponent = SaberFallback; break;
      case 'bukhar-zhyrau': SvgComponent = DombraFallback; break;
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative pointer-events-none">
      <div 
        className="relative w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center motion-safe:animate-float-gently" 
        style={transformStyle}
      >
        <SvgComponent />
      </div>
      <div className="absolute bottom-[10%] lg:bottom-1/4 w-48 h-6 bg-black/15 dark:bg-black/50 blur-2xl rounded-full motion-safe:animate-pulse-slow" />
    </div>
  );
}
