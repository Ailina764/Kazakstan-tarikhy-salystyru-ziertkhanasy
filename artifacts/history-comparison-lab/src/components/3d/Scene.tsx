import React, { useState, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import HistoricalCharacterScene from './HistoricalCharacterScene';

const R3fScene = React.lazy(() => import('./R3fScene'));
const RobotScene = React.lazy(() => import('./RobotScene'));
const BookScene = React.lazy(() => import('./BookScene'));
const MODEL_IMAGE_BASE_URL = `${import.meta.env.BASE_URL}assets/images/`;

interface SceneProps {
  id: string;
  className?: string;
  webglClassName?: string;
  isAi?: boolean;
  topicId?: string;
}

export function Scene({ id, className, webglClassName, isAi, topicId }: SceneProps) {
  const [status, setStatus] = useState<'loading' | 'active' | 'error'>('loading');
  const isHistoricalCharacter = (
    id === 'questions-placeholder' || id === 'intro-placeholder'
  ) && (
    topicId === 'tauke-khan'
    || topicId === 'aktaban-shubyryndi'
    || topicId === 'abulkhair-khan'
    || topicId === 'bogenbay-batyr'
    || topicId === 'bukhar-zhyrau'
  );
  const historicalCharacterFallback = topicId === 'aktaban-shubyryndi'
    ? `${MODEL_IMAGE_BASE_URL}aktaban-map-fallback.png`
    : topicId === 'bukhar-zhyrau'
    ? `${MODEL_IMAGE_BASE_URL}bukhar-zhyrau-fallback.png`
    : topicId === 'bogenbay-batyr'
    ? `${MODEL_IMAGE_BASE_URL}bogenbay-batyr-fallback.png`
    : topicId === 'abulkhair-khan'
      ? `${MODEL_IMAGE_BASE_URL}abulkhair-khan-fallback.png`
      : `${MODEL_IMAGE_BASE_URL}tauke-khan-fallback.png`;
  const historicalCharacterName = topicId === 'aktaban-shubyryndi'
    ? 'Ақтабан шұбырынды картасы'
    : topicId === 'bukhar-zhyrau'
    ? 'Бұқар жырау'
    : topicId === 'bogenbay-batyr'
    ? 'Бөгенбай батыр'
    : topicId === 'abulkhair-khan'
      ? 'Әбілқайыр хан'
      : 'Тәуке хан';

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className || ''} ${status === 'active' ? webglClassName || '' : ''}`}>
      {isHistoricalCharacter && status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          3D модель жүктелуде...
        </div>
      )}
      {isHistoricalCharacter && status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={historicalCharacterFallback}
            alt={historicalCharacterName}
            className={`h-full w-full object-contain ${
              topicId === 'aktaban-shubyryndi' ? 'scale-[0.82] -translate-x-2' : ''
            }`}
          />
        </div>
      )}
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
              ) : isHistoricalCharacter ? (
                <HistoricalCharacterScene
                  topicId={topicId}
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
    </div>
  );
}
