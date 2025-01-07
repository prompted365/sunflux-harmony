import * as THREE from "three";

export const createSun = () => {
  const sunRef = new THREE.Object3D();
  
  const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.5,
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sunRef.add(sun);

  const animate = () => {
    sunRef.scale.x = 1 + Math.sin(Date.now() * 0.001) * 0.1;
    sunRef.scale.y = 1 + Math.sin(Date.now() * 0.001) * 0.1;
  };

  return { sunRef, animate };
};