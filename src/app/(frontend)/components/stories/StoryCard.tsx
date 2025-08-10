'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Story } from '../../../../lib/api'
import { StoryCarousel } from './StoryCarousel'
import { InstructionPopup } from './InstructionPopup'
import { useRouter } from 'next/navigation'

interface StoryCardProps {
  story: Story
  index: number
}

export function StoryCard({ story, index }: StoryCardProps) {
  const [showInstructions, setShowInstructions] = useState(false)
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowInstructions(true)
  }

  const handleReady = () => {
    setShowInstructions(false)
    router.push(`/story/${story.slug}`)
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-black/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20 h-full flex flex-col cursor-pointer"
        style={{
          animationDelay: `${index * 0.1}s`,
        }}
      >
        {/* Story Images Carousel */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <StoryCarousel story={story} />
        </div>

        {/* Story Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
            {story.title}
          </h3>

          {/* Description */}
          {story.description && (
            <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
              {story.description}
            </p>
          )}

          {/* Puzzle Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-500/30">
              {story.puzzles?.length} Puzzles
            </span>
            {story.estimatedTime && story.estimatedTime > 0 ? (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                {story.estimatedTime} min
              </span>
            ) : null}
            {story.totalCompletions && story.totalCompletions > 0 ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                {story.totalCompletions} completed
              </span>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            <div className="text-white/50 text-xs">Sebuah Petualangan Puzzle</div>

            <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-lg group-hover:from-pink-600 group-hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg">
              Mulai Bermain 🎮
            </div>
          </div>
        </div>

        {/* Click instruction overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium elementMorph">
            Klik untuk panduan! 📖
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-pink-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none rounded-2xl"></div>
      </div>

      {/* Instruction Popup - Using Portal to render at document.body level */}
      {typeof window !== 'undefined' &&
        showInstructions &&
        createPortal(
          <InstructionPopup
            isOpen={showInstructions}
            onClose={() => setShowInstructions(false)}
            onReady={handleReady}
            storyTitle={story.title}
          />,
          document.body,
        )}
    </>
  )
}
