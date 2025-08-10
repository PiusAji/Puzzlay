import { PerspectiveCamera } from '@react-three/drei'

export function PuzzleCamera() {
  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 6, 12]} // Angled view from the front
      fov={50}
      near={0.1}
      far={1000}
    />
  )
}
