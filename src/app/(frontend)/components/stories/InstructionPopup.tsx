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
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
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
        className={`relative max-w-lg w-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 p-1 elementMorph transition-all duration-300 ${
          isOpen ? 'scale-100 rotate-0' : 'scale-95 rotate-3'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner content container */}
        <div className="bg-white/95 backdrop-blur-sm p-6 elementMorph">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full hover:from-pink-500 hover:to-purple-600 transition-all duration-200 elementMorph z-10 text-lg font-bold"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🧩 Panduan Bermain 🧩
            </h2>
            {storyTitle && <p className="text-gray-600 text-sm mb-2">&quot;{storyTitle}&quot;</p>}
            <div className="h-1 w-20 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto elementMorph"></div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-gray-700">
            {/* Game Rules */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 elementMorph">
              <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                📋 Cara Bermain
              </h3>
              <p className="text-sm leading-relaxed">
                Selesaikan puzzle berurut dari puzzle pertama sampai puzzle ke-3. Semua puzzle
                memiliki 9 potongan. Hubungkan semua potongan untuk menyelesaikan puzzlenya! 🎯
              </p>
            </div>

            {/* Controls */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 elementMorph">
              <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                🎮 Kontrol Game
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium elementMorph">
                    Klik Kiri
                  </span>
                  <span className="flex-1">Pada potongan puzzle untuk drag & drop 🖱️</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium elementMorph">
                    Klik Kiri
                  </span>
                  <span className="flex-1">Pada area kosong untuk putar kamera 🔄</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium elementMorph">
                    Klik Kanan
                  </span>
                  <span className="flex-1">Untuk menggerakkan kamera 📹</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full text-xs font-medium elementMorph">
                    Shift + Klik
                  </span>
                  <span className="flex-1">Untuk menggerakkan kamera 🎥</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 elementMorph">
              <h3 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                💡 Tips
              </h3>
              <p className="text-sm text-orange-600">
                Mulai dari sudut dan tepi puzzle terlebih dahulu, lalu isi bagian tengahnya! Selamat
                bermain! 🌟
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-3 justify-center">
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
