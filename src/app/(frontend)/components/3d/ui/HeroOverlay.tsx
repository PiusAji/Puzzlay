import { Bounded } from '../../Bounded'
import { Logo } from '../../ui/Logo'
import type { SiteSettings, Nav } from '../../../../../lib/api'
import Header from '../../ui/Header'

interface HeroOverlayProps {
  onCTAClick?: () => void
  siteSettings?: SiteSettings | null
  navigationData?: Nav | null
  heroContent?: React.ReactNode
}

// CLIENT COMPONENT - Receives logo data as props
export function HeroOverlay({ siteSettings, navigationData, heroContent }: HeroOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
      {/* Top section */}
      <Bounded className="pointer-events-auto">
        <div className="flex justify-between items-center">
          <Header navigationData={navigationData} siteSettings={siteSettings} />
        </div>
      </Bounded>

      {/* Hero Content - This will be centered in the available space */}
      <Bounded>
        <div className="flex-grow flex items-center justify-center">{heroContent}</div>
      </Bounded>
    </div>
  )
}
