import type { Nav } from '@/lib/api'
import { useState } from 'react'

interface HeaderProps {
  navigationData: Nav | null | undefined
}

export default function Header({ navigationData }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!navigationData) {
    return null
  }

  return (
    <>
      {/* DESKTOP VERSION */}
      <div className="hidden md:block relative w-fit min-w-96 h-40">
        {/* Main bouncy blob with animation */}
        <div
          className="absolute inset-2 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 shadow-2xl animate-pulse"
          style={{
            borderRadius: '40% 60% 70% 30% / 50% 60% 40% 50%',
            animation: 'elementMorph 4s ease-in-out infinite',
          }}
        >
          {/* Floating sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-4 left-8 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"
              style={{ animationDelay: '0s', animationDuration: '1.5s' }}
            />
            <div
              className="absolute top-8 right-12 w-2 h-2 bg-pink-300 rounded-full animate-bounce"
              style={{ animationDelay: '0.5s', animationDuration: '2s' }}
            />
            <div
              className="absolute bottom-6 left-16 w-4 h-4 bg-cyan-300 rounded-full animate-bounce"
              style={{ animationDelay: '1s', animationDuration: '1.8s' }}
            />
            <div
              className="absolute bottom-8 right-8 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: '1.5s', animationDuration: '1.3s' }}
            />
          </div>

          {/* Inner magical glow */}
          <div
            className="absolute inset-4 bg-gradient-to-tr from-white/30 to-transparent"
            style={{
              borderRadius: '40% 60% 70% 30% / 50% 60% 40% 50%',
            }}
          />
        </div>

        {/* Navigation with fun interactions */}
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <nav>
            <ul className="flex items-center gap-8 text-white font-bold text-2xl">
              {navigationData.navItems?.map((item, index) => (
                <li key={item.label} className="relative">
                  <div className="group cursor-pointer transform transition-all duration-300 hover:scale-110">
                    {/* Fun emoji icons for each menu item */}
                    <div className="flex items-center gap-2 p-3 rounded-2xl hover:bg-white/20 transition-all duration-300">
                      <span className="text-2xl animate-pulse">
                        {index === 0 ? '🏠' : index === 1 ? '🧩' : index === 2 ? '🎮' : '⭐'}
                      </span>
                      <span className="hover:text-yellow-200 transition-colors duration-300 drop-shadow-lg">
                        {item.label}
                      </span>
                    </div>

                    {/* Super fun dropdown with bouncy animations */}
                    {item.subItems && item.subItems.length > 0 && (
                      <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-y-2"
                        style={{ zIndex: 9999 }}
                      >
                        <div
                          className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 text-white p-6 shadow-2xl border-4 border-white/30 whitespace-nowrap transform rotate-1 hover:rotate-0 transition-transform duration-300"
                          style={{
                            borderRadius: '25% 75% 25% 75% / 75% 25% 75% 25%',
                          }}
                        >
                          {/* Magic wand pointer */}
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">
                            🪄
                          </div>

                          {/* Floating hearts around dropdown */}
                          <div className="absolute -top-2 -left-2 text-pink-300 animate-ping">
                            💖
                          </div>
                          <div className="absolute -top-3 -right-1 text-yellow-300 animate-pulse">
                            ⭐
                          </div>
                          <div className="absolute -bottom-2 -left-3 text-blue-300 animate-bounce">
                            💫
                          </div>

                          <div className="relative z-10">
                            <div className="font-bold mb-4 text-yellow-100 text-center text-xl">
                              🌟 {item.label} Fun! 🌟
                            </div>
                            {item.subItems.map((subItem, subIndex) => (
                              <div
                                key={subItem.label}
                                className="py-3 px-4 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 hover:translate-x-2 mb-2 border-2 border-transparent hover:border-white/40"
                                style={{
                                  animationDelay: `${subIndex * 100}ms`,
                                  background: `linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                                }}
                              >
                                <a
                                  href={subItem.url || '#'}
                                  className="flex items-center gap-3 text-white hover:text-yellow-200 font-semibold"
                                >
                                  <span className="text-xl">
                                    {subIndex === 0
                                      ? '🎯'
                                      : subIndex === 1
                                        ? '🚀'
                                        : subIndex === 2
                                          ? '🎨'
                                          : '🎪'}
                                  </span>
                                  {subItem.label}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* MOBILE VERSION */}
      <div className="md:hidden relative">
        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            borderRadius: '60% 40% 70% 30% / 40% 60% 30% 70%',
          }}
        >
          {/* Sparkle on hamburger */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />

          {/* Animated hamburger/close icon */}
          <div className="flex flex-col items-center justify-center h-full">
            {mobileMenuOpen ? (
              <span className="text-2xl animate-spin">❌</span>
            ) : (
              <span className="text-2xl animate-bounce">🍔</span>
            )}
          </div>
        </button>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="absolute top-20 left-4 right-4 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-3xl shadow-2xl p-8 transform transition-all duration-500 overflow-hidden"
              style={{
                borderRadius: '30% 70% 30% 70% / 70% 30% 70% 30%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile sparkles */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-300 rounded-full animate-bounce" />
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-300 rounded-full animate-pulse" />

              <nav className="max-w-xs mx-auto">
                <ul className="space-y-3">
                  {navigationData.navItems?.map((item, index) => (
                    <li key={item.label}>
                      <div className="text-white">
                        {/* Main menu item */}
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                          <span className="text-2xl flex-shrink-0">
                            {index === 0 ? '🏠' : index === 1 ? '🧩' : index === 2 ? '🎮' : '⭐'}
                          </span>
                          <span className="font-bold text-lg truncate">{item.label}</span>
                        </div>

                        {/* Sub items */}
                        {item.subItems && item.subItems.length > 0 && (
                          <div className="ml-6 mt-2 space-y-1">
                            {item.subItems.map((subItem, subIndex) => (
                              <a
                                key={subItem.label}
                                href={subItem.url || '#'}
                                className="flex items-center gap-2 p-2 rounded-xl bg-white/5 text-purple-100 hover:bg-white/15 hover:text-white transition-all duration-300 text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <span className="text-base flex-shrink-0">
                                  {subIndex === 0
                                    ? '🎯'
                                    : subIndex === 1
                                      ? '🚀'
                                      : subIndex === 2
                                        ? '🎨'
                                        : '🎪'}
                                </span>
                                <span className="truncate">{subItem.label}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
