import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import React from 'react'
import { Story } from '@/payload-types' // Use payload types
import StoryPuzzleLoader from './StoryPuzzleLoader'

const fetchStory = async (slug: string): Promise<Story | null> => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'stories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2, // Ensure media is populated
  })

  if (result.docs.length === 0) {
    return null
  }

  return result.docs[0]
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const stories = await payload.find({
    collection: 'stories',
    limit: 100,
  })

  return stories.docs.map(({ slug }) => ({
    slug,
  }))
}

type StoryPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function StoryPage({ params }: StoryPageProps) {
  // Await the params before using them
  const { slug } = await params

  const story = await fetchStory(slug)

  if (!story) {
    notFound()
  }

  return <StoryPuzzleLoader story={story} />
}
