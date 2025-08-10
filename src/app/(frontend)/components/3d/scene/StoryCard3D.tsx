import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Group } from 'three'
import { type Story } from '../../../../../lib/api'
import { StoryCarousel3D } from './StoryCarousel3D'

interface StoryCard3DProps {
  story: Story
  position: [number, number, number]
  index: number
}

export function StoryCard3D({ story, position, index }: StoryCard3DProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Floating animation with slight delay based on index
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      const delay = index * 0.2 // Stagger animation
      const floatY = Math.sin(time * 0.8 + delay) * 0.1
      const floatX = Math.cos(time * 0.6 + delay) * 0.05

      groupRef.current.position.set(
        position[0] + floatX,
        position[1] + floatY,
        position[2] + (hovered ? 0.5 : 0),
      )

      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(time * 0.3 + delay) * 0.05
    }
  })

  const handleCardClick = () => {
    console.log('Navigate to story:', story.slug)
    // You can implement navigation here later
  }

  return (
    <group ref={groupRef} position={position}>
      {/* 3D Card Background Plane */}
      <mesh
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={handleCardClick}
      >
        <planeGeometry args={[2, 2.5]} />
        <meshStandardMaterial
          color={hovered ? '#ec4899' : '#ffffff'}
          transparent
          opacity={0.1}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Card Content using Html */}
      <Html
        position={[0, 0, 0.01]}
        transform
        occlude
        style={{
          width: '200px',
          height: '250px',
          pointerEvents: hovered ? 'auto' : 'none',
        }}
      >
        <div
          className={`w-full h-full bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer group ${
            hovered ? 'scale-105 shadow-2xl' : ''
          }`}
          onClick={handleCardClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Image Carousel */}
          <div className="relative h-48 overflow-hidden">
            <StoryCarousel3D puzzles={story.puzzles} onImageChange={setCurrentImageIndex} />

            {/* Carousel indicators */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {story.puzzles.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Story Title */}
            <h3
              className={`text-xl font-bold text-white mb-3 transition-colors duration-300 ${
                hovered ? 'text-pink-300' : ''
              }`}
            >
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
      </Html>
    </group>
  )
}
