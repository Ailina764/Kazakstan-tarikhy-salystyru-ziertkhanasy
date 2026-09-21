import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const ROBOT_HEAD_URL = '/assets/models/robot-waving.glb';

interface RobotSceneProps {
  placement: 'landing' | 'panel';
  onReady: () => void;
  onError: () => void;
}

export default function RobotScene({ placement, onReady, onError }: RobotSceneProps) {
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
    let robot: THREE.Group | undefined;
    const pointer = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 100);
    camera.position.set(0, 0.1, 4.2);

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
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xdff7ff, 0x35261e, 2.1));

    const keyLight = new THREE.DirectionalLight(0xe4f8ff, 4.4);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x4a9db8, 7, 10);
    rimLight.position.set(-3, 1, 3);
    scene.add(rimLight);

    const warmLight = new THREE.PointLight(0xcfa052, 4, 9);
    warmLight.position.set(3, -2, 2);
    scene.add(warmLight);

    const robotGroup = new THREE.Group();
    robotGroup.position.set(
      placement === 'landing' ? 0.68 : 0,
      placement === 'landing' ? 0.78 : 0,
      0,
    );
    scene.add(robotGroup);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      ROBOT_HEAD_URL,
      (gltf) => {
        if (disposed) return;
        robot = gltf.scene;

        const bounds = new THREE.Box3().setFromObject(robot);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        robot.position.sub(center);

        const targetSize = placement === 'landing' ? 1.8 : 2.85;
        const scale = targetSize / Math.max(size.x, size.y, size.z);
        robot.scale.setScalar(scale);
        robot.rotation.y = placement === 'landing' ? -0.08 : 0.04;

        robot.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        robotGroup.add(robot);
        readyRef.current();
      },
      undefined,
      () => errorRef.current(),
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

      robotGroup.rotation.y += ((pointer.x * 0.28) - robotGroup.rotation.y) * 0.035;
      robotGroup.rotation.x += ((-pointer.y * 0.1) - robotGroup.rotation.x) * 0.035;
      robotGroup.position.y = Math.sin(elapsed * 0.65) * 0.06;
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
  }, [placement]);

  return <div ref={containerRef} className="absolute inset-0" aria-label="Интерактивті ЖИ роботы" />;
}