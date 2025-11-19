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
    <footer className="relative lg:mt-20 bg-gradient-to-br from-zinc-800 via-zinc-900 to-gray-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-36 h-36 bg-purple-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative z-50 container mx-auto px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <Logo
                siteSettings={siteSettings}
                className="w-20 h-20 md:w-24 md:h-24 relative z-[9999] drop-shadow-2xl pointer-events-auto"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              PUZZLAY
            </h3>
            <p className="text-white/80 text-center md:text-left leading-relaxed">
              Media puzzle digital gambar berseri untuk meningkatkan keterampilan menulis narasi
              peserta didik.
            </p>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col items-center">
            <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Menu Utama
            </h4>
            {navigationData?.navItems && (
              <nav>
                <ul className="space-y-3">
                  {navigationData.navItems.map((item) => (
                    <li key={item.label}>
                      <a
                        href="#stories-section"
                        className="group flex items-center justify-center gap-2 text-white/90 hover:text-white transition-all duration-300 cursor-pointer relative z-[9999]"
                        style={{ pointerEvents: 'auto' }}
                        onClick={(e) => {
                          e.preventDefault()
                          document
                            .getElementById('stories-section')
                            ?.scrollIntoView({ behavior: 'smooth' })
                        }}
                      >
                        <span className="w-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-4 transition-all duration-300"></span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {item.label}
                        </span>
                        <span className="text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          ✨
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          {/* Research Info Section */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Profil Pengembang
            </h4>
            <div className="space-y-4 text-white/80">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300">
                <p className="text-sm font-semibold text-purple-300 mb-1">Judul Penelitian:</p>
                <p className="text-sm leading-relaxed">
                  Pengembangan Media Puzzle Digital Gambar Berseri untuk Meningkatkan Keterampilan
                  Menulis Narasi Peserta Didik Kelas V Sekolah Dasar
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-pink-400/30 transition-all duration-300">
                <p className="text-sm font-semibold text-pink-300 mb-2">Penyusun:</p>
                <p className="text-sm">Angel Veranita Sari Tupen</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                <p className="text-sm font-semibold text-cyan-300 mb-2">Pembimbing:</p>
                <p className="text-sm">Prof. Dr. Ida Bagus Putrayasa, M.Pd.</p>
                <p className="text-sm">Prof. Dr. I Nyoman Sudiana, M.Pd.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p className="flex items-center gap-2">
            <span>© {currentYear} PUZZLAY.</span>
            <span className="hidden md:inline">•</span>
            <span>Dikembangkan dengan</span>
            <span className="text-pink-400 animate-pulse">💖</span>
            <span>untuk pendidikan</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-400">✨</span>
            <span>Universitas Pendidikan Ganesha</span>
          </p>
        </div>
      </div>

      {/* Decorative sparkles */}
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-40"></div>
      <div
        className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-40"
        style={{ animationDelay: '0.5s' }}
      ></div>
      <div className="absolute bottom-1/2 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-30"></div>
      <div
        className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-30"
        style={{ animationDelay: '1s' }}
      ></div>
    </footer>
  )
}
