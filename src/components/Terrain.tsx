import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
import { createNoise2D } from "simplex-noise";
import { random, toleToPosition, createStone, createTree } from "./utils";

const ROW_COUNT = 15;
const MAX_DISTANCE = 20;
const MAX_HEIGHT = 10;
const SNOW_HEIGHT = MAX_HEIGHT * 0.9;
const STONE_HEIGHT = MAX_HEIGHT * 0.8;
const DIRT_HEIGHT = MAX_HEIGHT * 0.5;
const GRASS_HEIGHT = MAX_HEIGHT * 0.3;
const SAND_HEIGHT = MAX_HEIGHT * 0.2;
const DIRT2_HEIGHT = MAX_HEIGHT * 0;

export const Terrain: React.FC = () => {
  const [grassTexture, sandTexture, stoneTexture] = useTexture(
    ["./textures/grass.jpg", "./textures/sand.jpg", "./textures/stone.png"],
    (textures) => {
      textures.forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
      });
    }
  );

  const waterTexture = useTexture("./textures/water.jpg", (texture) => {
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    // texture.repeat.set(2, 2);
  });

  const [dirtTexture, dirt2Texture] = useTexture(
    ["./textures/dirt.png", "./textures/dirt2.jpg"],
    (textures) => {
      textures.forEach((texture) => {
        texture.colorSpace = THREE.LinearSRGBColorSpace;
      });
    }
  );

  const {
    snowGeometry,
    stoneGeometry,
    dirtGeometry,
    grassGeometry,
    sandGeometry,
    dirt2Geometry,
  } = useMemo(() => {
    const snowGeometries: THREE.BufferGeometry[] = [];
    const stoneGeometries: THREE.BufferGeometry[] = [];
    const dirtGeometries: THREE.BufferGeometry[] = [];
    const grassGeometries: THREE.BufferGeometry[] = [];
    const sandGeometries: THREE.BufferGeometry[] = [];
    const dirt2Geometries: THREE.BufferGeometry[] = [];
    const simplex = createNoise2D(random);
    for (let x = -ROW_COUNT; x < ROW_COUNT; x++) {
      for (let z = -ROW_COUNT; z < ROW_COUNT; z++) {
        const position = toleToPosition(x, z);
        if (position.length() > MAX_DISTANCE) {
          continue;
        }
        let noise = simplex(x * 0.1, z * 0.1);
        noise += 1;
        noise *= 0.5;
        noise = Math.pow(noise, 2);
        const height = noise * MAX_HEIGHT;
        const g = new THREE.CylinderGeometry(1, 1, height, 6);
        g.translate(position.x, height / 2, position.y);
        if (height > SNOW_HEIGHT) {
          snowGeometries.push(g);
        } else if (height > STONE_HEIGHT) {
          stoneGeometries.push(g);
          if (random() > 0.5) {
            stoneGeometries.push(createStone(position.x, height, position.y));
          }
        } else if (height > DIRT_HEIGHT) {
          dirtGeometries.push(g);
          if (random() > 0.5) {
            grassGeometries.push(createTree(position.x, height, position.y));
          }
        } else if (height > GRASS_HEIGHT) {
          grassGeometries.push(g);
        } else if (height > SAND_HEIGHT) {
          sandGeometries.push(g);
          if (random() > 0.8) {
            stoneGeometries.push(createStone(position.x, height, position.y));
          }
        } else if (height > DIRT2_HEIGHT) {
          dirt2Geometries.push(g);
        }
      }
    }
    const snowGeometry = BufferGeometryUtils.mergeGeometries(snowGeometries);
    const stoneGeometry = BufferGeometryUtils.mergeGeometries(stoneGeometries);
    const dirtGeometry = BufferGeometryUtils.mergeGeometries(dirtGeometries);
    const grassGeometry = BufferGeometryUtils.mergeGeometries(grassGeometries);
    const sandGeometry = BufferGeometryUtils.mergeGeometries(sandGeometries);
    const dirt2Geometry = BufferGeometryUtils.mergeGeometries(dirt2Geometries);
    return {
      snowGeometry,
      stoneGeometry,
      dirtGeometry,
      grassGeometry,
      sandGeometry,
      dirt2Geometry,
    };
  }, []);

  return (
    <>
      <mesh geometry={snowGeometry} receiveShadow castShadow>
        <meshPhysicalMaterial color="#ffffff" />
      </mesh>
      <mesh geometry={stoneGeometry} receiveShadow castShadow>
        <meshPhysicalMaterial map={stoneTexture} flatShading />
      </mesh>
      <mesh geometry={dirtGeometry} receiveShadow castShadow>
        <meshPhysicalMaterial map={dirtTexture} />
      </mesh>
      <mesh geometry={grassGeometry} receiveShadow castShadow>
        <meshPhysicalMaterial map={grassTexture} />
      </mesh>
      <mesh geometry={sandGeometry} receiveShadow castShadow>
        <meshPhysicalMaterial map={sandTexture} />
      </mesh>
      <mesh geometry={dirt2Geometry} receiveShadow castShadow>
        <meshPhysicalMaterial map={dirt2Texture} />
      </mesh>
      <mesh receiveShadow>
        <cylinderGeometry
          args={[MAX_DISTANCE + 1, MAX_DISTANCE + 1, MAX_HEIGHT * 0.2, 50]}
        />
        <meshPhysicalMaterial
          color={new THREE.Color("#55aaff")
            .convertSRGBToLinear()
            .multiplyScalar(3)}
          ior={1.4}
          transparent
          transmission={1}
          roughness={1}
          thickness={1.5}
          metalness={0.025}
          roughnessMap={waterTexture}
          metalnessMap={waterTexture}
        />
      </mesh>
    </>
  );
};
