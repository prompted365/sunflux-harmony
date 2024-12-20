import * as THREE from 'three';
import { createSunMaterial, createGlowMaterial } from './utils';

export class Sun {
  mesh: THREE.Mesh;
  glow: THREE.Mesh;

  constructor() {
    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = createSunMaterial();
    this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);

    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = createGlowMaterial();
    this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
    
    this.mesh.add(this.glow);
  }

  update(mouseX: number, mouseY: number) {
    const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
    this.mesh.scale.set(scale, scale, scale);
    
    const targetRotationX = mouseY * 0.05;
    const targetRotationY = mouseX * 0.05;
    
    this.mesh.rotation.x += (targetRotationX - this.mesh.rotation.x) * 0.02;
    this.mesh.rotation.y += (targetRotationY - this.mesh.rotation.y) * 0.02;
  }
}