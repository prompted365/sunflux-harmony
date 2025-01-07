import * as THREE from "three";

export const createLogo = () => {
  const logoRef = new THREE.Object3D();
  
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('/lovable-uploads/c68a4f1c-772a-463b-8bd1-46be8cd8588e.png', (texture) => {
    const logoGeometry = new THREE.PlaneGeometry(2, 2);
    const logoMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.z = -1;
    logoRef.add(logo);
  });

  const animate = () => {
    logoRef.scale.x = 1 + Math.sin(Date.now() * 0.0005) * 0.05;
    logoRef.scale.y = 1 + Math.sin(Date.now() * 0.0005) * 0.05;
  };

  return { logoRef, animate };
};