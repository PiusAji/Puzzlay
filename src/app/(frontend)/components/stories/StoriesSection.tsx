'use client'

import { useEffect, useState, useMemo } from 'react'
import { StoryCard } from './StoryCard'
import { Story } from '../../../../lib/api'
import { Sparkle } from './Sparkle'

const sparkleColors = ['#FFD700', '#FF69B4', '#00FFFF']

function Sparkles() {
  const sparkles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      color: sparkleColors[i % sparkleColors.length],
      size: Math.random() * 5 + 2,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
      },
    }))
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} {...sparkle} />
      ))}
    </div>
  )
}

function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollProgress
}

interface StoriesSectionProps {
  stories: Story[]
}

export function StoriesSection({ stories }: StoriesSectionProps) {
  const scrollProgress = useScrollProgress()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Pre-load the blur effect
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const shouldBeVisible = scrollProgress > 0.6

    if (shouldBeVisible && !isVisible) {
      setIsVisible(true)
    } else if (!shouldBeVisible && isVisible) {
      setIsVisible(false)
    }
  }, [scrollProgress, isVisible])

  if (!stories || stories.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-6">No Stories Found</h2>
          <p className="text-white/70 text-lg mb-6">No stories are available at the moment.</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-sm text-white/60">
            <p className="mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Go to your Payload CMS admin panel</li>
              <li>Create or edit a story</li>
              <li>Set the story status to Published</li>
              <li>Add some images to the story</li>
              <li>Save and refresh this page</li>
            </ol>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen py-20">
      {/* Pre-rendered backdrop container - always present but invisible initially */}
      <div
        className={`
          container mx-auto px-6 rounded-2xl p-8 transform-gpu
          transition-all duration-1000 ease-out
          ${isLoaded ? 'bg-white/20 backdrop-blur-sm' : 'bg-transparent'}
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Section Header */}
        <div className="relative text-center mb-16">
          <Sparkles />
          <h2 className="relative z-10 text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 mb-6 drop-shadow-lg">
            ✨ Pilih Cerita Puzzle 🧩
          </h2>
          <p className="text-2xl text-gray-800 max-w-3xl mx-auto drop-shadow-md">
            Ayo selesaikan puzzle ber-serie dan pilih cerita yang kamu suka, mainkan puzzle secara
            urut sesuai alur dari cerita! 💖
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stories.map((story, index) => (
            <StoryCard key={story.id} story={story} index={index} />
          ))}
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </section>
  )
}

// Alternative approach using CSS-in-JS for more control
export function StoriesSectionOptimized({ stories }: StoriesSectionProps) {
  const scrollProgress = useScrollProgress()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const shouldBeVisible = scrollProgress > 0.6
    setIsVisible(shouldBeVisible)
  }, [scrollProgress])

  // Inline styles for better blur control
  const containerStyle = {
    transform: 'translateZ(0)',
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    WebkitBackfaceVisibility: 'hidden' as const,
    // Force hardware acceleration
    WebkitTransform: 'translate3d(0, 0, 0)',
    // Pre-apply backdrop filter
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  }

  if (!stories || stories.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-6">No Stories Found</h2>
          <p className="text-white/70 text-lg mb-6">No stories are available at the moment.</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-sm text-white/60">
            <p className="mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Go to your Payload CMS admin panel</li>
              <li>Create or edit a story</li>
              <li>Set the story status to Published</li>
              <li>Add some images to the story</li>
              <li>Save and refresh this page</li>
            </ol>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen py-20">
      <div
        className={`
          container mx-auto px-6 bg-white/20 rounded-2xl p-8
          transition-all duration-1000 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
        style={containerStyle}
      >
        {/* Section Header */}
        <div className="relative text-center mb-16">
          <Sparkles />
          <h2 className="relative z-10 text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 mb-6 drop-shadow-lg">
            ✨ Pilih Cerita Puzzle 🧩
          </h2>
          <p className="text-2xl text-gray-800 max-w-3xl mx-auto drop-shadow-md">
            Ayo selesaikan puzzle ber-serie dan pilih cerita yang kamu suka, mainkan puzzle secara
            urut sesuai alur dari cerita! 💖
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stories.map((story, index) => (
            <StoryCard key={story.id} story={story} index={index} />
          ))}
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </section>
  )
}
