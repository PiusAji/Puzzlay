import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SCENE_CONFIG } from '../config/sceneConfig'

// Animated lights component
function AnimatedLights() {
  const light1Ref = useRef<THREE.DirectionalLight>(null)
  const light2Ref = useRef<THREE.DirectionalLight>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const { animated } = SCENE_CONFIG.lighting

    if (light1Ref.current) {
      // First light orbits around
      light1Ref.current.position.x =
        Math.cos(time * animated.light1.orbitSpeed) * animated.light1.orbitRadius
      light1Ref.current.position.z =
        Math.sin(time * animated.light1.orbitSpeed) * animated.light1.orbitRadius
    }

    if (light2Ref.current) {
      // Second light moves in figure-8
      light2Ref.current.position.x =
        Math.sin(time * animated.light2.figureEightSpeed) * animated.light2.figureEightRadius.x
      light2Ref.current.position.z =
        Math.cos(time * animated.light2.figureEightSpeed * 2) * animated.light2.figureEightRadius.z
    }
  })

  return (
    <>
      <directionalLight
        ref={light1Ref}
        position={SCENE_CONFIG.lighting.animated.light1.initialPosition}
        intensity={SCENE_CONFIG.lighting.animated.light1.intensity}
        color={SCENE_CONFIG.lighting.animated.light1.color}
      />
      <directionalLight
        ref={light2Ref}
        position={SCENE_CONFIG.lighting.animated.light2.initialPosition}
        intensity={SCENE_CONFIG.lighting.animated.light2.intensity}
        color={SCENE_CONFIG.lighting.animated.light2.color}
      />
    </>
  )
}

// Main lighting setup component
export function SceneLighting() {
  const { lighting } = SCENE_CONFIG

  return (
    <>
      {/* Main directional light with shadows */}
      <directionalLight
        position={lighting.main.position}
        intensity={lighting.main.intensity}
        color={lighting.main.color}
        castShadow={lighting.main.castShadow}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Animated moving lights */}
      <AnimatedLights />

      {/* Puzzle highlighting lights */}
      {lighting.accent.map((light, index) => (
        <pointLight
          key={`accent-${index}`}
          position={light.position}
          intensity={light.intensity}
          color={light.color}
          distance={light.distance}
        />
      ))}

      {/* Rim lighting for definition */}
      {lighting.rim.map((light, index) => (
        <pointLight
          key={`rim-${index}`}
          position={light.position}
          intensity={light.intensity}
          color={light.color}
        />
      ))}

      {/* Warm ambient light */}
      <ambientLight intensity={lighting.ambient.intensity} color={lighting.ambient.color} />

      {/* Hemisphere light for realistic sky/ground lighting */}
      <hemisphereLight
        color={lighting.hemisphere.skyColor}
        groundColor={lighting.hemisphere.groundColor}
        intensity={lighting.hemisphere.intensity}
      />
    </>
  )
}
