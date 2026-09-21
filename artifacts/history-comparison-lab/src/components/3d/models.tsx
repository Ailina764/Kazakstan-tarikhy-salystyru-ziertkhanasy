import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function AiOrb({ color = "#4A6D7C" }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={1}
        clearcoat={0.8}
        clearcoatRoughness={0}
        metalness={0.8}
        roughness={0.2}
        distort={0.4}
        speed={2}
        wireframe={true}
      />
    </Sphere>
  );
}

export function ZhetiZhargyScroll() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group} rotation={[Math.PI / 6, 0, 0]}>
      {/* Scroll Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 3, 32]} />
        <meshStandardMaterial color="#EBE5DA" roughness={0.9} />
      </mesh>
      {/* Wooden Ends */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
        <meshStandardMaterial color="#3A2818" roughness={0.6} />
      </mesh>
      <mesh position={[0, -1.55, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
        <meshStandardMaterial color="#3A2818" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#CFA052" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.65, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#CFA052" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function BattleShield() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={group} rotation={[Math.PI / 4, 0, 0]}>
      {/* Main Shield Body */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial color="#2A2522" roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Metal Rim */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.1, 16, 64]} />
        <meshStandardMaterial color="#4A4A4A" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Center Boss */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#CFA052" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Decorative Studs */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 4) * 1.2, 0.1, Math.sin(i * Math.PI / 4) * 1.2]}>
          <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#4A4A4A" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function KhanHelmet() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      {/* Dome */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8C3A2B" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 1, 0]}>
        <torusGeometry args={[1, 0.1, 16, 64]} />
        <meshStandardMaterial color="#CFA052" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Point / Spike */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.01, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#CFA052" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#CFA052" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Nose Guard */}
      <mesh position={[0, 0.5, 0.95]} rotation={[Math.PI / 8, 0, 0]}>
        <boxGeometry args={[0.15, 1, 0.05]} />
        <meshStandardMaterial color="#CFA052" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function Saber() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={group} rotation={[Math.PI / 4, 0, 0]}>
      {/* Handle */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.8, 16]} />
        <meshStandardMaterial color="#3A2818" roughness={0.8} />
      </mesh>
      {/* Pommel */}
      <mesh position={[0, -1.4, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#CFA052" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Guard */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.2]} />
        <meshStandardMaterial color="#CFA052" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Blade (curved using a torus segment) */}
      <mesh position={[-1.2, 1, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <torusGeometry args={[1.5, 0.05, 8, 32, Math.PI / 2]} />
        <meshStandardMaterial color="#A0A0A0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Inner part of blade for width */}
      <mesh position={[-1.15, 1.05, 0]} rotation={[0, 0, -Math.PI / 3]}>
         <torusGeometry args={[1.45, 0.02, 8, 32, Math.PI / 2]} />
         <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function Dombra() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
      group.current.rotation.z = Math.PI / 6;
    }
  });

  return (
    <group ref={group} rotation={[0, 0, Math.PI / 6]}>
      {/* Body */}
      <mesh position={[0, -1, 0]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#8C5A3B" roughness={0.6} />
      </mesh>
      {/* Flatten the front of the body */}
      <mesh position={[0, -1, 0.1]} scale={[1, 1, 0.1]}>
        <sphereGeometry args={[1.01, 32, 16]} />
        <meshStandardMaterial color="#E0C090" roughness={0.5} />
      </mesh>
      {/* Sound hole */}
      <mesh position={[0, -0.5, 0.22]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
        <meshStandardMaterial color="#201005" roughness={1} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 3.5, 16]} />
        <meshStandardMaterial color="#5A3A25" roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 3.4, 0]}>
        <boxGeometry args={[0.25, 0.5, 0.15]} />
        <meshStandardMaterial color="#5A3A25" roughness={0.7} />
      </mesh>
      {/* Pegs */}
      <mesh position={[-0.15, 3.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#201005" />
      </mesh>
      <mesh position={[0.15, 3.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#201005" />
      </mesh>
    </group>
  );
}

export function TopicModel({ topicId }: { topicId: string }) {
  switch (topicId) {
    case 'tauke-khan': return <ZhetiZhargyScroll />;
    case 'aktaban-shubyryndi': return <BattleShield />;
    case 'abulkhair-khan': return <KhanHelmet />;
    case 'bogenbay-batyr': return <Saber />;
    case 'bukhar-zhyrau': return <Dombra />;
    default: return <ZhetiZhargyScroll />;
  }
}
