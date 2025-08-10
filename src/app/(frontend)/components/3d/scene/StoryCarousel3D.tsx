import { useEffect, useRef } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { type Puzzle, apiUtils } from '../../../../../lib/api'

interface StoryCarousel3DProps {
  puzzles: Puzzle[]
  onImageChange?: (index: number) => void
}

export function StoryCarousel3D({ puzzles, onImageChange }: StoryCarousel3DProps) {
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
      emblaApi.on('select', () => {
        onImageChange?.(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi, onImageChange])

  return (
    <div className="embla w-full h-full" ref={emblaRef}>
      <div className="embla__container flex h-full">
        {puzzles.map((puzzle, index) => (
          <div key={puzzle.id || index} className="embla__slide flex-none w-full">
            <div className="relative h-full">
              <Image
                src={
                  apiUtils.getSizedImageUrl(puzzle.image, 'card') ||
                  `https://via.placeholder.com/400x300/6b7280/ffffff?text=Puzzle+${puzzle.order}`
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
  )
}
