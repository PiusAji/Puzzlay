'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Story, Media } from '@/payload-types'
import { PuzzleGame } from '../../components/3d/game/PuzzleGame'
import { useRouter } from 'next/navigation'
import { useSceneStore } from '../../components/3d/stores/useSceneStore'

interface StoryPuzzleClientProps {
  story: Story
}

export default function StoryPuzzleClient({ story }: StoryPuzzleClientProps) {
  const router = useRouter()
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<number>>(new Set())
  const [allPuzzlesCompleted, setAllPuzzlesCompleted] = useState(false)
  const [progress, setProgress] = useState({
    completedConnections: 0,
    totalConnections: 0,
  })

  const totalPuzzles = story.puzzles.length

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

  // Reset local puzzle progress whenever the user navigates to a new puzzle.
  useEffect(() => {
    setProgress({ completedConnections: 0, totalConnections: 0 })
  }, [currentPuzzleIndex])

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < totalPuzzles - 1) {
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
      <div className="absolute top-0 left-0 p-6 text-white bg-gradient-to-br from-black/70 to-black/50 rounded-br-2xl backdrop-blur-sm border-r border-b border-white/20 max-w-md pointer-events-auto">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          {story.title}
        </h1>

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
      </div>

      <div className="absolute bottom-4 right-4 p-4 bg-black/50 rounded-lg backdrop-blur-sm text-white text-sm max-w-xs pointer-events-auto">
        <h4 className="font-semibold mb-2">How to Play:</h4>
        <ul className="space-y-1 text-xs text-gray-300">
          <li>• Drag puzzle pieces to move them</li>
          <li>• Pieces glow yellow when near their partner</li>
          <li>• Connected pieces glow green and move together</li>
          <li>• Complete the puzzle in the target area</li>
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
          <div>Current: {currentPuzzleIndex}</div>
          <div>Completed Set: {Array.from(completedPuzzles).join(', ')}</div>
          <div>Solved: {isCurrentPuzzleSolved.toString()}</div>
          <div>All Done: {allPuzzlesCompleted.toString()}</div>
          <div>
            Progress: {progress.completedConnections}/{progress.totalConnections}
          </div>
        </div>
      )}
    </div>
  )
}
