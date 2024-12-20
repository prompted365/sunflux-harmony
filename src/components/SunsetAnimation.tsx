import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SunsetAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sunRef = useRef<THREE.Mesh | null>(null);
  const raysRef = useRef<THREE.Group | null>(null);
  const cloudsRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup with wider field of view for sunset effect
    const camera = new THREE.PerspectiveCamera(
      85,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;
    camera.position.y = 0.5; // Slightly elevated view
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Sunset colored sun
    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xFEC6A1, // Soft orange for sunset
      transparent: true,
      opacity: 0.9,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    sunRef.current = sun;

    // Create atmospheric glow
    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFEF7CD, // Soft yellow
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(glow);

    // Enhanced sun rays with varying sizes
    const rays = new THREE.Group();
    for (let i = 0; i < 16; i++) {
      const rayLength = 2 + Math.random() * 2; // Varying lengths
      const rayGeometry = new THREE.BoxGeometry(0.05, rayLength, 0.05);
      const rayMaterial = new THREE.MeshBasicMaterial({
        color: 0xD6BCFA, // Light purple for sunset rays
        transparent: true,
        opacity: 0.4 + Math.random() * 0.3, // Varying opacity
      });
      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      ray.position.y = rayLength / 2;
      ray.rotation.z = (i / 16) * Math.PI * 2;
      rays.add(ray);
    }
    scene.add(rays);
    raysRef.current = rays;

    // Add floating clouds
    const clouds = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const cloudGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 8, 8);
      const cloudMaterial = new THREE.MeshBasicMaterial({
        color: 0xFDE1D3, // Soft peach for clouds
        transparent: true,
        opacity: 0.2 + Math.random() * 0.3,
      });
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );
      clouds.add(cloud);
    }
    scene.add(clouds);
    cloudsRef.current = clouds;

    // Mouse interaction setup
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (sunRef.current) {
        // Smooth rotation following mouse
        targetRotationX += (mouseY * 0.05 - targetRotationX) * 0.02;
        targetRotationY += (mouseX * 0.05 - targetRotationY) * 0.02;
        
        sunRef.current.rotation.x = targetRotationX;
        sunRef.current.rotation.y = targetRotationY;
        
        // Pulsating effect
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        sunRef.current.scale.set(scale, scale, scale);
      }

      if (raysRef.current) {
        // Rotating rays with varying speeds
        raysRef.current.rotation.z += 0.001;
        raysRef.current.children.forEach((ray, i) => {
          ray.rotation.y = Math.sin(Date.now() * 0.001 + i) * 0.1;
        });
      }

      if (cloudsRef.current) {
        // Gentle cloud movement
        cloudsRef.current.children.forEach((cloud, i) => {
          cloud.position.x += Math.sin(Date.now() * 0.0005 + i) * 0.002;
          cloud.position.y += Math.cos(Date.now() * 0.0005 + i) * 0.002;
        });
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
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(renderer.domElement);
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