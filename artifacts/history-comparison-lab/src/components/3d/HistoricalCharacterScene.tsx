import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const TAUKE_KHAN_MODEL_URL = '/assets/models/tauke-khan.glb?v=royal-costume-1';

interface HistoricalCharacterSceneProps {
  onReady: () => void;
  onError: () => void;
}

export default function HistoricalCharacterScene({ onReady, onError }: HistoricalCharacterSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  const errorRef = useRef(onError);

  useEffect(() => {
    readyRef.current = onReady;
    errorRef.current = onError;
  }, [onReady, onError]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | undefined;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | undefined;
    let disposed = false;
    let character: THREE.Group | undefined;
    const pointer = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39, 1, 0.01, 100);
    camera.position.set(0, 0.08, 4.8);

    try {
      const probe = document.createElement('canvas');
      const canUseWebGL = Boolean(
        window.WebGLRenderingContext
        && (probe.getContext('webgl2') || probe.getContext('webgl')),
      );
      if (!canUseWebGL) {
        errorRef.current();
        return;
      }

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      errorRef.current();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfffbf1, 0x4f4339, 1.55));

    const keyLight = new THREE.DirectionalLight(0xfff4df, 2.45);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xd9edf2, 1.4, 10);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    const warmLight = new THREE.PointLight(0xffc27a, 1.25, 9);
    warmLight.position.set(3, -1, 3);
    scene.add(warmLight);

    const characterGroup = new THREE.Group();
    characterGroup.position.set(-0.14, 0.04, 0);
    scene.add(characterGroup);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      TAUKE_KHAN_MODEL_URL,
      (gltf) => {
        if (disposed) return;
        character = gltf.scene;

        const bounds = new THREE.Box3().setFromObject(character);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        character.position.sub(center);

        const modelRoot = new THREE.Group();
        const scale = 1.95 / Math.max(size.x, size.y, size.z);
        modelRoot.scale.setScalar(scale);
        character.rotation.y = 0;

        character.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        modelRoot.add(character);
        characterGroup.add(modelRoot);
        readyRef.current();
      },
      undefined,
      (error) => {
        console.error('Tauke Khan model failed to load:', error);
        errorRef.current();
      },
    );

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      pointer.y = THREE.MathUtils.clamp(-(((event.clientY - rect.top) / rect.height) * 2 - 1), -1, 1);
    };

    const handlePointerLeave = () => {
      pointer.set(0, 0);
    };

    const resize = () => {
      if (!renderer) return;
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    resize();

    const startedAt = performance.now();
    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const elapsed = (performance.now() - startedAt) / 1000;

      characterGroup.rotation.y += ((pointer.x * 0.22) - characterGroup.rotation.y) * 0.04;
      characterGroup.rotation.x += ((-pointer.y * 0.075) - characterGroup.rotation.x) * 0.04;
      characterGroup.position.y = 0.04 + Math.sin(elapsed * 0.48) * 0.025;
      renderer?.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);

      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material.dispose());
      });

      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
      }}
      aria-label="Тәуке ханның интерактивті 3D моделі"
    />
  );
}