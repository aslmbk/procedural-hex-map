import * as THREE from "three";
import { useMemo } from "react";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
import { random } from "./utils";

export const Clouds: React.FC = () => {
  const cloudsGeometry = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 16; i++) {
      const puff1 = new THREE.IcosahedronGeometry(1.2, 1);
      const puff2 = new THREE.IcosahedronGeometry(1.5, 1);
      const puff3 = new THREE.IcosahedronGeometry(0.9, 1);

      puff1.translate(-1.85, random() * 0.3, 0);
      puff2.translate(0, random() * 0.3, 0);
      puff3.translate(1.85, random() * 0.3, 0);

      const cloudGeo = BufferGeometryUtils.mergeGeometries([
        puff1,
        puff2,
        puff3,
      ]);
      const scale = random() * 0.5 + 0.5;
      cloudGeo.scale(scale, scale, scale);
      cloudGeo.translate(
        (random() - 0.5) * 50,
        random() * 7 + 12,
        (random() - 0.5) * 50
      );
      cloudGeo.rotateY(random() * Math.PI * 2);
      geometries.push(cloudGeo);
    }
    return BufferGeometryUtils.mergeGeometries(geometries);
  }, []);

  return (
    <mesh geometry={cloudsGeometry}>
      <meshStandardMaterial flatShading color="white" />
    </mesh>
  );
};
