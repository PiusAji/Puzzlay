// ModelViewerServer.tsx
'use client'

import { HeroOverlay } from './ui/HeroOverlay'
import { StoriesSection } from '../stories/StoriesSection'
import type { SiteSettings, Nav, Story } from '../../../../lib/api'
import { useRef, useEffect, useState } from 'react'
import { useSceneStore } from './stores/useSceneStore'
import ModelViewer from './ModelViewer'

interface ModelViewerServerProps {
  siteSettings: SiteSettings | null
  navigationData: Nav | null
  stories: Story[]
  heroContent?: React.ReactNode
}

export default function ModelViewerServer({
  siteSettings,
  navigationData,
  stories,
  heroContent,
}: ModelViewerServerProps) {
  const storySectionRef = useRef<HTMLDivElement | null>(null)
  const { setScene } = useSceneStore()
  const [, setIsMounted] = useState(false)

  useEffect(() => {
    // Ensure component is fully mounted before setting scene
    setIsMounted(true)

    const timer = setTimeout(() => {
      setScene(<ModelViewer storySectionRef={storySectionRef} />, 'viewer')
    }, 50) // Reduced timeout

    return () => {
      clearTimeout(timer)
      setScene(null)
    }
  }, [setScene])

  const handleCTAClick = () => {
    console.log('CTA clicked - start game!')
  }

  // Always render the same structure to avoid hydration mismatch
  return (
    <div className="relative w-full">
      {/* Scrollable content with pointer-events-none to allow 3D interaction */}
      <div className="relative z-10 pointer-events-none">
        {/* First screen - transparent to allow 3D interaction */}
        <div className="h-screen relative">
          {/* Hero overlay fills the hero section */}
          <HeroOverlay
            siteSettings={siteSettings}
            navigationData={navigationData}
            onCTAClick={handleCTAClick}
            heroContent={heroContent}
          />
        </div>

        {/* Stories section with pointer events enabled for interactive content */}
        <div ref={storySectionRef} className="pointer-events-auto">
          <StoriesSection stories={stories} />
        </div>
      </div>
    </div>
  )
}
