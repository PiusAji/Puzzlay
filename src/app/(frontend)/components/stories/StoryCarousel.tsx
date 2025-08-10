'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Story } from '../../../../lib/api'
import Image from 'next/image'

interface StoryCarouselProps {
  story: Story
}

export function StoryCarousel({ story }: StoryCarouselProps) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      duration: 30,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })],
  )

  // Clean autoplay carousel - no controls needed

  // Get images from story puzzles (each story has 3 puzzles with images)
  const images = story.puzzles?.map((puzzle) => puzzle.image) || []

  if (!images.length) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-8 h-8 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-white/60 text-sm">No images</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full group">
      {/* Carousel */}
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image, index) => {
            const imageUrl = typeof image === 'string' ? image : image.url
            const imageAlt =
              typeof image === 'string'
                ? `Story image ${index + 1}`
                : image.alt || `Story image ${index + 1}`

            return (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                <Image
                  src={imageUrl || '/placeholder-image.jpg'}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* No controls - clean carousel */}
    </div>
  )
}
