// ModelViewerLoader.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { SiteSettings, Nav, Story } from '@/lib/api'

interface ModelViewerLoaderProps {
  siteSettings: SiteSettings | null
  navigationData: Nav | null
  stories: Story[]
  heroContent?: React.ReactNode
}

// Enhanced loading component that matches your design theme
interface LoadingSpinnerProps {
  contentReady?: boolean
}

export function LoadingSpinner({ contentReady = false }: LoadingSpinnerProps) {
  const [progress, setProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const animationStartedRef = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Ensure we're on the client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only log on client side to prevent build errors
  if (typeof window !== 'undefined') {
    console.log(
      'LoadingSpinner: Component rendered with progress:',
      progress,
      'contentReady:',
      contentReady,
      'isClient:',
      isClient,
    )
  }

  // Start animation only on client side
  useEffect(() => {
    if (!isClient || animationStartedRef.current) {
      return
    }

    if (typeof window === 'undefined') {
      return // Extra safety check
    }

    animationStartedRef.current = true

    let currentProgress = 0
    intervalRef.current = setInterval(() => {
      const increment = currentProgress < 30 ? 3 : currentProgress < 70 ? 5 : 2
      currentProgress = Math.min(currentProgress + increment, 95)
      setProgress(currentProgress)

      if (currentProgress >= 95) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isClient])

  // Complete progress when content is ready
  useEffect(() => {
    if (contentReady && isClient && typeof window !== 'undefined') {
      setProgress(100)
    }
  }, [contentReady, isClient])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 relative overflow-hidden">
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Yellow sparkles */}
        <div
          className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
          style={{ animationDelay: '0s', animationDuration: '2s' }}
        ></div>
        <div
          className="absolute top-40 right-32 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
          style={{ animationDelay: '0.5s', animationDuration: '1.8s' }}
        ></div>
        <div
          className="absolute bottom-32 left-40 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"
          style={{ animationDelay: '1s', animationDuration: '2.2s' }}
        ></div>

        {/* Pink sparkles */}
        <div
          className="absolute top-32 right-20 w-3 h-3 bg-pink-300 rounded-full animate-bounce"
          style={{ animationDelay: '0.3s', animationDuration: '1.9s' }}
        ></div>
        <div
          className="absolute bottom-20 right-40 w-2 h-2 bg-pink-300 rounded-full animate-bounce"
          style={{ animationDelay: '0.8s', animationDuration: '2.1s' }}
        ></div>
        <div
          className="absolute top-60 left-32 w-3 h-3 bg-pink-300 rounded-full animate-bounce"
          style={{ animationDelay: '1.3s', animationDuration: '1.7s' }}
        ></div>

        {/* Cyan sparkles */}
        <div
          className="absolute bottom-40 left-20 w-3 h-3 bg-cyan-300 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s', animationDuration: '2.3s' }}
        ></div>
        <div
          className="absolute top-80 right-60 w-4 h-4 bg-cyan-300 rounded-full animate-bounce"
          style={{ animationDelay: '0.7s', animationDuration: '1.6s' }}
        ></div>
        <div
          className="absolute bottom-60 right-20 w-2 h-2 bg-cyan-300 rounded-full animate-bounce"
          style={{ animationDelay: '1.2s', animationDuration: '2s' }}
        ></div>
      </div>

      <div className="text-center z-10">
        {/* Main logo container with morphing blob */}
        <div className="relative mb-8">
          <div
            className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl"
            style={{
              animation: 'elementMorph 3s ease-in-out infinite',
              borderRadius: '40% 60% 70% 30% / 50% 60% 40% 50%',
            }}
          >
            <Image
              src="/Puzzlay-logo.webp"
              alt="Puzzlay Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        </div>

        {/* Loading text with emojis */}
        <div className="text-white text-xl font-bold mb-8 animate-pulse">
          🚀 Loading 3D Magic! ✨
        </div>

        {/* Enhanced progress bar with clean rounded container */}
        <div className="mt-8 w-80 mx-auto">
          <div className="w-full h-4 bg-white/20 backdrop-blur-sm overflow-hidden shadow-lg rounded-full">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 relative overflow-hidden rounded-full transition-all duration-300"
              style={{
                width: `${isClient ? progress : 0}%`,
              }}
            >
              {/* Shimmer effect overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                style={{
                  animation: 'shimmer 2s ease-in-out infinite',
                }}
              ></div>
            </div>
          </div>

          {/* Progress percentage */}
          <div className="text-center mt-2 text-white/80 text-sm">
            {isClient ? Math.round(progress) : 0}%
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

export default function ModelViewerLoader({
  siteSettings,
  navigationData,
  stories,
  heroContent,
}: ModelViewerLoaderProps) {
  const [ModelViewerServer, setModelViewerServer] =
    useState<React.ComponentType<ModelViewerLoaderProps> | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isComponentLoading, setIsComponentLoading] = useState(true)
  const [is3DContentReady, setIs3DContentReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasReceivedReadySignal, setHasReceivedReadySignal] = useState(false)

  // Combined loading state - show loading until both component and 3D content are ready
  const isLoading = isComponentLoading || (!is3DContentReady && !hasReceivedReadySignal)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run on client side
    if (!isClient || typeof window === 'undefined') return

    let mounted = true

    const loadComponent = async () => {
      try {
        // Wait a bit to ensure everything is ready
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Import the ModelViewerServer component
        const { default: ServerComponent } = await import('./ModelViewerServer')

        if (mounted) {
          setModelViewerServer(() => ServerComponent)
          setIsComponentLoading(false)
        }
      } catch (err) {
        console.error('Failed to load ModelViewerServer:', err)
        if (mounted) {
          setError('Failed to load 3D viewer')
          setIsComponentLoading(false)
        }
      }
    }

    loadComponent()

    return () => {
      mounted = false
    }
  }, [isClient])

  // Listen for 3D content ready signal with timeout fallback
  useEffect(() => {
    // Only run on client side
    if (!isClient || typeof window === 'undefined') return

    const handle3DReady = () => {
      setHasReceivedReadySignal(true)
      setIs3DContentReady(true)
    }

    // Listen for custom event from 3D components
    window.addEventListener('3d-content-ready', handle3DReady)

    // Fallback timeout - if 3D content doesn't load within 10 seconds, show anyway
    const fallbackTimer = setTimeout(() => {
      setHasReceivedReadySignal(true)
      setIs3DContentReady(true)
    }, 10000)

    return () => {
      window.removeEventListener('3d-content-ready', handle3DReady)
      clearTimeout(fallbackTimer)
    }
  }, [isClient])

  // Always render loading on server side and initial client render
  if (!isClient || isLoading || !ModelViewerServer) {
    return <LoadingSpinner key="main-loader" contentReady={is3DContentReady} />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500">
        <div className="text-center">
          <div
            className="mb-6 p-8 bg-white/20 backdrop-blur-sm"
            style={{
              animation: 'elementMorph 3s ease-in-out infinite',
              borderRadius: '40% 60% 70% 30% / 50% 60% 40% 50%',
            }}
          >
            <p className="text-white text-xl mb-4">😵 Oops! Something went wrong</p>
            <p className="text-red-200 mb-6">{error}</p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload()
                }
              }}
              className="px-6 py-3 bg-white/30 text-white rounded-full hover:bg-white/40 transition-all backdrop-blur-sm font-bold"
              style={{
                animation: 'elementMorph 2s ease-in-out infinite',
                borderRadius: '40% 60% 70% 30% / 50% 60% 40% 50%',
              }}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ModelViewerServer
      siteSettings={siteSettings}
      navigationData={navigationData}
      stories={stories}
      heroContent={heroContent}
    />
  )
}
