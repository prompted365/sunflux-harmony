import * as THREE from "three";

export const createRays = () => {
  const raysRef = new THREE.Group();
  
  const rayGeometry = new THREE.BoxGeometry(0.1, 3, 0.1);
  const rayMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.3,
  });

  for (let i = 0; i < 8; i++) {
    const ray = new THREE.Mesh(rayGeometry, rayMaterial);
    ray.position.y = 1.5;
    ray.rotation.z = (i * Math.PI) / 4;
    raysRef.add(ray);
  }

  const animate = () => {
    raysRef.rotation.z += 0.002;
  };

  return { raysRef, animate };
};