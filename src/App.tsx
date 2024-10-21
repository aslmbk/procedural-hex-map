import { Canvas } from "@react-three/fiber";
import { BakeShadows, OrbitControls } from "@react-three/drei";
import { Terrain } from "./components/Terrain";
import { Clouds } from "./components/Clouds";
import * as THREE from "three";

export const App: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [-30, 30, 30] }}
      gl={{
        antialias: true,
      }}
      flat
      shadows
    >
      <BakeShadows />
      <color attach="background" args={["#fff9cf"]} />
      <fogExp2 attach="fog" args={["#fff9cf", 0.01]} />
      <OrbitControls />
      <ambientLight intensity={0.3} />
      <directionalLight
        color={new THREE.Color("#ffddb7").convertSRGBToLinear()}
        position={[10, 10, 10]}
        intensity={5}
        castShadow
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* <pointLight
        position={[-10, 20, 10]}
        intensity={200}
        distance={200}
        color={new THREE.Color("#ffcb8e")
          .convertSRGBToLinear()
          .convertSRGBToLinear()}
        castShadow
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      /> */}
      <Terrain />
      <Clouds />
    </Canvas>
  );
};
