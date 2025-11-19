import React, { useEffect, useState, useMemo } from 'react'

const sparkleColors = ['#FFD700', '#FF69B4', '#00FFFF']

function Sparkles() {
  const sparkles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-pulse"
          style={{
            ...sparkle.style,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: sparkle.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
            opacity: 0.6,
          }}
        />
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

export default function TujuanPengembangan() {
  const scrollProgress = useScrollProgress()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const shouldBeVisible = scrollProgress > 0.2

    if (shouldBeVisible && !isVisible) {
      setIsVisible(true)
    } else if (!shouldBeVisible && isVisible) {
      setIsVisible(false)
    }
  }, [scrollProgress, isVisible])

  return (
    <section className="py-12 md:py-16 flex items-center justify-center">
      <div
        className={`
          container mx-auto px-6 rounded-2xl p-8 md:p-12 transform-gpu
          transition-all duration-1000 ease-out
          ${isLoaded ? 'backdrop-blur-sm' : 'bg-transparent'}
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="relative grid place-items-center text-center max-w-4xl mx-auto">
          <Sparkles />

          <h2 className="relative z-10 text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 mb-8 drop-shadow-lg">
            📚 Tujuan Pembelajaran
          </h2>

          <p className="relative z-10 text-xl md:text-2xl text-white max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            Peserta didik mampu menulis teks narasi sederhana dengan awal, tengah, akhir, dengan
            elemen intrinsik seperti tokoh, latar, dan alur dialog untuk menarik pembaca. ✨
          </p>
        </div>
      </div>
    </section>
  )
}
