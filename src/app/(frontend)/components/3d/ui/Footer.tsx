import React from 'react'
import type { Nav, SiteSettings } from '@/lib/api'
import { Logo } from '../../ui/Logo'

interface FooterProps {
  navigationData: Nav | null | undefined
  siteSettings: SiteSettings | null | undefined
}

export default function Footer({ navigationData, siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-12 bg-gradient-to-br from-zinc-800 via-zinc-900 to-gray-900 text-white overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-pink-400 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute top-1/2 right-10 w-24 h-24 bg-cyan-400 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-lg"></div>
              <Logo
                siteSettings={siteSettings}
                className="w-12 h-12 md:w-14 md:h-14 relative z-10 drop-shadow-xl"
              />
            </div>
            <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              PUZZLAY
            </span>
          </div>

          {/* Copyright & Info */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm text-white/70 text-center md:text-left">
            <span className="flex items-center gap-2">
              © {currentYear} PUZZLAY
              <span className="hidden md:inline text-white/40">•</span>
              <span className="flex items-center gap-1">
                Dibuat dengan <span className="text-pink-400">💖</span> untuk pendidikan
              </span>
            </span>
            <span className="flex items-center gap-2 text-cyan-400/80">
              <span>✨</span>
              Universitas Pendidikan Ganesha
            </span>
          </div>
        </div>
      </div>

      {/* Minimal sparkles */}
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
      <div
        className="absolute top-4 right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-30"
        style={{ animationDelay: '0.5s' }}
      ></div>
    </footer>
  )
}
