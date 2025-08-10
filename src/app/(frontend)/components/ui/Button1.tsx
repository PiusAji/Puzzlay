import React from 'react'

interface Button1Props {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'success' | 'warning'
}

export default function Button1({
  children,
  onClick,
  className = '',
  disabled = false,
  size = 'md',
  variant = 'primary',
}: Button1Props) {
  // Size configurations with more breathing room for blob animation
  const sizeClasses = {
    sm: 'px-6 py-4 text-sm min-w-24 h-14',
    md: 'px-8 py-5 text-base min-w-28 h-16',
    lg: 'px-10 py-6 text-lg min-w-36 h-20',
  }

  // Variant color schemes
  const variantColors = {
    primary: 'from-pink-400 via-purple-500 to-blue-500',
    secondary: 'from-green-400 via-teal-500 to-cyan-500',
    success: 'from-emerald-400 via-green-500 to-teal-500',
    warning: 'from-yellow-400 via-orange-500 to-red-500',
  }

  const variantShadows = {
    primary: 'group-hover:shadow-purple-500/25',
    secondary: 'group-hover:shadow-teal-500/25',
    success: 'group-hover:shadow-green-500/25',
    warning: 'group-hover:shadow-orange-500/25',
  }

  const variantGlows = {
    primary: 'from-purple-300/30',
    secondary: 'from-teal-300/30',
    success: 'from-green-300/30',
    warning: 'from-orange-300/30',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${sizeClasses[size]} ${className}`}
    >
      {/* Morphing blob background with extra space */}
      <div
        className={`absolute inset-1 bg-gradient-to-br ${variantColors[variant]} shadow-xl ${variantShadows[variant]} transition-all duration-300`}
        style={{
          borderRadius: '45% 55% 60% 40% / 55% 45% 40% 60%',
          animation: disabled ? 'none' : 'elementMorph 4s ease-in-out infinite',
        }}
      >
        {/* Inner glow effect */}
        <div
          className={`absolute inset-3 bg-gradient-to-tr ${variantGlows[variant]} to-transparent`}
          style={{
            borderRadius: '45% 55% 60% 40% / 55% 45% 40% 60%',
          }}
        />

        {/* Floating sparkles */}
        {!disabled && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1 left-2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce opacity-70"
              style={{ animationDelay: '0s', animationDuration: '1.5s' }}
            />
            <div
              className="absolute top-2 right-1 w-1 h-1 bg-white/60 rounded-full animate-bounce"
              style={{ animationDelay: '0.5s', animationDuration: '2s' }}
            />
            <div
              className="absolute bottom-1 left-1 w-2 h-2 bg-cyan-300/80 rounded-full animate-bounce opacity-60"
              style={{ animationDelay: '1s', animationDuration: '1.8s' }}
            />
          </div>
        )}
      </div>

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-2 text-white font-bold drop-shadow-lg transition-all duration-300 group-hover:scale-105 group-active:scale-95">
        {children}
      </div>

      {/* Hover ring effect */}
      <div
        className="absolute inset-1 border-2 border-white/0 group-hover:border-white/30 transition-all duration-300"
        style={{
          borderRadius: '45% 55% 60% 40% / 55% 45% 40% 60%',
        }}
      />

      {/* Click ripple effect */}
      <div
        className="absolute inset-1 bg-white/0 group-active:bg-white/10 transition-all duration-150"
        style={{
          borderRadius: '45% 55% 60% 40% / 55% 45% 40% 60%',
        }}
      />
    </button>
  )
}
