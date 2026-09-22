import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const MODEL_ASSET_BASE_URL = `${import.meta.env.BASE_URL}assets/models/`;
const TAUKE_KHAN_MODEL_URL = `${MODEL_ASSET_BASE_URL}tauke-khan.glb?v=royal-costume-1`;
const AKTABAN_MAP_MODEL_URL = `${MODEL_ASSET_BASE_URL}aktaban-map.glb?v=1`;
const ABULKHAIR_KHAN_MODEL_URL = `${MODEL_ASSET_BASE_URL}abulkhair-khan.glb?v=2`;
const BOGENBAY_BATYR_MODEL_URL = `${MODEL_ASSET_BASE_URL}bogenbay-batyr.glb?v=1`;
const BUKHAR_ZHYRAU_MODEL_URL = `${MODEL_ASSET_BASE_URL}bukhar-zhyrau.glb?v=1`;

interface HistoricalCharacterSceneProps {
  topicId?: string;
  onReady: () => void;
  onError: () => void;
}

export default function HistoricalCharacterScene({ topicId, onReady, onError }: HistoricalCharacterSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  const errorRef = useRef(onError);
  const isAktabanMap = topicId === 'aktaban-shubyryndi';
  const isAbulkhair = topicId === 'abulkhair-khan';
  const isBogenbay = topicId === 'bogenbay-batyr';
  const isBukhar = topicId === 'bukhar-zhyrau';
  const modelUrl = isAktabanMap
    ? AKTABAN_MAP_MODEL_URL
    : isBukhar
    ? BUKHAR_ZHYRAU_MODEL_URL
    : isBogenbay
    ? BOGENBAY_BATYR_MODEL_URL
    : isAbulkhair
      ? ABULKHAIR_KHAN_MODEL_URL
      : TAUKE_KHAN_MODEL_URL;
  const characterName = isAktabanMap
    ? 'Ақтабан шұбырынды картасы'
    : isBukhar
    ? 'Бұқар жырау'
    : isBogenbay
    ? 'Бөгенбай батыр'
    : isAbulkhair
      ? 'Әбілқайыр хан'
      : 'Тәуке хан';

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
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });
    } catch (error) {
      console.error(`${characterName} WebGL renderer failed to start:`, error);
      errorRef.current();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isAktabanMap ? 0.72 : 1;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfffbf1, 0x4f4339, isAktabanMap ? 0.9 : 1.55));

    const keyLight = new THREE.DirectionalLight(0xfff4df, isAktabanMap ? 1.45 : 2.45);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xd9edf2, isAktabanMap ? 0.65 : 1.4, 10);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    const warmLight = new THREE.PointLight(0xffc27a, isAktabanMap ? 0.55 : 1.25, 9);
    warmLight.position.set(3, -1, 3);
    scene.add(warmLight);

    const characterGroup = new THREE.Group();
    const basePositionY = isAktabanMap ? 0.04 : 0.16;
    characterGroup.position.set(isAktabanMap ? -0.07 : -0.14, basePositionY, 0);
    scene.add(characterGroup);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;
        character = gltf.scene;

        const bounds = new THREE.Box3().setFromObject(character);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        character.position.sub(center);

        const modelRoot = new THREE.Group();
        const scale = (isAktabanMap ? 2.12 : 1.95) / Math.max(size.x, size.y, size.z);
        modelRoot.scale.set(scale, scale * (isAktabanMap ? 1 : 1.08), scale);
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
        console.error(`${characterName} model failed to load:`, error);
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

      const targetRotationY = pointer.x * (isAktabanMap ? 0.1 : 0.22);
      const targetRotationX = -pointer.y * (isAktabanMap ? 0.045 : 0.075);
      characterGroup.rotation.y += (targetRotationY - characterGroup.rotation.y) * 0.04;
      characterGroup.rotation.x += (targetRotationX - characterGroup.rotation.x) * 0.04;
      characterGroup.position.y = basePositionY + Math.sin(elapsed * 0.48) * (isAktabanMap ? 0.012 : 0.025);
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
  }, [characterName, isAktabanMap, modelUrl]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        maskImage: isAktabanMap ? 'none' : 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
        WebkitMaskImage: isAktabanMap ? 'none' : 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
      }}
      aria-label={`${characterName}ның интерактивті 3D моделі`}
    />
  );
}