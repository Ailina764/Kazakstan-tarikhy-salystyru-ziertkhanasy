import React, { useState, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import HistoricalCharacterScene from './HistoricalCharacterScene';

const R3fScene = React.lazy(() => import('./R3fScene'));
const RobotScene = React.lazy(() => import('./RobotScene'));
const BookScene = React.lazy(() => import('./BookScene'));

interface SceneProps {
  id: string;
  className?: string;
  webglClassName?: string;
  isAi?: boolean;
  topicId?: string;
}

export function Scene({ id, className, webglClassName, isAi, topicId }: SceneProps) {
  const [status, setStatus] = useState<'loading' | 'active' | 'error'>('loading');

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className || ''} ${status === 'active' ? webglClassName || '' : ''}`}>
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
              ) : id === 'questions-placeholder' && topicId === 'tauke-khan' ? (
                <HistoricalCharacterScene
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
