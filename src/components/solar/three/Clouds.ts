import * as THREE from 'three';
import { createCloudMaterial } from './utils';

export class Clouds {
  group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.createClouds();
  }

  private createClouds() {
    for (let i = 0; i < 8; i++) {
      const cloudGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 8, 8);
      const cloudMaterial = createCloudMaterial();
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );
      this.group.add(cloud);
    }
  }

  update() {
    this.group.children.forEach((cloud, i) => {
      cloud.position.x += Math.sin(Date.now() * 0.0005 + i) * 0.002;
      cloud.position.y += Math.cos(Date.now() * 0.0005 + i) * 0.002;
    });
  }
}