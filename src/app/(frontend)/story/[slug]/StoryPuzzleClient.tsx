'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
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
  const [isHowToPlayPanelCollapsed, setIsHowToPlayPanelCollapsed] = useState(false)
  const [isDevInfoPanelCollapsed, setIsDevInfoPanelCollapsed] = useState(false)
  const [isTopLeftPanelCollapsed, setIsTopLeftPanelCollapsed] = useState(false)

  const totalPuzzles = story.puzzles.length

  // Auto-hide all panels after 3 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHowToPlayPanelCollapsed(true)
      setIsDevInfoPanelCollapsed(true)
    }, 3000) // 3 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleProgress = useCallback(
    (completedConnections: number, totalConnections: number) => {
      setProgress({ completedConnections, totalConnections })

      // If the puzzle is complete, update the completed set immediately.
      // This is now the single source of truth for puzzle completion.
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

  // This is called by the game component after a delay for animations, but we don't need it for logic.
  const handlePuzzleComplete = useCallback(() => {}, [])

  // A puzzle is solved if its index is in the `completedPuzzles` set.
  const isCurrentPuzzleSolved = useMemo(() => {
    return completedPuzzles.has(currentPuzzleIndex)
  }, [completedPuzzles, currentPuzzleIndex])

  // Auto-unhide top-left panel on puzzle completion
  useEffect(() => {
    if (isCurrentPuzzleSolved) {
      setIsTopLeftPanelCollapsed(false) // Unhide top-left panel
    }
  }, [isCurrentPuzzleSolved]) // Depend only on isCurrentPuzzleSolved

  // Reset local puzzle progress whenever the user navigates to a new puzzle.
  useEffect(() => {
    setProgress({ completedConnections: 0, totalConnections: 0 })
  }, [currentPuzzleIndex])
  // Show top-left panel for 3 seconds when a new puzzle loads
  useEffect(() => {
    setIsTopLeftPanelCollapsed(false) // Unhide immediately on new puzzle load
    const timer = setTimeout(() => {
      setIsTopLeftPanelCollapsed(true) // Re-hide after 3 seconds
    }, 3000)
    return () => clearTimeout(timer)
  }, [currentPuzzleIndex]) // Depend on currentPuzzleIndex for re-evaluation

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < totalPuzzles - 1) {
      setIsTopLeftPanelCollapsed(true) // Hide top-left panel when navigating to next puzzle
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
      {/* Top-left Panel */}
      <div className="absolute top-0 left-0 p-6 text-white bg-gradient-to-br from-black/70 to-black/50 rounded-br-2xl backdrop-blur-sm border-r border-b border-white/20 max-w-md pointer-events-auto">
        <div className="flex justify-between items-center mb-2 gap-2">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {story.title}
          </h1>
          <button
            onClick={() => setIsTopLeftPanelCollapsed(!isTopLeftPanelCollapsed)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
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
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isTopLeftPanelCollapsed
              ? 'max-h-0 opacity-0 pointer-events-none'
              : 'max-h-[500px] opacity-100 pointer-events-auto'
          }`}
        >
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>
                {completedPuzzles.size}/{totalPuzzles}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {allPuzzlesCompleted ? (
            <div className="my-4 p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold text-white drop-shadow-md">
                🏆 Semua Puzzle Selesai!
              </h2>
              <p className="text-white mt-2 text-lg drop-shadow-sm">
                Luar biasa! Kamu telah menyelesaikan semua puzzle dalam cerita ini.
              </p>
              <button
                onClick={handleGoHome}
                className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-400 rounded-lg font-bold text-white transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                Kembali ke Beranda
              </button>
            </div>
          ) : isCurrentPuzzleSolved ? (
            <div className="my-4 p-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold text-white drop-shadow-md">
                🎉 Hore! Puzzle Selesai!
              </h2>
              <p className="text-white mt-2 text-lg drop-shadow-sm">
                Kamu hebat! Yuk, lanjut ke puzzle berikutnya!
              </p>
              <button
                onClick={handleNextPuzzle}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                Next Puzzle <span>→</span>
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl mb-2 flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    completedPuzzles.has(currentPuzzleIndex) ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                Puzzle {currentPuzzle.order}: {currentPuzzle.title}
              </h2>
            </>
          )}

          {!isCurrentPuzzleSolved && !allPuzzlesCompleted && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={handlePrevPuzzle}
                disabled={currentPuzzleIndex === 0}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                <span>←</span> Previous
              </button>
            </div>
          )}
        </div>{' '}
        {/* Closing div for the conditional content wrapper */}
      </div>

      {/* How To Play Panel (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 p-4 bg-black/50 rounded-lg backdrop-blur-sm text-white text-sm max-w-xs pointer-events-auto">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">Cara Bermain:</h4>
          <button
            onClick={() => setIsHowToPlayPanelCollapsed(!isHowToPlayPanelCollapsed)}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
            aria-label={isHowToPlayPanelCollapsed ? 'Perluas panel' : 'Ciutkan panel'}
          >
            {isHowToPlayPanelCollapsed ? (
              <ChevronDownIcon className="h-4 w-4 text-white" />
            ) : (
              <ChevronUpIcon className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
        <ul
          className={`space-y-1 text-xs text-gray-300 transition-all duration-500 ease-in-out overflow-hidden ${
            isHowToPlayPanelCollapsed
              ? 'max-h-0 opacity-0 pointer-events-none'
              : 'max-h-[500px] opacity-100 pointer-events-auto'
          }`}
        >
          <li>• Seret potongan puzzle untuk memindahkannya</li>
          <li>• Akan terdengan suara ketika potongan yang tepat saling terhubung</li>
          <li>• Selesaikan puzzle di area target</li>
        </ul>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        {story.puzzles.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
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

      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 p-2 bg-black/70 rounded text-white text-xs pointer-events-auto">
          <div className="flex justify-between items-center mb-1 gap-2">
            <h4 className="font-semibold">Info Pengembangan:</h4>
            <button
              onClick={() => setIsDevInfoPanelCollapsed(!isDevInfoPanelCollapsed)}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
              aria-label={isDevInfoPanelCollapsed ? 'Perluas panel' : 'Ciutkan panel'}
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
              isDevInfoPanelCollapsed
                ? 'max-h-0 opacity-0 pointer-events-none'
                : 'max-h-[500px] opacity-100 pointer-events-auto'
            }`}
          >
            <div>Saat Ini: {currentPuzzleIndex}</div>
            <div>Set Selesai: {Array.from(completedPuzzles).join(', ')}</div>
            <div>Terpecahkan: {isCurrentPuzzleSolved.toString()}</div>
            <div>Semua Selesai: {allPuzzlesCompleted.toString()}</div>
            <div>
              Progres: {progress.completedConnections}/{progress.totalConnections}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
