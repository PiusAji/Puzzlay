import { Text3D, Center } from "@react-three/drei";
import { SCENE_CONFIG } from "../config/sceneConfig";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Scene3DText() {
  const { ui } = SCENE_CONFIG;
  const titleRef = useRef<THREE.Mesh>(null);
  const subtitleRef = useRef<THREE.Mesh>(null);

  // Gentle floating animation for text
  useFrame((state) => {
    if (titleRef.current) {
      titleRef.current.position.y = ui.text3D.position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (subtitleRef.current) {
      subtitleRef.current.position.y = ui.text3D.position[1] - 0.8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  if (!ui.use3DText) return null;

  return (
    <group>
      {/* Main Title */}
      <Center position={ui.text3D.position}>
        <Text3D
          ref={titleRef}
          font="/fonts/helvetiker_bold.typeface.json" // You'll need to add this font
          size={0.5}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {ui.text3D.title}
          <meshStandardMaterial 
            color={ui.text3D.color}
            metalness={0.1}
            roughness={0.2}
          />
        </Text3D>
      </Center>

      {/* Subtitle */}
      <Center position={[ui.text3D.position[0], ui.text3D.position[1] - 0.8, ui.text3D.position[2]]}>
        <Text3D
          ref={subtitleRef}
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.15}
          height={0.05}
          curveSegments={12}
        >
          {ui.text3D.subtitle}
          <meshStandardMaterial 
            color="#cccccc"
            metalness={0.0}
            roughness={0.4}
          />
        </Text3D>
      </Center>
    </group>
  );
}
