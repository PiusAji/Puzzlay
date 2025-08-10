import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Group } from 'three'
import { type Story } from '../../../../../lib/api'
import { StoryCard3D } from './StoryCard3D'

export function Stories3D({ stories }: { stories: Story[] }) {
  const groupRef = useRef<Group>(null)

  // Gentle floating animation for the entire stories group
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      groupRef.current.position.y = -2 + Math.sin(time * 0.5) * 0.1
    }
  })

  if (!stories || stories.length === 0) {
    return (
      <group position={[0, -2, 0]}>
        <Html center>
          <div className="text-center max-w-md">
            <h3 className="text-2xl font-bold text-white mb-4">No Stories Found</h3>
            <p className="text-white/70 mb-4">No stories available at the moment.</p>
            <div className="text-sm text-white/50">
              <p>
                To fix this, go to your Payload CMS and set your story status to
                &quot;Published&quot;
              </p>
            </div>
          </div>
        </Html>
      </group>
    )
  }

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Section Title */}
      <Html position={[0, 1, 0]} center>
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Puzzle Stories</h2>
          <p className="text-xl text-white/80 max-w-2xl">
            Embark on interactive puzzle adventures. Each story contains 3 unique puzzles that
            challenge your mind and creativity.
          </p>
        </div>
      </Html>

      {/* Story Cards arranged in 3D space */}
      {stories.map((story, index) => {
        // Arrange cards in a grid formation in 3D space
        const cols = 3
        const col = index % cols
        const row = Math.floor(index / cols)

        // Calculate position for each card
        const x = (col - (cols - 1) / 2) * 2.5 // 2.5 units apart horizontally
        const y = -(row * 2.5) // 2.5 units apart vertically (going down)
        const z = 0

        return <StoryCard3D key={story.id} story={story} position={[x, y, z]} index={index} />
      })}

      {/* View All Button */}
      <Html position={[0, -(Math.ceil(stories.length / 3) * 3 + 2), 0]} center>
        <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          View All Stories
        </button>
      </Html>
    </group>
  )
}
