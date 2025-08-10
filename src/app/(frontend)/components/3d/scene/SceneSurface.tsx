import { SCENE_CONFIG } from "../config/sceneConfig";

export function SceneSurface() {
  const { surface } = SCENE_CONFIG;

  if (surface.type === "none") {
    return null;
  }

  if (surface.type === "simple-table") {
    return (
      <group>
        {/* Simple table surface */}
        <mesh position={[0, surface.tableHeight, 0]} receiveShadow={surface.showShadows}>
          <boxGeometry args={[6, 0.2, 4]} />
          <meshStandardMaterial 
            color={surface.tableColor}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Table legs */}
        {[
          [-2.5, surface.tableHeight - 0.5, -1.5],
          [2.5, surface.tableHeight - 0.5, -1.5],
          [-2.5, surface.tableHeight - 0.5, 1.5],
          [2.5, surface.tableHeight - 0.5, 1.5],
        ].map((position, index) => (
          <mesh key={index} position={position as [number, number, number]}>
            <cylinderGeometry args={[0.05, 0.05, 1]} />
            <meshStandardMaterial 
              color={surface.tableColor}
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
        ))}
      </group>
    );
  }

  if (surface.type === "floating") {
    return (
      <mesh position={[0, surface.tableHeight, 0]} receiveShadow={surface.showShadows}>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial 
          color="#ffffff"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
    );
  }

  if (surface.type === "pedestal") {
    return (
      <group>
        {/* Pedestal base */}
        <mesh position={[0, surface.tableHeight - 0.3, 0]}>
          <cylinderGeometry args={[0.8, 1.2, 0.6, 16]} />
          <meshStandardMaterial 
            color="#444444"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        
        {/* Pedestal top */}
        <mesh position={[0, surface.tableHeight, 0]} receiveShadow={surface.showShadows}>
          <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
          <meshStandardMaterial 
            color="#666666"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>
    );
  }

  return null;
}
