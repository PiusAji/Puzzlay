'use client'

import { useState, useEffect } from 'react'
import { Sparkle } from '../stories/Sparkle'
import { Homepage } from '@/lib/api'

const sparkleColors = ['#FFD700', '#FF69B4', '#00FFFF']

function Sparkles() {
  const sparkles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    color: sparkleColors[i % sparkleColors.length],
    size: Math.random() * 4 + 2,
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
    },
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} {...sparkle} />
      ))}
    </div>
  )
}

interface HeroSectionProps {
  hero: Homepage['hero']
}

export function HeroSection({ hero }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [isGlowing, setIsGlowing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Animation for left-to-right color change every 3 seconds
  useEffect(() => {
    if (!isVisible || !hero?.title) return

    const letters = hero.title.split('')
    let letterIndex = 0

    const startAnimation = () => {
      setIsGlowing((prev) => !prev) // Toggle the target style
      letterIndex = 0
      setCurrentLetterIndex(0)

      const letterInterval = setInterval(() => {
        letterIndex++
        setCurrentLetterIndex(letterIndex)

        if (letterIndex >= letters.length) {
          clearInterval(letterInterval)
        }
      }, 150) // 150ms per letter for smooth left-to-right effect
    }

    // Start first animation after 1 second, then repeat every 3 seconds
    const initialTimer = setTimeout(startAnimation, 1000)
    const mainInterval = setInterval(startAnimation, 3000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(mainInterval)
    }
  }, [isVisible, hero?.title])

  const getLetterStyle = (index: number) => {
    const hasChanged = index < currentLetterIndex

    if (hasChanged) {
      if (isGlowing) {
        // White with purple outline and glow
        return {
          color: 'white',
          WebkitTextStroke: '2px rgba(168, 85, 247, 0.9)',
          textShadow:
            '0 0 25px rgba(168, 85, 247, 0.8), 0 0 50px rgba(168, 85, 247, 0.4), 0 4px 8px rgba(168, 85, 247, 0.3)',
          filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.7))',
        }
      } else {
        // Back to original gradient style
        return {
          background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #3B82F6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          WebkitTextStroke: '2px rgba(168, 85, 247, 0.3)',
          filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.4))',
        }
      }
    } else {
      // Default state - opposite of current target
      if (isGlowing) {
        // Show original style for unchanged letters
        return {
          background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #3B82F6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          WebkitTextStroke: '2px rgba(168, 85, 247, 0.3)',
          filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.4))',
        }
      } else {
        // Show glowing style for unchanged letters
        return {
          color: 'white',
          WebkitTextStroke: '2px rgba(168, 85, 247, 0.9)',
          textShadow:
            '0 0 25px rgba(168, 85, 247, 0.8), 0 0 50px rgba(168, 85, 247, 0.4), 0 4px 8px rgba(168, 85, 247, 0.3)',
          filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.7))',
        }
      }
    }
  }

  if (!hero) {
    return null
  }

  const { title, description } = hero

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center pointer-events-auto
        min-h-screen w-full
        transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Floating card-style container */}
      <div
        className="relative px-10 py-8 max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300"
        style={{
          background: `
            linear-gradient(145deg, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(255, 255, 255, 0.85) 100%
            )
          `,
          backdropFilter: 'blur(15px)',
          borderRadius: '28px',
          border: '3px solid rgba(168, 85, 247, 0.4)',
          boxShadow: `
            0 25px 50px rgba(168, 85, 247, 0.3),
            0 10px 20px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8)
          `,
        }}
      >
        <Sparkles />

        {/* Decorative corner elements */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse" />
        <div className="absolute -top-2 -right-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full animate-pulse delay-500" />
        <div className="absolute -bottom-3 -left-2 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse delay-1000" />
        <div className="absolute -bottom-2 -right-3 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full animate-pulse delay-700" />

        {/* Animated Title - Left to right color change */}
        <h1
          className="
            relative z-10 
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl
            font-black tracking-tight leading-tight
            mb-4
          "
        >
          {title.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block transition-all duration-300 ease-out hover:scale-110 cursor-default"
              style={getLetterStyle(index)}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>

        {/* Glass sweep effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px]">
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-all duration-300 ease-out"
            style={{
              width: '25%',
              left: `${(currentLetterIndex / title.length) * 100 - 12.5}%`,
              opacity: currentLetterIndex > 0 && currentLetterIndex <= title.length ? 0.7 : 0,
            }}
          />
        </div>

        {/* Description */}
        <p
          className="
            relative z-10
            text-lg sm:text-xl md:text-2xl
            font-semibold leading-relaxed
            max-w-3xl mx-auto
          "
          style={{
            background: 'linear-gradient(135deg, #6B46C1 0%, #EC4899 50%, #3B82F6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
