'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Homepage } from '@/lib/api'

interface HeroSectionProps {
  hero: Homepage['hero']
}

export function HeroSection({ hero }: HeroSectionProps) {
  const titleRef = useRef<HTMLDivElement>(null)
  const backgroundTextRef = useRef<HTMLSpanElement>(null)
  const bottomContainerRef = useRef<HTMLDivElement>(null)
  const glowLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if refs are available before running animations
    if (
      !titleRef.current ||
      !backgroundTextRef.current ||
      !bottomContainerRef.current ||
      !glowLineRef.current
    ) {
      return
    }

    // Create timeline for coordinated animations
    const tl = gsap.timeline()

    // Background text letter-by-letter slide animation (left to right)
    const backgroundWords = backgroundTextRef.current.querySelectorAll('div')

    if (backgroundWords.length > 0) {
      backgroundWords.forEach((word, wordIndex) => {
        // Split each word into individual letters while preserving layout
        const text = word.textContent || ''
        const letters: HTMLElement[] = []

        // Store original styles
        const originalStyles = window.getComputedStyle(word)

        // Clear and rebuild with spans, preserving all necessary styles
        word.innerHTML = text
          .split('')
          .map((letter) => {
            return `<span style="display: inline-block; white-space: nowrap; font-size: inherit; font-weight: inherit; line-height: inherit; letter-spacing: inherit;">${letter === ' ' ? '&nbsp;' : letter}</span>`
          })
          .join('')

        // Ensure parent maintains its styling and doesn't wrap
        word.style.whiteSpace = 'nowrap'
        word.style.overflow = 'visible'

        // Get the letter elements
        const letterElements = word.querySelectorAll('span') as NodeListOf<HTMLElement>
        letterElements.forEach((span) => letters.push(span))

        // Set initial state for letters - slide from LEFT
        gsap.set(letters, {
          x: -50, // Reduced distance for smoother effect
          opacity: 0,
          rotationY: -45, // Less dramatic rotation
        })

        // Animate letters sliding in one by one from left to right
        letters.forEach((letter, letterIndex) => {
          tl.to(
            letter,
            {
              x: 0,
              opacity: 1,
              rotationY: 0,
              duration: 0.25,
              ease: 'power2.out',
              onComplete: () => {
                // Add subtle floating after letter appears
                gsap.to(letter, {
                  y: -3,
                  duration: 2 + wordIndex * 0.3 + letterIndex * 0.1,
                  ease: 'sine.inOut',
                  repeat: -1,
                  yoyo: true,
                })
              },
            },
            wordIndex * 0.8 + letterIndex * 0.05,
          ) // Even faster and smoother
        })
      })
    }

    // Main title animation - safe approach that won't hide text
    const titleLines = titleRef.current.querySelectorAll('div')

    if (titleLines.length > 0) {
      // Set a very mild initial state - barely noticeable
      gsap.set(titleLines, {
        opacity: 0.1, // Start slightly visible instead of fully hidden
        y: 30, // Smaller movement
        scale: 0.98, // Very subtle scale
      })

      // Animate each line with staggered timing
      titleLines.forEach((line, lineIndex) => {
        tl.to(
          line,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              // Add very subtle breathing animation after reveal
              gsap.to(line, {
                y: -1,
                duration: 4 + lineIndex * 0.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              })
            },
          },
          2.5 + lineIndex * 0.3,
        ) // Start after background animation
      })
    }

    // Glow line animation
    gsap.set(glowLineRef.current, {
      width: '0%', // Start with 0 width
      opacity: 0,
      // transformOrigin is not strictly needed for width animation, but keeping for consistency if scaleX was intended
    })

    tl.to(
      glowLineRef.current,
      {
        width: '60%', // Animate to its natural width
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
      },
      4.0, // Start after main heading animation is fully complete
    )

    // Bottom container animation - slide up as one unit
    gsap.set(bottomContainerRef.current, {
      opacity: 0,
      y: 100,
    })

    tl.to(
      bottomContainerRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
      },
      3,
    )

    // Cleanup function
    return () => {
      tl.kill()
      // Kill any running animations on cleanup
      gsap.killTweensOf([
        titleRef.current,
        backgroundTextRef.current,
        bottomContainerRef.current,
        glowLineRef.current,
      ])
    }
  }, [])

  if (!hero) {
    return null
  }

  const mainHeading = hero.title
  const subtitle = 'Permainan Puzzle 3D'
  const description = hero.description
  const ctaText = 'Story'

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rotate-45 animate-float"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400/40 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-pink-400/50 rotate-45 animate-float-slow"></div>
        <div className="absolute top-1/3 right-20 w-8 h-1 bg-gradient-to-r from-purple-400 to-transparent animate-float"></div>
      </div>

      {/* H1 - Top Left */}
      <div className="absolute top-16 left-8 lg:left-16">
        <h1 className="relative">
          {/* Background text for depth */}
          <span
            ref={backgroundTextRef}
            className="absolute inset-0 text-5xl md:text-9xl lg:text-9xl font-black uppercase text-white/5 blur-sm"
            aria-hidden="true"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="tracking-wider pb-2">BERMAIN</div>
            <div className="tracking-wider pb-2 pl-16">BERSAMA</div>
            <div className="tracking-wider pb-2">PUZZLAY</div>
          </span>

          {/* Main heading with advanced effects - 2 lines */}
          <div
            ref={titleRef}
            className="relative text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-none tracking-tighter"
            style={{
              background:
                'linear-gradient(135deg, #ffffff 0%, #f8fafc 30%, #e2e8f0 60%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              /* WebkitTextFillColor: 'transparent', */
              filter:
                'drop-shadow(0 0 30px rgba(168, 85, 247, 0.3)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.4))',
              textShadow: '0 0 40px rgba(168, 85, 247, 0.5)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div>BERMAIN BERSAMA</div>
            <div className="pl-2">PUZZLAY</div>
          </div>

          {/* Glowing accent line */}
          <div
            ref={glowLineRef}
            className="absolute -bottom-4 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent rounded-full"
            style={{
              width: '60%',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
              animation: 'glow-pulse 2s ease-in-out infinite alternate',
            }}
          ></div>
        </h1>
      </div>

      {/* Bottom Content - Bottom Right */}
      <div ref={bottomContainerRef} className="absolute bottom-20 right-8 lg:bottom-28 lg:right-16">
        <div className="max-w-md text-right space-y-4">
          {/* Subtitle - Clean minimal style with shadow */}
          <h2
            className="text-lg md:text-2xl font-extrabold tracking-wide uppercase"
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {subtitle}
          </h2>

          {/* Description - Clean and readable with shadow */}
          <p className="text-white/90 text-sm md:text-base font-bold leading-relaxed">
            {description}
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <div className="relative group">
              {/* Button glow effect */}
              <div
                className="absolute inset-0  rounded-xl  opacity-50 group-hover:opacity-75 transition-all duration-300"
                style={{ transform: 'scale(1.05)' }}
              ></div>

              <button
                className="relative px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden"
                style={{
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                <span className="relative flex items-center gap-2">
                  {ctaText}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.1);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-10px) rotate(225deg);
          }
        }

        @keyframes glow-pulse {
          0% {
            opacity: 0.5;
            transform: scaleX(0.8);
          }
          100% {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
