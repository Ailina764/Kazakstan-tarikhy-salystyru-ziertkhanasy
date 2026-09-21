import React, { useState, useEffect, useRef, Suspense } from 'react';
import { FallbackModel } from './FallbackModel';
import { Box, Layers, Loader2, AlertCircle } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';

const R3fScene = React.lazy(() => import('./R3fScene'));
const RobotScene = React.lazy(() => import('./RobotScene'));
const BookScene = React.lazy(() => import('./BookScene'));

interface SceneProps {
  id: string;
  className?: string;
  webglClassName?: string;
  fallbackClassName?: string;
  isAi?: boolean;
  topicId?: string;
  autoActivate?: boolean;
}

export function Scene({ id, className, webglClassName, fallbackClassName, isAi, topicId, autoActivate = false }: SceneProps) {
  const [status, setStatus] = useState<'fallback' | 'loading' | 'active' | 'error'>('fallback');
  const autoActivationStarted = useRef(false);

  useEffect(() => {
    const handleActivate = (e: CustomEvent) => {
      if (e.detail !== id && status !== 'fallback' && status !== 'error') {
        setStatus('fallback');
      }
    };
    window.addEventListener('activate-3d', handleActivate as EventListener);
    return () => window.removeEventListener('activate-3d', handleActivate as EventListener);
  }, [id, status]);

  const activate3D = () => {
    window.dispatchEvent(new CustomEvent('activate-3d', { detail: id }));
    setStatus('loading');
  };

  const deactivate3D = () => {
    setStatus('fallback');
  };

  useEffect(() => {
    if (!autoActivate || autoActivationStarted.current) return;
    autoActivationStarted.current = true;

    const timer = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('activate-3d', { detail: id }));
      setStatus('loading');
    }, 250);

    return () => window.clearTimeout(timer);
  }, [autoActivate, id]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className || ''} ${status === 'active' ? webglClassName || '' : fallbackClassName || ''}`}>
      
      {/* Always render Fallback if not fully active, or underneath while loading */}
      {status !== 'active' && (
        <FallbackModel isAi={isAi} topicId={topicId} placement={id === 'landing-ai' ? 'landing' : 'panel'} />
      )}

      {/* WebGL Chunk */}
      {(status === 'loading' || status === 'active') && (
        <ErrorBoundary onError={() => setStatus('error')}>
          <Suspense fallback={null}>
            <div className={`absolute inset-0 transition-opacity duration-700 ${status === 'active' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {isAi ? (
                <RobotScene
                  placement={id === 'landing-ai' ? 'landing' : 'panel'}
                  onReady={() => setStatus('active')}
                  onError={() => setStatus('error')}
                />
              ) : id === 'source-answer-scene' ? (
                <BookScene
                  onReady={() => setStatus('active')}
                  onError={() => setStatus('error')}
                />
              ) : (
                <R3fScene sceneId={id} topicId={topicId} onReady={() => setStatus('active')} />
              )}
            </div>
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Overlay Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
        {status === 'fallback' && (
          <button 
            onClick={activate3D} 
            className="flex items-center gap-2 bg-background/60 backdrop-blur-xl border border-border px-4 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest text-foreground hover:bg-gold hover:text-background transition-all shadow-lg"
          >
            <Box size={14} /> 3D режимін қосу
          </button>
        )}
        
        {status === 'loading' && (
          <div className="flex items-center gap-2 bg-background/60 backdrop-blur-xl border border-border px-4 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest text-foreground shadow-lg">
            <Loader2 size={14} className="animate-spin" /> Жүктелуде...
          </div>
        )}
        
        {status === 'active' && (
          <button 
            onClick={deactivate3D} 
            className="flex items-center gap-2 bg-background/60 backdrop-blur-xl border border-border px-4 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-all shadow-lg opacity-50 hover:opacity-100"
          >
            <Layers size={14} /> 2D өту
          </button>
        )}
        
        {status === 'error' && !autoActivate && (
          <div className="flex items-center gap-2 bg-destructive/10 backdrop-blur-xl border border-destructive/30 px-4 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest text-destructive shadow-lg">
            <AlertCircle size={14} /> 3D Қолжетімсіз
          </div>
        )}
      </div>
    </div>
  );
}
