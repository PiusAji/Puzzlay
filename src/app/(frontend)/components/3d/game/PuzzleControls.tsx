import { OrbitControls } from '@react-three/drei'

interface PuzzleControlsProps {
  enabled: boolean
}

export function PuzzleControls({ enabled }: PuzzleControlsProps) {
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
    />
  )
}
