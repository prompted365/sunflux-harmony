import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createSun } from "./sun-animation/Sun";
import { createRays } from "./sun-animation/Rays";
import { createLogo } from "./sun-animation/Logo";

const SunAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create components
    const { sunRef, animate: animateSun } = createSun();
    const { raysRef, animate: animateRays } = createRays();
    const { logoRef, animate: animateLogo } = createLogo();

    // Add components to scene
    scene.add(sunRef);
    scene.add(raysRef);
    scene.add(logoRef);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      animateSun();
      animateRays();
      animateLogo();

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-64" />;
};

export default SunAnimation;