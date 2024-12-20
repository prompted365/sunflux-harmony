import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SunAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sunRef = useRef<THREE.Mesh | null>(null);
  const raysRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Sun geometry
    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xC84B31,
      transparent: true,
      opacity: 0.9,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    sunRef.current = sun;

    // Sun rays
    const rays = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const rayGeometry = new THREE.BoxGeometry(0.1, 3, 0.1);
      const rayMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFAA5A,
        transparent: true,
        opacity: 0.6,
      });
      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      ray.position.y = 1.5;
      ray.rotation.z = (i / 12) * Math.PI * 2;
      rays.add(ray);
    }
    scene.add(rays);
    raysRef.current = rays;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (sunRef.current) {
        sunRef.current.rotation.y += 0.005;
        sunRef.current.scale.x = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        sunRef.current.scale.y = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        sunRef.current.scale.z = 1 + Math.sin(Date.now() * 0.001) * 0.05;
      }

      if (raysRef.current) {
        raysRef.current.rotation.z += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-64 mb-8" />;
};

export default SunAnimation;