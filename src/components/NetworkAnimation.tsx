import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NetworkAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create central sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFAA5A,
      transparent: true,
      opacity: 0.4
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Create nodes (representing features)
    const nodes: THREE.Mesh[] = [];
    const nodeConnections: THREE.Line[] = [];
    const nodeCount = 6;
    const radius = 15;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0xC84B31,
        transparent: true,
        opacity: 0.6
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      
      node.position.x = Math.cos(angle) * radius;
      node.position.z = Math.sin(angle) * radius;
      node.position.y = (Math.random() - 0.5) * 10;
      
      nodes.push(node);
      scene.add(node);

      // Create connections between nodes
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        node.position,
        sun.position
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xFFAA5A,
        transparent: true,
        opacity: 0.2
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      nodeConnections.push(line);
      scene.add(line);
    }

    // Position camera
    camera.position.z = 30;

    // Animation
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate sun
      sun.rotation.y += 0.005;
      
      // Animate nodes
      nodes.forEach((node, i) => {
        const time = frame * 0.02 + i;
        node.position.y = Math.sin(time * 0.5) * 5;
        
        // Update connection lines
        const lineGeometry = nodeConnections[i].geometry;
        const positions = new Float32Array([
          node.position.x, node.position.y, node.position.z,
          sun.position.x, sun.position.y, sun.position.z
        ]);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        lineGeometry.attributes.position.needsUpdate = true;
      });

      frame++;
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default NetworkAnimation;