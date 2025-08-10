import { useDrag } from '@use-gesture/react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useEffect, useRef } from 'react'

interface PieceState {
  id: string
  mesh: THREE.Mesh
  currentPosition: THREE.Vector3
  isDragging: boolean
  isConnected: boolean
  partnerId?: string
  lastConnected?: boolean
}

interface PuzzlePieceProps {
  pieceState: PieceState
  onDragStart: (id: string) => void
  onDrag: (id: string, xy: [number, number], camera: THREE.Camera) => void
  onDragEnd: (id: string) => void
  setControlsEnabled: (enabled: boolean) => void
  allPieces: PieceState[]
}

export function PuzzlePiece({
  pieceState,
  onDragStart,
  onDrag,
  onDragEnd,
  setControlsEnabled,
  allPieces,
}: PuzzlePieceProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Find partner piece
  const partnerPiece = useMemo(() => {
    if (!pieceState.partnerId) return null
    return allPieces.find((p) => p.id === pieceState.partnerId) || null
  }, [allPieces, pieceState.partnerId])

  // Check if near partner
  const isNearPartner = useMemo(() => {
    if (!partnerPiece || pieceState.isConnected) return false
    const distance = pieceState.currentPosition.distanceTo(partnerPiece.currentPosition)
    return distance < 1.5
  }, [partnerPiece, pieceState.currentPosition, pieceState.isConnected])

  // Update position every frame
  // Update position every frame from state
  useFrame(() => {
    if (groupRef.current) {
      if (pieceState.isDragging) {
        // While dragging, teleport to the exact position for responsiveness
        groupRef.current.position.copy(pieceState.currentPosition)
      } else {
        // When not dragging, smoothly animate to the target position
        groupRef.current.position.lerp(pieceState.currentPosition, 0.2)
      }
    }
  })

  // Update scale and visual effects
  useFrame(() => {
    if (!groupRef.current) return

    let targetScale = 1
    if (pieceState.isDragging) {
      targetScale = 1.15
    } else if (pieceState.lastConnected) {
      targetScale = 1.25
    } else if (pieceState.isConnected) {
      targetScale = 1.0
    } else if (isNearPartner) {
      targetScale = 1.1
    }

    // Smooth scale transition
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  // Update material
  const enhancedMaterial = useMemo(() => {
    const originalMaterial = pieceState.mesh.material as THREE.MeshStandardMaterial
    const material = originalMaterial.clone()

    material.emissiveIntensity = 0
    material.emissive.set(0x000000)

    if (pieceState.isConnected) {
      material.emissive.set(0x00ff00)
      material.emissiveIntensity = pieceState.lastConnected ? 0.8 : 0.25
    } else if (isNearPartner) {
      material.emissive.set(0xffff00)
      material.emissiveIntensity = 0.3
    } else if (pieceState.isDragging) {
      material.emissive.set(0x0000ff)
      material.emissiveIntensity = 0.2
    }

    return material
  }, [
    pieceState.isConnected,
    pieceState.isDragging,
    isNearPartner,
    pieceState.mesh.material,
    pieceState.lastConnected,
  ])

  useEffect(() => {
    if (pieceState.mesh) {
      pieceState.mesh.material = enhancedMaterial
    }
  }, [enhancedMaterial, pieceState.mesh])

  const bind = useDrag(
    ({ active, first, last, xy, event }) => {
      event?.stopPropagation()
      setControlsEnabled(!active)

      if (first) {
        onDragStart(pieceState.id)
      } else if (active) {
        onDrag(pieceState.id, xy, camera)
      } else if (last) {
        onDragEnd(pieceState.id)
      }
    },
    {
      enabled: !pieceState.isConnected,
      eventOptions: { passive: false },
      filterTaps: true,
      threshold: 2,
    },
  )

  const handlePointerOver = () => {
    if (!pieceState.isDragging) {
      document.body.style.cursor = 'grab'
    }
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'default'
  }

  return (
    <group
      ref={groupRef}
      {...bind()}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={pieceState.mesh} />

      {/* Connection indicator */}
      {isNearPartner && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshBasicMaterial color="yellow" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Success indicator */}
      {pieceState.isConnected && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshBasicMaterial color="green" transparent opacity={0.9} />
        </mesh>
      )}

      {/* Snap indicator */}
      {pieceState.lastConnected && (
        <mesh>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color="lightblue" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  )
}
