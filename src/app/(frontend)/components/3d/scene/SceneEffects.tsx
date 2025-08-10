import { useRef, ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SCENE_CONFIG } from '../config/sceneConfig'

interface FloatingPuzzleProps {
  children: ReactNode
}

export function FloatingPuzzle({ children }: FloatingPuzzleProps) {
  const ref = useRef<THREE.Group>(null)
  const { floating } = SCENE_CONFIG

  useFrame((state) => {
    if (ref.current) {
      // Gentle floating motion
      ref.current.position.y =
        Math.sin(state.clock.elapsedTime * floating.ySpeed) * floating.yAmplitude
      // Subtle rotation
      ref.current.rotation.y =
        Math.sin(state.clock.elapsedTime * floating.rotationSpeed) * floating.rotationAmplitude
    }
  })

  return <group ref={ref}>{children}</group>
}
