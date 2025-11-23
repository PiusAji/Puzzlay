'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Bars3Icon,
  XMarkIcon,
  BookOpenIcon,
} from '@heroicons/react/24/solid'
import { Story, Media } from '@/payload-types'
import { PuzzleGame } from '../../components/3d/game/PuzzleGame'
import { useRouter } from 'next/navigation'
import { useSceneStore } from '../../components/3d/stores/useSceneStore'

interface StoryPuzzleClientProps {
  story: Story
  initialPuzzle: Story['puzzles'][0]
}

export default function StoryPuzzleClient({ story, initialPuzzle }: StoryPuzzleClientProps) {
  const router = useRouter()
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(
    story.puzzles.findIndex((p) => p.id === initialPuzzle.id),
  )
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<number>>(new Set())
  const [allPuzzlesCompleted, setAllPuzzlesCompleted] = useState(false)
  const [progress, setProgress] = useState({
    completedConnections: 0,
    totalConnections: 0,
  })
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false)
  const [isDevInfoPanelCollapsed, setIsDevInfoPanelCollapsed] = useState(false)
  const [isTopLeftPanelCollapsed, setIsTopLeftPanelCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const totalPuzzles = story.puzzles.length

  // Auto-hide desktop panels after 3 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDevInfoPanelCollapsed(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleProgress = useCallback(
    (completedConnections: number, totalConnections: number) => {
      setProgress({ completedConnections, totalConnections })

      if (totalConnections > 0 && completedConnections >= totalConnections) {
        if (!completedPuzzles.has(currentPuzzleIndex)) {
          setCompletedPuzzles((prev) => {
            const newCompleted = new Set(prev)
            newCompleted.add(currentPuzzleIndex)
            if (newCompleted.size === totalPuzzles) {
              setAllPuzzlesCompleted(true)
            }
            return newCompleted
          })
        }
      }
    },
    [currentPuzzleIndex, completedPuzzles, totalPuzzles],
  )

  const handlePuzzleComplete = useCallback(() => {}, [])

  const isCurrentPuzzleSolved = useMemo(() => {
    return completedPuzzles.has(currentPuzzleIndex)
  }, [completedPuzzles, currentPuzzleIndex])

  // Auto-unhide top-left panel on puzzle completion (desktop only)
  // Auto-open mobile menu on puzzle completion (mobile only)
  useEffect(() => {
    if (isCurrentPuzzleSolved) {
      if (window.innerWidth >= 768) {
        setIsTopLeftPanelCollapsed(false)
      } else {
        setIsMobileMenuOpen(true)
      }
    }
  }, [isCurrentPuzzleSolved])

  // Reset local puzzle progress whenever the user navigates to a new puzzle
  useEffect(() => {
    setProgress({ completedConnections: 0, totalConnections: 0 })
    setIsMobileMenuOpen(false) // Close mobile menu on puzzle change
  }, [currentPuzzleIndex])

  // Show top-left panel for 3 seconds when a new puzzle loads (desktop only)
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsTopLeftPanelCollapsed(false)
      const timer = setTimeout(() => {
        setIsTopLeftPanelCollapsed(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentPuzzleIndex])

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < totalPuzzles - 1) {
      setIsTopLeftPanelCollapsed(true)
      setCurrentPuzzleIndex(currentPuzzleIndex + 1)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handlePrevPuzzle = () => {
    const prevIndex = Math.max(currentPuzzleIndex - 1, 0)
    setCurrentPuzzleIndex(prevIndex)
  }

  const currentPuzzle = story.puzzles[currentPuzzleIndex]
  const textureUrl = (currentPuzzle.image as Media)?.url || ''

  const progressPercentage = useMemo(() => {
    if (totalPuzzles === 0) return 0
    return (completedPuzzles.size / totalPuzzles) * 100
  }, [completedPuzzles, totalPuzzles])

  const { setScene } = useSceneStore()

  useEffect(() => {
    setScene(
      <PuzzleGame
        key={currentPuzzleIndex}
        modelUrl="/Puzzle-Story.glb"
        textureUrl={textureUrl}
        onPuzzleComplete={handlePuzzleComplete}
        onProgress={handleProgress}
      />,
      'game',
    )
    return () => setScene(null, 'viewer')
  }, [currentPuzzleIndex, textureUrl, handlePuzzleComplete, handleProgress, setScene])

  return (
    <div className="relative w-full h-screen overflow-hidden pointer-events-none">
      {/* Mobile Hamburger Button - Puzzle Info */}
      {!isHowToPlayOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden absolute top-4 left-4 z-50 p-3 rounded-full bg-gradient-to-br from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-200 pointer-events-auto"
          aria-label="Toggle puzzle info"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </button>
      )}

      {/* Mobile Button - How to Play */}
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsHowToPlayOpen(!isHowToPlayOpen)}
          className="md:hidden absolute bottom-4 left-4 z-50 p-3 rounded-full bg-gradient-to-br from-green-500/80 to-emerald-500/80 hover:from-green-600/90 hover:to-emerald-600/90 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-200 pointer-events-auto"
          aria-label="Toggle instructions"
        >
          {isHowToPlayOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <BookOpenIcon className="h-6 w-6 text-white" />
          )}
        </button>
      )}

      {/* Mobile Overlay for Puzzle Info */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-auto animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Overlay for How to Play */}
      {isHowToPlayOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-auto animate-fadeIn"
          onClick={() => setIsHowToPlayOpen(false)}
        />
      )}

      {/* Main Panel - Puzzle Info & Progress (Responsive Sidebar/Overlay) */}
      <div
        className={`
        absolute top-0 left-0 text-white bg-gradient-to-br from-black/95 to-black/80 backdrop-blur-lg border-r border-b border-white/20 pointer-events-auto z-40
        md:rounded-br-2xl md:max-w-md md:p-6
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        max-md:h-screen max-md:w-[85vw] max-md:max-w-sm max-md:overflow-y-auto max-md:shadow-2xl max-md:pt-20 max-md:px-6 max-md:pb-6
      `}
      >
        <div className="flex justify-between items-center mb-4 gap-2 pr-12 md:pr-0">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {story.title}
          </h1>
          <button
            onClick={() => setIsTopLeftPanelCollapsed(!isTopLeftPanelCollapsed)}
            className="hidden md:block p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex-shrink-0"
            aria-label={isTopLeftPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {isTopLeftPanelCollapsed ? (
              <ChevronDownIcon className="h-5 w-5 text-white" />
            ) : (
              <ChevronUpIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        <div
          className={`md:transition-all md:duration-500 md:ease-in-out md:overflow-hidden ${
            isTopLeftPanelCollapsed
              ? 'md:max-h-0 md:opacity-0 md:pointer-events-none'
              : 'md:max-h-[500px] md:opacity-100 md:pointer-events-auto'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Progress</span>
              <span className="font-bold">
                {completedPuzzles.size}/{totalPuzzles}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Puzzle Status Messages */}
          {allPuzzlesCompleted ? (
            <div className="my-4 p-5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-xl text-center border border-purple-400/50">
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                🏆 Semua Puzzle Selesai!
              </h2>
              <p className="text-white mt-3 text-base md:text-lg drop-shadow-sm">
                Luar biasa! Kamu telah menyelesaikan semua puzzle dalam cerita ini.
              </p>
              <button
                onClick={handleGoHome}
                className="mt-5 px-8 py-3 bg-green-500 hover:bg-green-400 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
              >
                Kembali ke Beranda
              </button>
            </div>
          ) : isCurrentPuzzleSolved ? (
            <div className="my-4 p-5 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-xl text-center border border-green-300/50">
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                🎉 Hore! Puzzle Selesai!
              </h2>
              <p className="text-white mt-3 text-base md:text-lg drop-shadow-sm">
                Kamu hebat! Yuk, lanjut ke puzzle berikutnya!
              </p>
              <button
                onClick={handleNextPuzzle}
                className="mt-5 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
              >
                Next Puzzle <span>→</span>
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg md:text-xl mb-4 flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                <span
                  className={`w-4 h-4 rounded-full flex-shrink-0 ${
                    completedPuzzles.has(currentPuzzleIndex)
                      ? 'bg-green-500'
                      : 'bg-yellow-500 animate-pulse'
                  }`}
                />
                <span className="font-semibold">
                  Puzzle {currentPuzzle.order}: {currentPuzzle.title}
                </span>
              </h2>
            </>
          )}

          {/* Navigation Buttons */}
          {!isCurrentPuzzleSolved && !allPuzzlesCompleted && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={handlePrevPuzzle}
                disabled={currentPuzzleIndex === 0}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
              >
                <span>←</span> Previous
              </button>
            </div>
          )}
        </div>
      </div>

      {/* How To Play Panel - Separate for Mobile & Desktop */}
      {/* Mobile Version - Bottom Slide Up */}
      <div
        className={`
        md:hidden fixed bottom-0 left-0 right-0 text-white bg-gradient-to-t from-black/95 to-black/85 backdrop-blur-lg border-t border-white/20 pointer-events-auto z-[60] rounded-t-3xl shadow-2xl
        transition-transform duration-300 ease-in-out pb-20
        ${isHowToPlayOpen ? 'translate-y-0' : 'translate-y-full'}
      `}
      >
        <div className="p-6">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsHowToPlayOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
            aria-label="Close instructions"
          >
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>

          <div className="flex items-center gap-3 mb-4 pr-12">
            <span className="text-2xl">📖</span>
            <h4 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Cara Bermain
            </h4>
          </div>

          <ul className="space-y-4 text-base">
            <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
              <span className="text-green-400 flex-shrink-0 text-xl">•</span>
              <span>Seret potongan puzzle untuk memindahkannya</span>
            </li>
            <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
              <span className="text-green-400 flex-shrink-0 text-xl">•</span>
              <span>Akan terdengar suara ketika potongan yang tepat saling terhubung</span>
            </li>
            <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
              <span className="text-green-400 flex-shrink-0 text-xl">•</span>
              <span>Selesaikan puzzle di area target</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Desktop Version - Bottom Right */}
      <div className="hidden md:block absolute bottom-4 right-4 p-4 bg-black/70 rounded-lg backdrop-blur-sm text-white text-sm max-w-xs pointer-events-auto border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📖</span>
          <h4 className="font-semibold">Cara Bermain:</h4>
        </div>
        <ul className="space-y-2 text-xs text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 flex-shrink-0">•</span>
            <span>Seret potongan puzzle untuk memindahkannya</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 flex-shrink-0">•</span>
            <span>Akan terdengar suara ketika potongan yang tepat saling terhubung</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 flex-shrink-0">•</span>
            <span>Selesaikan puzzle di area target</span>
          </li>
        </ul>
      </div>

      {/* Puzzle Progress Indicators - Top Right */}
      <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto">
        {story.puzzles.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-300 ${
              completedPuzzles.has(index)
                ? 'bg-green-500 border-green-400 shadow-green-400/50 shadow-lg'
                : index === currentPuzzleIndex
                  ? 'bg-yellow-500 border-yellow-400 shadow-yellow-400/50 shadow-lg animate-pulse'
                  : 'bg-gray-600 border-gray-500'
            }`}
            title={`Puzzle ${index + 1}: ${story.puzzles[index].title}`}
          />
        ))}
      </div>

      {/* Dev Info Panel - Bottom Left (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="hidden md:block absolute bottom-4 left-4 p-3 bg-black/80 rounded-lg text-white text-xs pointer-events-auto backdrop-blur-sm border border-white/10">
          <div className="flex justify-between items-center mb-2 gap-2">
            <h4 className="font-semibold">Dev Info:</h4>
            <button
              onClick={() => setIsDevInfoPanelCollapsed(!isDevInfoPanelCollapsed)}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
              aria-label={isDevInfoPanelCollapsed ? 'Expand' : 'Collapse'}
            >
              {isDevInfoPanelCollapsed ? (
                <ChevronDownIcon className="h-4 w-4 text-white" />
              ) : (
                <ChevronUpIcon className="h-4 w-4 text-white" />
              )}
            </button>
          </div>
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isDevInfoPanelCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
            }`}
          >
            <div>Current: {currentPuzzleIndex}</div>
            <div>Completed: {Array.from(completedPuzzles).join(', ')}</div>
            <div>Solved: {isCurrentPuzzleSolved.toString()}</div>
            <div>All Done: {allPuzzlesCompleted.toString()}</div>
            <div>
              Progress: {progress.completedConnections}/{progress.totalConnections}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
