import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import React from 'react'
import { Story } from '@/payload-types' // Use payload types
import StoryPuzzleLoader from './StoryPuzzleLoader'

const fetchStoryAndPuzzle = async (
  storySlug: string,
): Promise<{ story: Story; puzzle: Story['puzzles'][0] } | null> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'stories',
    where: {
      slug: {
        equals: storySlug,
      },
    },
    limit: 1,
    depth: 2, // Ensure media and puzzles are populated
  })

  if (result.docs.length === 0) {
    return null
  }

  const story = result.docs[0]
  const puzzle = story.puzzles[0] // Get the first puzzle

  if (!puzzle) {
    return null
  }

  return { story, puzzle }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const stories = await payload.find({
    collection: 'stories',
    limit: 100,
    depth: 1, // Ensure puzzles are populated
  })

  const params = stories.docs.map((story) => ({
    slug: story.slug, // Only use story slug
  }))

  return params
}

type StoryPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function StoryPage({ params }: StoryPageProps) {
  // Await the params before using them
  const { slug } = await params

  const result = await fetchStoryAndPuzzle(slug)

  if (!result) {
    notFound()
  }

  const { story, puzzle } = result

  return <StoryPuzzleLoader story={story} initialPuzzle={puzzle} />
}
