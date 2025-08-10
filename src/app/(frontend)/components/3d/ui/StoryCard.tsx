'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { type Story, apiUtils } from '../../../../../lib/api'

interface StoryCardProps {
  story: Story
}

export function StoryCard({ story }: StoryCardProps) {
  const autoplayRef = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false,
    },
    [autoplayRef.current],
  )

  useEffect(() => {
    if (emblaApi) {
      // Optional: Add event listeners for carousel events
      emblaApi.on('select', () => {
        // Handle slide change if needed
      })
    }
  }, [emblaApi])

  const handleCardClick = () => {
    // Navigate to story detail page
    console.log('Navigate to story:', story.slug)
    // You can implement navigation here later
  }

  return (
    <div
      className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Carousel */}
      <div className="relative h-48 overflow-hidden">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {story.puzzles.map((puzzle, index) => (
              <div key={puzzle.id || index} className="embla__slide flex-none w-full">
                <div className="relative h-48">
                  <Image
                    src={
                      apiUtils.getSizedImageUrl(puzzle.image, 'card') ||
                      'https://via.placeholder.com/400x300/6b7280/ffffff?text=Puzzle+' +
                        puzzle.order
                    }
                    alt={puzzle.title}
                    layout="fill"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Puzzle overlay info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Puzzle {puzzle.order}</p>
                      <p className="text-xs opacity-90">{puzzle.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {story.puzzles.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/50 transition-all duration-300"
            />
          ))}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Story Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors duration-300">
          {story.title}
        </h3>

        {/* Story Description */}
        <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
          {story.description}
        </p>

        {/* Story Stats */}
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {story.estimatedTime ? `${story.estimatedTime}min` : 'N/A'}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {story.totalCompletions || 0} completed
            </span>
          </div>
          <span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full text-xs">
            {story.puzzles.length} puzzles
          </span>
        </div>
      </div>
    </div>
  )
}
