import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows } from '@react-three/drei';
import { FallbackModel } from './FallbackModel';

// Safe WebGL check that avoids creating multiple contexts unnecessarily
let cachedWebGLSupport: boolean | null = null;

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  if (cachedWebGLSupport !== null) return cachedWebGLSupport;
  
  try {
    const canvas = document.createElement('canvas');
    cachedWebGLSupport = !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    cachedWebGLSupport = false;
  }
  return cachedWebGLSupport;
}

interface SceneProps {
  children: React.ReactNode;
  className?: string;
  webglClassName?: string;
  fallbackClassName?: string;
  isAi?: boolean;
  topicId?: string;
}

export function Scene({ children, className, webglClassName, fallbackClassName, isAi, topicId }: SceneProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setHasWebGL(checkWebGL());
  }, []);

  if (hasWebGL === null) {
    return <div className={`relative w-full h-full ${className || ''}`} />;
  }

  if (!hasWebGL) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className || ''} ${fallbackClassName || ''}`}>
        <FallbackModel isAi={isAi} topicId={topicId} />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className || ''} ${webglClassName || ''}`}>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <PresentationControls 
            global 
            snap
            rotation={[0, 0.3, 0]} 
            polar={[-Math.PI / 3, Math.PI / 3]} 
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
              {children}
            </Float>
          </PresentationControls>
          <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
