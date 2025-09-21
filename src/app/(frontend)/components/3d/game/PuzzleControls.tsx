import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { MOUSE } from 'three'

interface PuzzleControlsProps {
  enabled: boolean
  bounds: THREE.Box3
}

export function PuzzleControls({ enabled, bounds }: PuzzleControlsProps) {
  const center = new THREE.Vector3()
  bounds.getCenter(center)
  return (
    <OrbitControls
      enabled={enabled}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      zoomSpeed={1.5}
      panSpeed={1.0}
      minDistance={5}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2 - 0.1} // Prevent camera from going below ground
      target={[center.x, center.y, center.z]} // Set target to puzzle center
      mouseButtons={{
        MIDDLE: MOUSE.ROTATE, // Middle-click for rotation
        RIGHT: MOUSE.PAN, // Right-click for pan (default)
      }}
    />
  )
}
