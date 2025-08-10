import React from 'react'
import { api } from '../../lib/api'
import { HeroSection } from './components/ui/HeroSection'
import ModelViewerLoader from './components/3d/ModelViewerLoader'

export default async function HomePage() {
  const [siteSettings, navigationData, stories, homepage] = await Promise.all([
    api.siteSettings.getSiteSettings(),
    api.navigation.getNavigation(),
    api.stories.getStories(),
    api.homepage.getHomepage(),
  ])

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
