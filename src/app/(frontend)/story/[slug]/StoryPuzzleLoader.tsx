// src/app/(frontend)/story/[slug]/StoryPuzzleLoader.tsx
'use client'

import type { Story } from '@/payload-types'
import dynamic from 'next/dynamic'
import { LoadingSpinner } from '../../components/3d/ModelViewerLoader'

// Dynamically import the StoryPuzzleClient component
const StoryPuzzleClient = dynamic(() => import('./StoryPuzzleClient'), {
  ssr: false,
  loading: () => <LoadingSpinner contentReady={false} />,
})

interface StoryPuzzleLoaderProps {
  story: Story
}

export default function StoryPuzzleLoader({ story }: StoryPuzzleLoaderProps) {
  return <StoryPuzzleClient story={story} />
}
