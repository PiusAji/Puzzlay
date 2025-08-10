import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Animated gradient background
export function AnimatedBackground() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Slowly rotate the background for subtle movement
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#f8f9fa" />
    </mesh>
  );
}

// Floating geometric shapes in background
export function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle rotation of the whole group
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Create several floating shapes */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i) * 2;

        return (
          <FloatingShape
            key={i}
            position={[x, y, z]}
            delay={i * 0.5}
            shapeType={i % 3}
          />
        );
      })}
    </group>
  );
}

// Individual floating shape component
function FloatingShape({
  position,
  delay,
  shapeType,
}: {
  position: [number, number, number];
  delay: number;
  shapeType: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime + delay;

    // Floating motion
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.5;

    // Rotation
    meshRef.current.rotation.x = time * 0.3;
    meshRef.current.rotation.y = time * 0.2;
    meshRef.current.rotation.z = time * 0.1;
  });

  // Different shapes based on type
  const getGeometry = () => {
    switch (shapeType) {
      case 0:
        return <boxGeometry args={[0.3, 0.3, 0.3]} />;
      case 1:
        return <sphereGeometry args={[0.2, 8, 8]} />;
      case 2:
        return <octahedronGeometry args={[0.25]} />;
      default:
        return <boxGeometry args={[0.3, 0.3, 0.3]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {getGeometry()}
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}
