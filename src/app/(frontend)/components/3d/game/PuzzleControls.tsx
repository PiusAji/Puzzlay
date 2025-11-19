import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { MOUSE } from 'three'
import { useMemo } from 'react'

interface PuzzleControlsProps {
  enabled: boolean
  bounds: THREE.Box3
}

export function PuzzleControls({ enabled, bounds }: PuzzleControlsProps) {
  const center = new THREE.Vector3()
  bounds.getCenter(center)

  const isMobile = useMemo(() => {
    // Check for touch capability AND screen size
    if (typeof window === 'undefined') return false

    const hasTouchScreen =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0

    const isSmallScreen = window.innerWidth < 768

    return hasTouchScreen && isSmallScreen
  }, [])

  const mouseButtonsConfig = useMemo(() => {
    if (isMobile) {
      // On mobile: disable LEFT mouse button (which represents single touch)
      // This prevents OrbitControls from interfering with piece dragging
      return {
        LEFT: undefined, // Disable left button on mobile
        MIDDLE: MOUSE.ROTATE,
        RIGHT: MOUSE.PAN,
      }
    }
    return {
      MIDDLE: MOUSE.ROTATE, // Default desktop behavior
      RIGHT: MOUSE.PAN,
    }
  }, [isMobile])

  // On mobile, we want more restrictive camera controls
  const rotateSpeed = isMobile ? 0.3 : 1.0
  const enableRotate = isMobile ? false : true // Disable rotation on mobile entirely

  return (
    <OrbitControls
      enabled={enabled}
      enableZoom={true}
      enablePan={!isMobile} // Disable pan on mobile to prevent interference
      enableRotate={enableRotate}
      rotateSpeed={rotateSpeed}
      zoomSpeed={1.5}
      panSpeed={1.0}
      minDistance={5}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2 - 0.1} // Prevent camera from going below ground
      target={[center.x, center.y, center.z]} // Set target to puzzle center
      mouseButtons={mouseButtonsConfig}
      touches={{
        ONE: undefined, // Disable single touch rotation
        TWO: THREE.TOUCH.DOLLY_PAN, // Two fingers for zoom/pan
      }}
    />
  )
}
