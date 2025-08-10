import { useGLTF } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import {
  Group,
  AnimationClip,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  DoubleSide,
  TextureLoader,
  Texture,
} from 'three'
import { useFrame } from '@react-three/fiber'
import { useAnimationMixer } from './hooks/useAnimationMixer'
import { usePuzzlePieces } from './hooks/usePuzzlePieces'
import { useMouseInteraction } from './hooks/useMouseInteraction'

interface ModelProps {
  modelUrl?: string
  textureUrl?: string
}

export function Model({
  modelUrl = '/PuzzleHero-Master.glb',
  textureUrl = '/Texture/PuzzlayPuzzleFix.webp',
}: ModelProps) {
  const groupRef = useRef<Group>(null)
  const { scene, animations } = useGLTF(modelUrl) as {
    scene: Group
    animations: AnimationClip[]
  }

  // Load the texture with proper loading state
  const [texture, setTexture] = useState<Texture | null>(null)
  const [textureLoaded, setTextureLoaded] = useState(false)
  const [modelReady, setModelReady] = useState(false)

  useEffect(() => {
    if (!textureUrl) {
      // If no texture URL, mark texture as "loaded" (skipped)
      setTextureLoaded(true)
      return
    }

    const loader = new TextureLoader()
    let retryCount = 0
    const maxRetries = 3

    const loadTexture = () => {
      loader.load(
        textureUrl,
        (loadedTexture) => {
          // Configure texture settings to fix appearance issues
          loadedTexture.generateMipmaps = true
          loadedTexture.wrapS = RepeatWrapping
          loadedTexture.wrapT = RepeatWrapping

          // Fix backwards "P" by flipping texture horizontally
          loadedTexture.repeat.set(-1, 1) // Flip horizontally to fix mirrored text

          setTexture(loadedTexture)
          setTextureLoaded(true)
        },
        undefined, // No progress handler
        (error) => {
          console.error('Error loading texture:', error)
          retryCount++
          if (retryCount < maxRetries) {
            setTimeout(loadTexture, 1000) // Retry after 1 second
          } else {
            // After max retries, still mark as loaded to not block the app
            setTextureLoaded(true)
          }
        },
      )
    }

    loadTexture()
  }, [textureUrl])

  // Apply texture to all meshes in the model (or set up materials without texture)
  useEffect(() => {
    if (scene && textureLoaded) {
      scene.traverse((child) => {
        if (child.type === 'Mesh') {
          const mesh = child as Mesh

          // Match Blender behavior - only render front faces like Blender surface
          const material = new MeshStandardMaterial({
            map: texture, // Will be null if no texture was loaded
            roughness: 1, // More matte (less shiny)
            metalness: 0.4, // No metallic look (removes glassy effect)
            side: DoubleSide, // Render both sides to match Blender behavior
          })

          mesh.material = material
          mesh.material.needsUpdate = true

          // Force geometry update
          if (mesh.geometry) {
            mesh.geometry.computeBoundingBox()
            mesh.geometry.computeBoundingSphere()
          }
        }
      })

      // Force a re-render by updating the scene
      if (scene.parent) {
        scene.parent.updateMatrixWorld(true)
      }

      // Mark model as ready when materials are applied
      setModelReady(true)
    }
  }, [scene, texture, textureLoaded])

  // Dispatch ready event when both model and texture are loaded
  useEffect(() => {
    console.log('Model: Checking ready state', { modelReady, textureLoaded, hasScene: !!scene })

    if (modelReady && textureLoaded && scene) {
      console.log('Model: All content ready, dispatching 3d-content-ready event')
      // Small delay to ensure everything is rendered
      const timer = setTimeout(() => {
        const event = new CustomEvent('3d-content-ready')
        window.dispatchEvent(event)
        console.log('Model: 3d-content-ready event dispatched')
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [modelReady, textureLoaded, scene])

  // Handle animation completion
  const handleAnimationComplete = () => {
    // Animation is now complete, lift effects can be applied
  }

  // Custom hooks for different concerns
  const { isAnimationComplete, canCheckStability, triggerCompletion } = useAnimationMixer({
    group: groupRef.current,
    animations,
    onAnimationComplete: handleAnimationComplete,
  })

  const { checkStability, applyLiftEffects, isStabilityDetected } = usePuzzlePieces({
    scene,
    isAnimationComplete,
    canCheckStability,
    onStabilityDetected: triggerCompletion,
  })

  const { isMouseInCanvas, getWorldMousePosition } = useMouseInteraction()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Dispose of geometries and materials to free GPU memory
      scene.traverse((child) => {
        if (child.type === 'Mesh') {
          const mesh = child as Mesh
          mesh.geometry?.dispose()
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((material) => material.dispose())
            } else {
              mesh.material.dispose()
            }
          }
        }
      })
    }
  }, [scene])

  // Main animation frame - now much cleaner!
  useFrame(() => {
    // Check for animation stability (handled by usePuzzlePieces hook)
    checkStability()

    // Apply lift effects only after BOTH animation is complete AND stability is detected
    if (isAnimationComplete && isStabilityDetected) {
      const { mouseX, mouseZ } = getWorldMousePosition()
      // Since the model is rotated 180 degrees, we must invert the mouse coordinates
      // to match the model's local coordinate system.
      applyLiftEffects(-mouseX, -mouseZ, isMouseInCanvas)
    }
  })

  // Fix model orientation permanently
  useEffect(() => {
    if (groupRef.current) {
      // Rotate 180 degrees around Y-axis to fix backwards orientation
      groupRef.current.rotation.y = Math.PI
    }
  }, [])

  return <primitive ref={groupRef} object={scene} />
}
