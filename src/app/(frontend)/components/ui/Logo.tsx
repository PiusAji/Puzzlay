// components/ui/Logo.tsx
'use client'

import Image from 'next/image'
import { type SiteSettings } from '../../../../lib/api'

interface LogoProps {
  className?: string
  siteSettings?: SiteSettings | null
}

// CLIENT COMPONENT ONLY - Handles its own data fetching after hydration
export function Logo({ className, siteSettings }: LogoProps) {
  return (
    <>
      {/* CSS animations - only inject after client hydration */}
      <style jsx>{`
        @keyframes elementMorph {
          0%,
          100% {
            border-radius: 55% 40% 50% 65% / 50% 30% 70% 55%;
          }
          25% {
            border-radius: 40% 65% 30% 70% / 60% 45% 55% 40%;
          }
          50% {
            border-radius: 65% 30% 70% 40% / 35% 60% 40% 65%;
          }
          75% {
            border-radius: 30% 70% 40% 55% / 65% 35% 70% 45%;
          }
        }
      `}</style>

      <div className={`relative w-32 h-32 group cursor-pointer ${className || ''}`}>
        {/* Organic blob background with matching gradient and morphing animation */}
        <div
          className="absolute inset-1 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/25"
          style={{
            borderRadius: '55% 40% 50% 65% / 50% 30% 70% 55%',
            animation: 'elementMorph 6s ease-in-out infinite',
          }}
        >
          {/* Inner glow effect matching header */}
          <div
            className="absolute inset-3 bg-gradient-to-tr from-purple-300/30 to-transparent"
            style={{
              borderRadius: '55% 40% 50% 65% / 50% 30% 70% 55%',
            }}
          />

          {/* Floating sparkles like header */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-2 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-bounce"
              style={{ animationDelay: '0s', animationDuration: '1.5s' }}
            />
            <div
              className="absolute top-6 right-3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"
              style={{ animationDelay: '0.7s', animationDuration: '2s' }}
            />
            <div
              className="absolute bottom-4 left-2 w-2.5 h-2.5 bg-cyan-300 rounded-full animate-bounce"
              style={{ animationDelay: '1.2s', animationDuration: '1.8s' }}
            />
          </div>
        </div>

        {/* Logo container */}
        <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
          <Image
            src={siteSettings?.logo?.url || '/Puzzlay-Logo.webp'}
            alt={siteSettings?.logo?.alt || siteSettings?.siteName || 'Puzzlay Logo'}
            fill
            className="object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            priority
            onError={() => {
              // Fallback handling if image fails to load
              console.warn('Logo image failed to load')
            }}
          />
        </div>

        {/* Hover effect ring with subtle glow */}
        <div
          className="absolute inset-0 border-2 border-white/0 group-hover:border-white/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/20"
          style={{
            borderRadius: '55% 40% 50% 65% / 50% 30% 70% 55%',
          }}
        />
      </div>
    </>
  )
}

// Remove the LogoServer component entirely - use only the client component
export { Logo as LogoServer }
