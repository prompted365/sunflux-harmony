import * as THREE from 'three';
import { createRayMaterial } from './utils';

export class Rays {
  group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.createRays();
  }

  private createRays() {
    for (let i = 0; i < 16; i++) {
      const rayLength = 2 + Math.random() * 2;
      const rayGeometry = new THREE.BoxGeometry(0.05, rayLength, 0.05);
      const rayMaterial = createRayMaterial();
      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      ray.position.y = rayLength / 2;
      ray.rotation.z = (i / 16) * Math.PI * 2;
      this.group.add(ray);
    }
  }

  update() {
    this.group.rotation.z += 0.001;
    this.group.children.forEach((ray, i) => {
      ray.rotation.y = Math.sin(Date.now() * 0.001 + i) * 0.1;
    });
  }
}