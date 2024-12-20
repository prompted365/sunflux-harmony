import * as THREE from 'three';

export const createSunMaterial = () => {
  return new THREE.MeshBasicMaterial({
    color: 0xFEC6A1,
    transparent: true,
    opacity: 0.9,
  });
};

export const createGlowMaterial = () => {
  return new THREE.MeshBasicMaterial({
    color: 0xFEF7CD,
    transparent: true,
    opacity: 0.3,
  });
};

export const createRayMaterial = () => {
  return new THREE.MeshBasicMaterial({
    color: 0xD6BCFA,
    transparent: true,
    opacity: 0.4 + Math.random() * 0.3,
  });
};

export const createCloudMaterial = () => {
  return new THREE.MeshBasicMaterial({
    color: 0xFDE1D3,
    transparent: true,
    opacity: 0.2 + Math.random() * 0.3,
  });
};

export const setupScene = () => {
  const scene = new THREE.Scene();
  return scene;
};

export const setupCamera = (width: number, height: number) => {
  const camera = new THREE.PerspectiveCamera(85, width / height, 0.1, 1000);
  camera.position.z = 4;
  camera.position.y = 0.5;
  return camera;
};

export const setupRenderer = (width: number, height: number) => {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  return renderer;
};