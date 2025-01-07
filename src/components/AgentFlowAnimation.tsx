import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Sun } from './solar/three/Sun';
import { setupScene, setupCamera, setupRenderer } from './solar/three/utils';

const AgentFlowAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sunRef = useRef<Sun | null>(null);
  const dataPointsRef = useRef<THREE.Group | null>(null);
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
    
    // Create central sun (representing the AI core)
    const sun = new Sun();
    sun.mesh.scale.set(0.7, 0.7, 0.7);
    scene.add(sun.mesh);

    // Create data flow points
    const dataPoints = new THREE.Group();
    const dataGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const dataMaterial = new THREE.MeshPhongMaterial({
      color: 0xFEC6A1,
      transparent: true,
      opacity: 0.8,
    });

    // Create orbital paths
    const pathGeometry = new THREE.TorusGeometry(2, 0.02, 16, 50);
    const pathMaterial = new THREE.MeshPhongMaterial({
      color: 0xC84B31,
      transparent: true,
      opacity: 0.3,
    });

    // Create three orbital paths at different angles
    const paths: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const path = new THREE.Mesh(pathGeometry, pathMaterial);
      path.rotation.x = Math.PI / 3 * i;
      path.rotation.y = Math.PI / 4 * i;
      scene.add(path);
      paths.push(path);
    }

    // Add data points along the paths
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const point = new THREE.Mesh(dataGeometry, dataMaterial);
        const angle = (j / 4) * Math.PI * 2;
        point.position.x = Math.cos(angle) * 2;
        point.position.z = Math.sin(angle) * 2;
        point.userData = {
          orbit: i,
          angle: angle,
          speed: 0.001 + (i * 0.0005),
        };
        dataPoints.add(point);
      }
    }
    scene.add(dataPoints);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 5;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);
    
    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    sunRef.current = sun;
    dataPointsRef.current = dataPoints;

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
      
      if (dataPointsRef.current) {
        dataPointsRef.current.children.forEach((point) => {
          const { orbit, angle, speed } = point.userData;
          const newAngle = angle + speed;
          point.position.x = Math.cos(newAngle) * 2;
          point.position.z = Math.sin(newAngle) * 2;
          point.userData.angle = newAngle;
          
          // Rotate based on orbit
          point.position.applyAxisAngle(
            new THREE.Vector3(1, 0, 0),
            Math.PI / 3 * orbit
          );
          point.position.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI / 4 * orbit
          );
        });
      }

      paths.forEach((path, i) => {
        path.rotation.y += 0.001 * (i + 1);
      });

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
    <div className="relative w-full">
      <div ref={containerRef} className="w-full h-64 mb-8" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#C84B31]/60 via-[#FEC6A1]/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default AgentFlowAnimation;