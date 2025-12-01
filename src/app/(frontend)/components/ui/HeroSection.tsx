'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface HeroSectionProps {
  hero?: {
    title?: string
  }
}

export function HeroSection({ hero }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayWord, setDisplayWord] = useState('PUZZLAY')
  const [isAnimating, setIsAnimating] = useState(false)
  const wordIndexRef = useRef(0)

  const rotatingWords = ['PUZZLAY', 'PUZZLE', 'INTERAKTIF', '3D']

  // Apply vertical jiggle to all letters
  const applyJiggle = () => {
    if (!containerRef.current) return

    const letters = containerRef.current.querySelectorAll('.letter')

    letters.forEach((letter, i) => {
      // Kill existing jiggle animations first
      gsap.killTweensOf(letter, 'y')

      // VERTICAL bounce only
      gsap.to(letter, {
        y: -10 - (i % 5) * 2,
        duration: 1.5 + (i % 4) * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })
  }

  // Flip to next word
  const flipToNextWord = () => {
    if (isAnimating || !containerRef.current) return

    setIsAnimating(true)

    // Get next word
    wordIndexRef.current = (wordIndexRef.current + 1) % rotatingWords.length
    const nextWord = rotatingWords[wordIndexRef.current]

    const letters = containerRef.current.querySelectorAll('.letter')

    // Kill jiggle animations before flip
    letters.forEach((letter) => {
      gsap.killTweensOf(letter)
    })

    // FLIP OUT animation (current word)
    letters.forEach((letter, i) => {
      gsap.to(letter, {
        rotateX: 90,
        opacity: 0,
        duration: 0.1,
        delay: i * 0.03,
        ease: 'power2.in',
      })
    })

    // Calculate when flip out completes
    const flipOutTime = (letters.length - 1) * 0.03 + 0.1

    // CHANGE THE WORD after flip out completes + extra safety buffer
    setTimeout(
      () => {
        setDisplayWord(nextWord)

        // FLIP IN animation - wait for React to render new word
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const newLetters = containerRef.current?.querySelectorAll('.letter')
            if (!newLetters) return

            newLetters.forEach((letter, i) => {
              gsap.fromTo(
                letter,
                { rotateX: -90, opacity: 0 },
                {
                  rotateX: 0,
                  opacity: 1,
                  duration: 0.1,
                  delay: i * 0.03,
                  ease: 'power2.out',
                },
              )
            })

            // Re-apply jiggle after flip in completes
            const flipInTime = (newLetters.length - 1) * 0.03 + 0.1
            setTimeout(
              () => {
                applyJiggle()
                setIsAnimating(false)
              },
              flipInTime * 1000 + 100,
            )
          })
        })
      },
      flipOutTime * 1000 + 100,
    )
  }

  // Initial entrance animation
  useEffect(() => {
    if (!containerRef.current) return

    const letters = containerRef.current.querySelectorAll('.letter')

    gsap.fromTo(
      letters,
      { rotateX: -90, opacity: 0 },
      {
        rotateX: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.04,
        ease: 'back.out(1.5)',
        delay: 0.3,
        onComplete: applyJiggle,
      },
    )
  }, [])

  // Timer to flip words every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      flipToNextWord()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAnimating])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      {/* Floating minimal shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-24 right-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-float"></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-pink-300 rounded-full animate-float-slow"></div>
      </div>

      {/* Main Heading - Centered */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="text-center">
          <h1
            ref={containerRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Colored text with gradient-like effect */}
            <div className="relative inline-block">
              {displayWord.split('').map((char, i) => {
                const totalChars = displayWord.length
                const progress = i / Math.max(totalChars - 1, 1)

                // Calculate color based on position: pink -> purple -> blue
                let color
                if (progress < 0.5) {
                  // Pink to Purple
                  const t = progress * 2
                  color = `rgb(${244 - (244 - 168) * t}, ${114 - (114 - 85) * t}, ${182 + (247 - 182) * t})`
                } else {
                  // Purple to Blue
                  const t = (progress - 0.5) * 2
                  color = `rgb(${168 - (168 - 59) * t}, ${85 + (130 - 85) * t}, ${247 - (247 - 246) * t})`
                }

                return (
                  <span
                    key={i}
                    className="letter"
                    style={{
                      display: 'inline-block',
                      transformStyle: 'preserve-3d',
                      color: color,
                      filter: 'drop-shadow(0 2px 8px rgba(168, 85, 247, 0.4))',
                    }}
                  >
                    {char}
                  </span>
                )
              })}
            </div>
          </h1>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
