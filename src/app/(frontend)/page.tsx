'use client'

import React, { useState, useEffect } from 'react'
import { api, SiteSettings, Nav, Story, Homepage } from '../../lib/api'
import { HeroSection } from './components/ui/HeroSection'
import ModelViewerLoader from './components/3d/ModelViewerLoader'

export default function HomePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [navigationData, setNavigationData] = useState<Nav | null>(null)
  const [stories, setStories] = useState<Story[] | null>(null)
  const [homepage, setHomepage] = useState<Homepage | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [settings, nav, storiesData, homeData] = await Promise.all([
          api.siteSettings.getSiteSettings(),
          api.navigation.getNavigation(),
          api.stories.getStories(),
          api.homepage.getHomepage(),
        ])
        setSiteSettings(settings)
        setNavigationData(nav)
        setStories(storiesData)
        setHomepage(homeData)
      } catch (error) {
        console.error('Failed to fetch page data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <link rel="preload" href="/PuzzleHero-Master.glb" as="fetch" crossOrigin="anonymous" />
      <link
        rel="preload"
        href="/Texture/PuzzlayPuzzleFix.webp"
        as="image"
        crossOrigin="anonymous"
      />

      <main className="bg-black text-white">
        <ModelViewerLoader
          siteSettings={siteSettings}
          navigationData={navigationData}
          stories={stories || []}
          heroContent={<HeroSection hero={homepage?.hero} />}
        />
      </main>
    </>
  )
}
