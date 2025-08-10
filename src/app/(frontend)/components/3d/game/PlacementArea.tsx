import { Edges, Plane } from '@react-three/drei'
import * as THREE from 'three'

interface PlacementAreaProps {
  puzzleBounds: THREE.Box3
}

export function PlacementArea({ puzzleBounds }: PlacementAreaProps) {
  const size = puzzleBounds.getSize(new THREE.Vector3())
  const center = puzzleBounds.getCenter(new THREE.Vector3())

  return (
    <group>
      {/* This plane is the invisible surface we drag on */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} visible={false} />

      {/* This is the visual guide for the puzzle */}
      {/* The visual guide for where the puzzle should be assembled */}
      <mesh position={center.clone().setY(-0.01)}>
        <boxGeometry args={[size.x, 0.01, size.z]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.15} />
        <Edges>
          <lineBasicMaterial color="white" transparent opacity={0.3} />
        </Edges>
      </mesh>
    </group>
  )
}
