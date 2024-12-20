import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { setupScene, setupCamera, setupRenderer } from './solar/three/utils';
import { Sun } from './solar/three/Sun';
import { Rays } from './solar/three/Rays';
import { Clouds } from './solar/three/Clouds';

const SunsetAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sunRef = useRef<Sun | null>(null);
  const raysRef = useRef<Rays | null>(null);
  const cloudsRef = useRef<Clouds | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = setupScene();
    const camera = setupCamera(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    const renderer = setupRenderer(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    
    containerRef.current.appendChild(renderer.domElement);
    
    // Create objects
    const sun = new Sun();
    const rays = new Rays();
    const clouds = new Clouds();
    
    scene.add(sun.mesh);
    scene.add(rays.group);
    scene.add(clouds.group);
    
    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    sunRef.current = sun;
    raysRef.current = rays;
    cloudsRef.current = clouds;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      requestAnimationFrame(animate);
      
      if (sunRef.current) {
        sunRef.current.update(mouseRef.current.x, mouseRef.current.y);
      }
      
      if (raysRef.current) {
        raysRef.current.update();
      }
      
      if (cloudsRef.current) {
        cloudsRef.current.update();
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
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
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-64 mb-8 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#C84B31]/60 via-[#FEC6A1]/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default SunsetAnimation;