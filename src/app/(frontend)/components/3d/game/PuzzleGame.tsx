import { Suspense, useState, useMemo, useEffect } from 'react'
import { usePuzzleGame } from './hooks/usePuzzleGame'
import { PuzzlePiece } from './PuzzlePiece'
import { PuzzleCamera } from './PuzzleCamera'
import { PuzzleControls } from './PuzzleControls'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { PuzzleParticles, SparkleParticles } from '../scene/SceneParticles'

interface PuzzleGameProps {
  modelUrl: string
  textureUrl: string
  onPuzzleComplete?: () => void
  onProgress?: (completedConnections: number, totalConnections: number, totalPieces: number) => void
}

// Completion celebration component
function CompletionCelebration({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <>
      <SparkleParticles count={200} />
      <pointLight position={[0, 5, 0]} color="gold" intensity={3} distance={20} decay={2} />
    </>
  )
}

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" transparent opacity={0.5} />
    </mesh>
  )
}

function Scene({ modelUrl, textureUrl, onPuzzleComplete, onProgress }: PuzzleGameProps) {
  const {
    pieceStates,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    puzzleCompleted,
    completedConnections,
    totalConnections,
    totalPieces,
  } = usePuzzleGame(modelUrl, textureUrl)

  const [controlsEnabled, setControlsEnabled] = useState(true)
  const [celebrationShown, setCelebrationShown] = useState(false)

  // Load texture with error handling
  const texture = useTexture(textureUrl, (texture) => {
    texture.flipY = false // Adjust based on your texture needs
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  })

  // Create puzzle material
  const puzzleMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4,
      metalness: 0.1,
    })
  }, [texture])

  // Apply material to all pieces
  useEffect(() => {
    pieceStates.forEach((p) => {
      if (p.mesh) {
        p.mesh.material = puzzleMaterial
      }
    })
  }, [pieceStates, puzzleMaterial])

  // Handle puzzle completion
  useEffect(() => {
    if (puzzleCompleted && !celebrationShown) {
      setCelebrationShown(true)

      // Trigger completion callback after a short delay
      const timer = setTimeout(() => {
        onPuzzleComplete?.()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [puzzleCompleted, celebrationShown, onPuzzleComplete])

  useEffect(() => {
    onProgress?.(completedConnections, totalConnections, totalPieces)
  }, [completedConnections, totalConnections, totalPieces, onProgress])

  // Dynamic lighting based on completion status
  const ambientIntensity = puzzleCompleted ? 0.8 : 0.6
  const hemisphereIntensity = puzzleCompleted ? 0.7 : 0.5

  return (
    <Suspense fallback={<LoadingFallback />}>
      {/* Camera and Controls */}
      <PuzzleCamera />
      <PuzzleControls enabled={controlsEnabled} />

      {/* Lighting */}
      <ambientLight intensity={ambientIntensity} />
      <hemisphereLight intensity={hemisphereIntensity} color="lightblue" groundColor="darkgreen" />
      <pointLight position={[10, 10, 10]} intensity={1} color="white" />
      <pointLight position={[-10, 5, 5]} intensity={0.5} color="lightblue" />

      {/* Background particles */}
      <PuzzleParticles count={30} radius={20} speed={0.3} />

      {/* Puzzle pieces */}
      {pieceStates.map((p) => (
        <PuzzlePiece
          key={p.id}
          pieceState={p}
          allPieces={pieceStates}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          setControlsEnabled={setControlsEnabled}
        />
      ))}

      {/* Solved area indicator */}
      <mesh position={[0, -0.1, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color={puzzleCompleted ? '#004400' : '#333333'}
          transparent
          opacity={0.3}
          emissive={puzzleCompleted ? '#002200' : '#000000'}
          emissiveIntensity={puzzleCompleted ? 0.2 : 0}
        />
      </mesh>

      {/* Grid helper for solved area */}
      <gridHelper
        args={[8, 8, puzzleCompleted ? '#008800' : '#666666', '#444444']}
        position={[0, 0, -8]}
      />

      {/* Completion celebration */}
      <CompletionCelebration show={puzzleCompleted} />
    </Suspense>
  )
}

export function PuzzleGame({
  modelUrl,
  textureUrl,
  onPuzzleComplete,
  onProgress,
}: PuzzleGameProps) {
  return (
    <>
      {/* Background gradient */}
      <color attach="background" args={['#1a1a2e']} />
      <fog attach="fog" args={['#1a1a2e', 15, 35]} />

      <Scene
        modelUrl={modelUrl}
        textureUrl={textureUrl}
        onPuzzleComplete={onPuzzleComplete}
        onProgress={onProgress}
      />
    </>
  )
}
