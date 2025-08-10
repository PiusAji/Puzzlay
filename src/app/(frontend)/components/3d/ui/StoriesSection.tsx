'use client'

import { Bounded } from '../../Bounded'
import { type Story } from '../../../../../lib/api'
import { StoryCard } from './StoryCard'

interface StoriesSectionProps {
  className?: string
  stories: Story[]
}

export function StoriesSection({ className = '', stories }: StoriesSectionProps) {
  if (!stories || stories.length === 0) {
    return (
      <div className={`${className}`}>
        <Bounded>
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">No Stories Found</h3>
              <p className="text-white/70 mb-4">No stories available at the moment.</p>
              <div className="text-sm text-white/50">
                <p>To fix this:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Go to your Payload CMS admin panel</li>
                  <li>Navigate to Stories collection</li>
                  <li>Edit your story and set Status to &quot;Published&quot;</li>
                  <li>Make sure each story has exactly 3 puzzles with images</li>
                </ol>
              </div>
            </div>
          </div>
        </Bounded>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <Bounded>
        <div className="py-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Puzzle Stories</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Embark on interactive puzzle adventures. Each story contains 3 unique puzzles that
              challenge your mind and creativity.
            </p>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              View All Stories
            </button>
          </div>
        </div>
      </Bounded>
    </div>
  )
}
