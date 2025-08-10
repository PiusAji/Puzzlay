'use client'

import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { useSceneSetup } from './hooks/useSceneSetup'
import {
  SceneLighting,
  FloatingPuzzle,
  ModelWrapper,
  PuzzleParticles,
  SparkleParticles,
} from './scene'
import { useScrollCamera } from './hooks/useScrollCamera'
import { SceneSurface } from './scene/SceneSurface'
import { Scene3DText } from './scene/Scene3DText'
import { SCENE_CONFIG } from './config/sceneConfig'

interface ModelViewerProps {
  modelUrl?: string
  textureUrl?: string
  storySectionRef: React.RefObject<HTMLElement | null>
}

function ModelViewerClient({ modelUrl, textureUrl, storySectionRef }: ModelViewerProps) {
  const { modelKey } = useSceneSetup()

  // This component calls the hook and MUST be rendered inside the Canvas
  const CameraController = ({ storyRef }: { storyRef: React.RefObject<HTMLElement | null> }) => {
    useScrollCamera(storyRef)
    return null // This component doesn't render anything itself
  }

  return (
    <ErrorBoundary>
      {/* This component now correctly calls the hook from within the Canvas */}
      <CameraController storyRef={storySectionRef} />

      {/* Simple solid background */}
      <color attach="background" args={['#f8f9fa']} />

      {/* Lighting */}
      <SceneLighting />

      {/* Surface/Table (configurable) */}
      <SceneSurface />

      {/* 3D Text (if enabled) */}
      <Scene3DText />

      {/* Particle effects around puzzle */}
      <PuzzleParticles count={30} radius={3} speed={0.3} />
      <SparkleParticles count={15} />

      {/* 3D Model with effects */}
      <Suspense fallback={null}>
        <FloatingPuzzle>
          <ModelWrapper modelKey={modelKey} modelUrl={modelUrl} textureUrl={textureUrl} />
        </FloatingPuzzle>
      </Suspense>

      {/* Remove 3D Stories - we'll show normal HTML instead */}

      {/* Camera controls - Re-enabled with proper pointer event handling */}
      <OrbitControls
        enableZoom={SCENE_CONFIG.controls.enableZoom}
        enablePan={SCENE_CONFIG.controls.enablePan}
        maxPolarAngle={SCENE_CONFIG.controls.maxPolarAngle}
        enabled={true} // Re-enabled now that pointer events are fixed
        enableDamping={SCENE_CONFIG.controls.enableDamping}
        dampingFactor={SCENE_CONFIG.controls.dampingFactor}
      />
    </ErrorBoundary>
  )
}

export default ModelViewerClient
