import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleSystemProps {
  count?: number
  radius?: number
  speed?: number
}

const puzzleColors = [
  '#F44336', // Red
  '#FFC107', // Amber/Yellow
  '#4CAF50', // Green
  '#03A9F4', // Light Blue
  '#9C27B0', // Purple
]

export function PuzzleParticles({ count = 25, radius = 3, speed = 0.3 }: ParticleSystemProps) {
  // Create individual particles with different colors
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: puzzleColors[i % puzzleColors.length],
      position: [
        (Math.random() - 0.5) * radius,
        (Math.random() - 0.5) * radius,
        (Math.random() - 0.5) * radius,
      ] as [number, number, number],
      speed: [
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed,
      ] as [number, number, number],
      scale: Math.random() * 0.06 + 0.02,
      rotationSpeed: (Math.random() - 0.5) * 1,
    }))
  }, [count, radius, speed])

  return (
    <group>
      {particles.map((particle) => (
        <FloatingParticle
          key={particle.id}
          color={particle.color}
          initialPosition={particle.position}
          speed={particle.speed}
          scale={particle.scale}
          rotationSpeed={particle.rotationSpeed}
          radius={radius}
        />
      ))}
    </group>
  )
}

// Individual floating particle component
function FloatingParticle({
  color,
  initialPosition,
  speed,
  scale,
  rotationSpeed,
  radius,
}: {
  color: string
  initialPosition: [number, number, number]
  speed: [number, number, number]
  scale: number
  rotationSpeed: number
  radius: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const position = useRef(initialPosition.slice() as [number, number, number])
  const velocity = useRef(speed.slice() as [number, number, number])

  useFrame((state) => {
    if (!meshRef.current) return

    // Update position
    position.current[0] += velocity.current[0] * 0.01
    position.current[1] += velocity.current[1] * 0.01
    position.current[2] += velocity.current[2] * 0.01

    // Bounce off boundaries
    if (Math.abs(position.current[0]) > radius) velocity.current[0] *= -1
    if (Math.abs(position.current[1]) > radius) velocity.current[1] *= -1
    if (Math.abs(position.current[2]) > radius) velocity.current[2] *= -1

    // Add floating motion
    const floatY = Math.sin(state.clock.elapsedTime + initialPosition[0]) * 0.1

    // Apply position and rotation
    meshRef.current.position.set(
      position.current[0],
      position.current[1] + floatY,
      position.current[2],
    )

    meshRef.current.rotation.set(
      state.clock.elapsedTime * rotationSpeed,
      state.clock.elapsedTime * rotationSpeed * 0.7,
      0,
    )
  })

  return (
    <mesh ref={meshRef} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

// Sparkle particles that appear and disappear
export function SparkleParticles({ count = 20 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const tempObject = useMemo(() => new THREE.Object3D(), [])

  const sparkles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 6,
        life: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
      })
    }
    return temp
  }, [count])

  useFrame(() => {
    if (!meshRef.current) return

    sparkles.forEach((sparkle, i) => {
      sparkle.life += sparkle.speed

      // Reset sparkle when it fades out
      if (sparkle.life > Math.PI * 2) {
        sparkle.life = 0
        sparkle.x = (Math.random() - 0.5) * 6
        sparkle.y = (Math.random() - 0.5) * 6
        sparkle.z = (Math.random() - 0.5) * 6
      }

      // Fade in and out
      const scale = Math.sin(sparkle.life) * 0.05 + 0.02

      tempObject.position.set(sparkle.x, sparkle.y, sparkle.z)
      tempObject.scale.setScalar(scale)
      tempObject.updateMatrix()

      meshRef.current!.setMatrixAt(i, tempObject.matrix)
    })

    meshRef.current!.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#FFC107" transparent opacity={0.5} />
    </instancedMesh>
  )
}
