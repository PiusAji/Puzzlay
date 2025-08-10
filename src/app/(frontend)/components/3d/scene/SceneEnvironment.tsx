import { Environment } from '@react-three/drei'
import { SCENE_CONFIG } from '../config/sceneConfig'
import { useEffect, useState, useRef } from 'react'
import { useThree } from '@react-three/fiber'

export function SceneEnvironment() {
  const { environment } = SCENE_CONFIG
  const [isReady, setIsReady] = useState(false)
  const { gl } = useThree()
  const mountedRef = useRef(false)

  // Delay environment loading to prevent context conflicts
  useEffect(() => {
    // Only initialize once per mount
    if (mountedRef.current) return

    mountedRef.current = true

    // Wait for WebGL context to be fully ready
    const checkContext = () => {
      if (gl.getContext() && !gl.getContext().isContextLost()) {
        setIsReady(true)
      } else {
        // Retry if context isn't ready
        setTimeout(checkContext, 50)
      }
    }

    // Initial delay + context check
    const timer = setTimeout(checkContext, 200)

    return () => {
      clearTimeout(timer)
      setIsReady(false)
      mountedRef.current = false
    }
  }, [gl])

  // Don't render environment if not ready or context is lost
  if (!isReady || gl.getContext()?.isContextLost()) {
    return <color attach="background" args={['#87ceeb']} />
  }

  return (
    <>
      <Environment
        preset={environment.preset}
        background
        blur={environment.backgroundBlur}
        environmentIntensity={environment.intensity}
        backgroundIntensity={environment.backgroundIntensity}
      />
    </>
  )
}
