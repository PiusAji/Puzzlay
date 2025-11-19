'use client'

import { useState, useEffect } from 'react'

interface InstructionPopupProps {
  isOpen: boolean
  onClose: () => void
  onReady?: () => void
  storyTitle?: string
}

export function InstructionPopup({ isOpen, onClose, onReady, storyTitle }: InstructionPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300 overflow-y-auto ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Sparkle animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="sparkle sparkle-1 bg-yellow-400"></div>
        <div className="sparkle sparkle-2 bg-pink-400"></div>
        <div className="sparkle sparkle-3 bg-cyan-400"></div>
        <div className="sparkle sparkle-4 bg-yellow-400"></div>
        <div className="sparkle sparkle-5 bg-pink-400"></div>
        <div className="sparkle sparkle-6 bg-cyan-400"></div>
      </div>

      <div
        className={`relative rounded-xl w-full max-w-2xl bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 p-[1px] elementMorph transition-all duration-300 ${
          isOpen ? 'scale-100 rotate-0' : 'scale-95 rotate-3'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 elementMorph rounded-xl max-h-[90vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full hover:from-pink-500 hover:to-purple-600 transition-all duration-200 z-10 text-lg font-bold"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🧩 Panduan Bermain 🧩
            </h2>
            {storyTitle && (
              <p className="text-gray-600 text-xs sm:text-sm mb-2">&quot;{storyTitle}&quot;</p>
            )}
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto elementMorph"></div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-gray-700 text-sm sm:text-base">
            {/* Game Rules - Updated with new content */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg elementMorph">
              <h3 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                📋 Petunjuk Permainan Puzzle Gambar Berseri
              </h3>
              <ol className="space-y-2 leading-relaxed list-decimal list-inside">
                <li>Pilih Puzzle Gambar Berseri sesuai arahan.</li>
                <li>
                  Permainan dilakukan dengan menggeser potongan puzzle pada layar untuk menemukan
                  posisi yang tepat.
                </li>
                <li>
                  Susun semua potongan puzzle hingga membentuk gambar berseri yang lengkap dan
                  runtut.
                </li>
                <li>
                  Setelah puzzle selesai, amati gambar dengan teliti untuk memahami alur ceritanya.
                </li>
                <li>
                  Ambil kertas tugas yang telah dibagikan guru. Buatlah cerita berdasarkan 1 puzzle
                  gambar berseri yang telah kamu selesaikan.
                </li>
                <li>
                  Tulislah cerita secara runtut sesuai urutan gambar (berisi tokoh, latar, dan alur:
                  awal-tengah-akhir)
                </li>
                <li>Gunakan kalimat yang jelas dan mudah dipahami.</li>
                <li>Periksa kembali tulisanmu sebelum dikumpulkan.</li>
              </ol>
            </div>

            {/* Controls */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg elementMorph">
              <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                🎮 Kontrol Game
              </h3>
              <div className="space-y-2">
                {[
                  ['Klik Kiri', 'Pada potongan puzzle untuk drag & drop 🖱️', 'pink'],
                  ['Klik', 'Pada tombol tengah mouse untuk memutar kamera 🔄', 'purple'],
                  ['Klik Kanan', 'Untuk menggerakkan kamera 📹', 'blue'],
                  ['Shift + Klik', 'Untuk menggerakkan kamera 🎥', 'cyan'],
                ].map(([label, desc, color], i) => (
                  <div className="flex items-start gap-3" key={i}>
                    <span
                      className={`bg-${color}-100 text-${color}-700 px-2 py-1 rounded-full text-xs font-medium elementMorph whitespace-nowrap`}
                    >
                      {label}
                    </span>
                    <span className="flex-1">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg elementMorph">
              <h3 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                💡 Tips
              </h3>
              <p className="text-orange-600">
                Mulai dari sudut dan tepi puzzle terlebih dahulu, lalu isi bagian tengahnya! Selamat
                bermain! 🌟
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition-all duration-300 elementMorph"
            >
              Nanti Dulu 😊
            </button>
            <button
              onClick={onReady}
              className="px-8 py-3 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-white font-semibold rounded-full hover:from-pink-500 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 elementMorph shadow-lg hover:shadow-xl transform hover:scale-105"
              disabled={!onReady}
            >
              Siap Bermain! 🚀
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: bounce 2s infinite;
        }
        .sparkle-1 {
          top: 10%;
          left: 15%;
          animation-delay: 0s;
        }
        .sparkle-2 {
          top: 20%;
          right: 20%;
          animation-delay: 0.3s;
        }
        .sparkle-3 {
          bottom: 30%;
          left: 10%;
          animation-delay: 0.6s;
        }
        .sparkle-4 {
          bottom: 15%;
          right: 15%;
          animation-delay: 0.9s;
        }
        .sparkle-5 {
          top: 50%;
          left: 5%;
          animation-delay: 1.2s;
        }
        .sparkle-6 {
          top: 60%;
          right: 10%;
          animation-delay: 1.5s;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

// Demo wrapper
export default function App() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
      >
        Open Instruction Popup
      </button>

      <InstructionPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onReady={() => {
          alert('Ready to play!')
          setIsOpen(false)
        }}
        storyTitle="Liburan ke Pantai"
      />
    </div>
  )
}
