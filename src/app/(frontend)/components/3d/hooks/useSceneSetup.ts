import { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { SCENE_CONFIG } from '../config/sceneConfig'

interface UseSceneSetupProps {
  onSceneCreated?: (scene: THREE.Scene, gl: THREE.WebGLRenderer) => void
}

export function useSceneSetup({ onSceneCreated }: UseSceneSetupProps = {}) {
  const [isSceneReady, setIsSceneReady] = useState(false)

  // 🔥 THIS WAS THE PROBLEM - Generate stable key ONCE per session
  const modelKeyRef = useRef<string>('')
  const [modelKey, setModelKey] = useState<string>('')

  useEffect(() => {
    // Only generate key if we don't have one
    if (!modelKeyRef.current) {
      const sessionKey = `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      modelKeyRef.current = sessionKey
      setModelKey(sessionKey)
    } else {
      // Use existing key
      setModelKey(modelKeyRef.current)
    }

    setIsSceneReady(true)
  }, []) // Empty dependency array is correct here

  // Scene creation handler
  const handleSceneCreated = ({ scene, gl }: { scene: THREE.Scene; gl: THREE.WebGLRenderer }) => {
    // Background will be handled by SceneEnvironment component

    // Allow page scrolling when mouse is over canvas
    gl.domElement.style.touchAction = 'auto'

    // GPU memory management
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio
    gl.outputColorSpace = THREE.SRGBColorSpace

    // Context lost handling
    gl.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault()
    })

    gl.domElement.addEventListener('webglcontextrestored', () => {})

    // Call custom handler if provided
    onSceneCreated?.(scene, gl)
  }

  return {
    isSceneReady,
    modelKey,
    handleSceneCreated,
    cameraConfig: {
      position: [
        SCENE_CONFIG.camera.initialPosition.x,
        SCENE_CONFIG.camera.initialPosition.y,
        SCENE_CONFIG.camera.initialPosition.z,
      ] as [number, number, number],
      fov: SCENE_CONFIG.camera.fov,
    },
    canvasStyle: { touchAction: 'auto' as const },
  }
}
