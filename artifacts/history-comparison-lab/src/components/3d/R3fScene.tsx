import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows } from '@react-three/drei';
import { AiOrb, TopicModel } from './models';

function checkWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

interface R3fSceneProps {
  isAi?: boolean;
  topicId?: string;
  onReady: () => void;
}

export default function R3fScene({ isAi, topicId, onReady }: R3fSceneProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setHasWebGL(checkWebGL());
  }, []);

  useEffect(() => {
    if (hasWebGL !== null) {
      const timer = setTimeout(() => {
        onReady();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [hasWebGL, onReady]);

  if (hasWebGL === false) {
    throw new Error('WebGL not supported');
  }

  if (hasWebGL === null) return null;

  return (
    <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} gl={{ powerPreference: 'default', antialias: true }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <PresentationControls 
        global 
        snap
        rotation={[0, 0.3, 0]} 
        polar={[-Math.PI / 3, Math.PI / 3]} 
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          {isAi ? <AiOrb color="#4A6D7C" /> : <TopicModel topicId={topicId || ''} />}
        </Float>
      </PresentationControls>
      <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4} />
      <Environment preset="city" />
    </Canvas>
  );
}
