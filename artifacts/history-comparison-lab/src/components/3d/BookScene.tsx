import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const BOOK_MODEL_URL = '/assets/models/medieval-open-book.glb?v=1';

interface BookSceneProps {
  onReady: () => void;
  onError: () => void;
}

export default function BookScene({ onReady, onError }: BookSceneProps) {
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
    let books: THREE.Group | undefined;
    const pointer = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);
    camera.position.set(0, 0.15, 4.6);

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

    scene.add(new THREE.HemisphereLight(0xfffbf2, 0x4c4138, 1.5));

    const keyLight = new THREE.DirectionalLight(0xfff7e8, 2.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffffff, 1.8, 10);
    fillLight.position.set(-4, 1, 4);
    scene.add(fillLight);

    const warmLight = new THREE.PointLight(0xffc98d, 1.5, 8);
    warmLight.position.set(3, -2, 2);
    scene.add(warmLight);

    const bookGroup = new THREE.Group();
    bookGroup.position.set(0, 0.05, 0);
    scene.add(bookGroup);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      BOOK_MODEL_URL,
      (gltf) => {
        if (disposed) return;
        books = gltf.scene;

        const bounds = new THREE.Box3().setFromObject(books);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        books.position.sub(center);

        const modelRoot = new THREE.Group();
        const scale = 1.55 / Math.max(size.x, size.y, size.z);
        modelRoot.scale.setScalar(scale);
        books.rotation.y = 0;

        books.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        modelRoot.add(books);
        bookGroup.add(modelRoot);
        readyRef.current();
      },
      undefined,
      (error) => {
        console.error('Medieval open book model failed to load:', error);
        errorRef.current();
      },
    );

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
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
    resize();

    const startedAt = performance.now();
    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const elapsed = (performance.now() - startedAt) / 1000;

      bookGroup.rotation.y += ((pointer.x * 0.22) - bookGroup.rotation.y) * 0.035;
      bookGroup.rotation.x += ((-pointer.y * 0.08) - bookGroup.rotation.x) * 0.035;
      bookGroup.position.y = 0.05 + Math.sin(elapsed * 0.55) * 0.035;
      renderer?.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);

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

  return <div ref={containerRef} className="absolute inset-0" aria-label="Интерактивті оқулық кітаптары" />;
}