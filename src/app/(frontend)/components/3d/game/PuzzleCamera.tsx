import { OrthographicCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

interface PuzzleCameraProps {
  bounds: THREE.Box3
}

export function PuzzleCamera({ bounds }: PuzzleCameraProps) {
  const { camera, size } = useThree()

  useEffect(() => {
    if (!bounds.isEmpty()) {
      const center = new THREE.Vector3()
      bounds.getCenter(center)

      const sizeVec = new THREE.Vector3()
      bounds.getSize(sizeVec)

      const aspect = size.width / size.height

      // Calculate camera frustum based on bounds
      const frustumSize = Math.max(sizeVec.x, sizeVec.z * aspect) * 1.2 // Add some padding
      const halfFrustumSize = frustumSize / 2

      const left = -halfFrustumSize * aspect
      const right = halfFrustumSize * aspect
      const top = halfFrustumSize
      const bottom = -halfFrustumSize

      // Position the camera directly above the center of the bounds
      camera.position.set(center.x, center.y + sizeVec.y + frustumSize, center.z)
      camera.lookAt(center)

      if (camera instanceof THREE.OrthographicCamera) {
        camera.left = left
        camera.right = right
        camera.top = top
        camera.bottom = bottom
        camera.near = 0.1
        camera.far = frustumSize * 2 // Adjust far plane based on frustum size
        camera.updateProjectionMatrix()
      }
    }
  }, [bounds, camera, size])

  return (
    <OrthographicCamera
      makeDefault
      position={[0, 100, 0]} // Initial high position, will be adjusted by useEffect
      zoom={1}
      near={0.1}
      far={1000}
    />
  )
}
