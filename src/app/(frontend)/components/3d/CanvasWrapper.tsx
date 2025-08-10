// CanvasWrapper.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { useSceneStore } from './stores/useSceneStore'
import { useState, useEffect } from 'react'

export default function CanvasWrapper() {
  const { scene } = useSceneStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything on server or until client is ready
  if (!isClient) {
    return <div className="fixed inset-0 z-0" />
  }

  // Don't render Canvas until we have a scene
  if (!scene) {
    return <div className="fixed inset-0 z-0" />
  }

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {scene}
      </Canvas>
    </div>
  )
}
