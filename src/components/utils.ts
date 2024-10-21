import * as THREE from "three";
import seedRandom from "seedrandom";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

export const random = seedRandom("my-proj");

export const toleToPosition = (x: number, z: number) => {
  return new THREE.Vector2((x + (z % 2) * 0.5) * 1.77, z * 1.535);
};

export const createStone = (x: number, y: number, z: number) => {
  const stoneRadius = random() * 0.3 + 0.1;
  const stone = new THREE.SphereGeometry(
    stoneRadius,
    Math.floor(Math.max(random() * 10, 5)),
    Math.floor(Math.max(random() * 10, 5))
  );
  stone.translate(
    x + random() * 0.4,
    y + stoneRadius * random() * 0.5,
    z + random() * 0.4
  );
  return stone;
};

export const createTree = (x: number, y: number, z: number) => {
  const treeHeight = Math.max(random(), 0.5) + 0.2;
  const part1 = new THREE.CylinderGeometry(0, 0.8 * treeHeight, treeHeight, 3);
  part1.translate(x, y + treeHeight * 0 + treeHeight * 0.6, z);
  const part2 = new THREE.CylinderGeometry(0, 0.6 * treeHeight, treeHeight, 3);
  part2.translate(x, y + treeHeight * 0.6 + treeHeight * 0.6, z);
  const part3 = new THREE.CylinderGeometry(0, 0.4 * treeHeight, treeHeight, 3);
  part3.translate(x, y + treeHeight * 1.25 + treeHeight * 0.6, z);
  return BufferGeometryUtils.mergeGeometries([part1, part2, part3]);
};
