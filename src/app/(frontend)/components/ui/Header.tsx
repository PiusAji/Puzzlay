'use client'

import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { ProfileCard } from './ProfileCard'

interface HeaderProps {
  navigationData?: any
  siteSettings?: any
}

// Info Popup with Tabs
function InfoPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'tujuan' | 'pengembang'>('tujuan')

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[95vw] bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 p-1 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-red-400 to-pink-500 text-white rounded-full font-bold text-base md:text-lg shadow-lg hover:from-red-500 hover:to-pink-600 transition-all duration-300 hover:rotate-90 hover:scale-110 z-20"
          >
            ✕
          </button>

          {/* Tab Navigation */}
          <div className="flex border-b-4 border-purple-200 bg-white/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('tujuan')}
              className={`flex-1 py-3 md:py-4 px-3 md:px-6 font-black text-sm md:text-lg transition-all duration-300 relative ${
                activeTab === 'tujuan'
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
                  : 'text-gray-600 hover:bg-purple-100'
              }`}
            >
              <span className="flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap">
                <span className="text-base md:text-xl">🎯</span>
                <span className="hidden sm:inline">Tujuan Pembelajaran</span>
                <span className="sm:hidden">Tujuan</span>
              </span>
              {activeTab === 'tujuan' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pengembang')}
              className={`flex-1 py-3 md:py-4 px-3 md:px-6 font-black text-sm md:text-lg transition-all duration-300 relative ${
                activeTab === 'pengembang'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                  : 'text-gray-600 hover:bg-blue-100'
              }`}
            >
              <span className="flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap">
                <span className="text-base md:text-xl">👨‍💻</span>
                <span className="hidden sm:inline">Profil Pengembang</span>
                <span className="sm:hidden">Profil</span>
              </span>
              {activeTab === 'pengembang' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-300"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div
            className="p-6 md:p-10 overflow-y-auto max-h-[calc(90vh-80px)]"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db transparent',
            }}
          >
            {activeTab === 'tujuan' ? (
              <div className="space-y-6">
                {/* Tujuan Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-4 border-purple-300 shadow-xl">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      <span className="font-bold">1.</span> Peserta didik mampu menggali dan
                      mengembangkan gagasan, baik dari hasil pengamatan terhadap gambar puzzle,
                      pengalaman, maupun imajinasi, untuk dijadikan dasar penulisan narasi
                      sederhana.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      <span className="font-bold">2.</span> Peserta didik mampu menulis teks narasi
                      sederhana berdasarkan gambar berseri dengan memperhatikan unsur awal, tengah,
                      dan akhir cerita.elemen intrinsik seperti tokoh, latar, dan alur dialog untuk
                      menarik pembaca.
                    </p>
                  </div>
                </div>

                {/* Content Grid - 2 Cards */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  {/* Card 1 */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white rounded-2xl p-8 shadow-xl border-4 border-pink-300 transform transition-all duration-300 hover:scale-105">
                      <div className="text-6xl mb-6 text-center">🎨</div>
                      <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">
                        Kreativitas & Imajinasi
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        Mengembangkan kemampuan berpikir kreatif anak melalui penyusunan puzzle
                        gambar berseri dan pembuatan cerita yang imajinatif.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white rounded-2xl p-8 shadow-xl border-4 border-blue-300 transform transition-all duration-300 hover:scale-105">
                      <div className="text-6xl mb-6 text-center">🧠</div>
                      <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                        Kemampuan Berpikir Logis
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        Melatih kemampuan pemecahan masalah dan berpikir logis dalam menyusun urutan
                        gambar yang benar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pengembang Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Profil Pengembang
                  </h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* Research Info */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border-4 border-cyan-300 shadow-xl mb-8">
                  <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
                    📚 Judul Penelitian:
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Pengembangan Media Puzzle Digital Gambar Berseri untuk Meningkatkan Keterampilan
                    Menulis Narasi Peserta Didik Kelas V Sekolah Dasar
                  </p>
                </div>

                {/* Profile Cards */}
                <div className="space-y-6">
                  {/* Penyusun */}
                  <div>
                    <h3 className="text-2xl font-bold text-purple-700 mb-4">Penyusun:</h3>
                    <ProfileCard
                      name="Angel Veranita Sari Tupen"
                      role="Peneliti"
                      imageUrl="https://avatar.iran.liara.run/public/girl"
                    />
                  </div>

                  {/* Pembimbing */}
                  <div>
                    <h3 className="text-2xl font-bold text-blue-700 mb-4">Pembimbing:</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <ProfileCard
                        name="Prof. Dr. Ida Bagus Putrayasa, M.Pd."
                        role="Pembimbing 1"
                        imageUrl="https://avatar.iran.liara.run/public/boy"
                      />
                      <ProfileCard
                        name="Prof. Dr. I Nyoman Sudiana, M.Pd."
                        role="Pembimbing 2"
                        imageUrl="https://avatar.iran.liara.run/public/boy?username=nyoman"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Nav Button Component
function NavButton({
  label,
  icon,
  color,
  onClick,
}: {
  label: string
  icon: string
  color: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="group relative overflow-hidden rounded-2xl">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-all duration-300`}
      ></div>

      <div
        className={`relative bg-gradient-to-r ${color} rounded-2xl p-[3px] shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110`}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 md:px-6 md:py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl group-hover:scale-110 transition-all duration-300">
              {icon}
            </span>
            <span className="hidden md:block font-black text-sm md:text-base bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </div>
    </button>
  )
}

// Hamburger Menu
function HamburgerMenu({
  isOpen,
  onToggle,
  onHomeClick,
  onPuzzleClick,
  onInfoClick,
}: {
  isOpen: boolean
  onToggle: () => void
  onHomeClick: () => void
  onPuzzleClick: () => void
  onInfoClick: () => void
}) {
  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={onToggle}
        className="relative w-14 h-14 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
          ></span>
          <span
            className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
          ></span>
          <span
            className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
          ></span>
        </div>
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <>
          {/* Menu */}
          <div className="absolute top-16 left-0 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 p-1 rounded-2xl shadow-2xl z-50 min-w-[220px]">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
              <button
                onClick={() => {
                  onHomeClick()
                  onToggle()
                }}
                className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 transition-all duration-300 border-b-2 border-purple-200"
              >
                <span className="text-2xl">🏠</span>
                <span className="font-bold text-orange-700">Home</span>
              </button>
              <button
                onClick={() => {
                  onPuzzleClick()
                  onToggle()
                }}
                className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300 border-b-2 border-purple-200"
              >
                <span className="text-2xl">🎮</span>
                <span className="font-bold text-purple-700">Puzzle</span>
              </button>
              <button
                onClick={() => {
                  onInfoClick()
                  onToggle()
                }}
                className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 transition-all duration-300"
              >
                <span className="text-2xl">ℹ️</span>
                <span className="font-bold text-blue-700">Info</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function Header({ siteSettings }: HeaderProps) {
  const [showInfoPopup, setShowInfoPopup] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showHamburger, setShowHamburger] = useState(false)
  const [showHeader, setShowHeader] = useState(false)

  useEffect(() => {
    // Show header after 13 seconds
    const timer = setTimeout(() => {
      setShowHeader(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScrollToPuzzle = () => {
    document.getElementById('stories-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${!showHeader ? 'opacity-0 pointer-events-none' : showInfoPopup ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="pt-8 md:pt-3 py-3 md:py-4 px-4 md:px-8">
          <div className="relative">
            {/* Full Navigation */}
            <div
              className={`transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}
            >
              <div className="flex items-center justify-center gap-3 md:gap-8">
                {/* Left Nav Item */}
                <NavButton
                  label="Puzzle"
                  icon="🎮"
                  color="from-pink-400 to-purple-500"
                  onClick={handleScrollToPuzzle}
                />

                {/* Centered Logo */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-60 animate-pulse"></div>
                  <Logo
                    siteSettings={siteSettings}
                    className="w-14 h-14 md:w-20 md:h-20 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Orbiting dots */}
                  <div
                    className="absolute inset-0 animate-spin"
                    style={{ animationDuration: '3s' }}
                  >
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full -translate-x-1/2 shadow-lg"></div>
                  </div>
                  <div
                    className="absolute inset-0 animate-spin"
                    style={{ animationDuration: '4s', animationDirection: 'reverse' }}
                  >
                    <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 shadow-lg"></div>
                  </div>
                </div>

                {/* Right Nav Item */}
                <NavButton
                  label="Info"
                  icon="ℹ️"
                  color="from-cyan-400 to-blue-500"
                  onClick={() => setShowInfoPopup(true)}
                />
              </div>
            </div>

            {/* Hamburger Menu (appears on scroll) - positioned absolute on same row */}
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-95'}`}
            >
              <HamburgerMenu
                isOpen={showHamburger}
                onToggle={() => setShowHamburger(!showHamburger)}
                onHomeClick={handleScrollToTop}
                onPuzzleClick={handleScrollToPuzzle}
                onInfoClick={() => setShowInfoPopup(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Popup */}
      <InfoPopup isOpen={showInfoPopup} onClose={() => setShowInfoPopup(false)} />
    </>
  )
}
