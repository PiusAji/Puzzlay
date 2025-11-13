import type { Nav, SiteSettings } from '@/lib/api'
import { Logo } from './Logo'

interface HeaderProps {
  navigationData: Nav | null | undefined
  siteSettings: SiteSettings | null | undefined
}

export default function Header({ navigationData, siteSettings }: HeaderProps) {
  if (!navigationData) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="px-4 py-3 md:px-8 md:py-6">
        <div className="flex items-center justify-between">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 scale-110"></div>
            <Logo
              siteSettings={siteSettings}
              className="w-12 h-12 md:w-20 md:h-20 relative z-10 drop-shadow-2xl"
            />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
          </div>

          <div className="flex items-center">
            <nav>
              <ul className="flex items-center gap-3 md:gap-6">
                {navigationData.navItems?.map((item) => (
                  <li key={item.label} className="relative group">
                    <a
                      href="#stories-section"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        document
                          .getElementById('stories-section')
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      <div className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-xl border-2 border-white/50 hover:bg-white hover:border-purple-200 hover:shadow-2xl transition-all duration-700 ease-in-out hover:scale-110 transform hover:-translate-y-1 shadow-xl">
                        <div className="flex items-center justify-center group-hover:justify-start py-3 px-2 md:py-5 md:px-4 transition-all duration-700 ease-in-out">
                          <div className="flex items-center gap-1 md:gap-2 z-10 relative mt-2 md:mt-4 flex-shrink-0 transition-all duration-700 ease-in-out">
                            <div
                              className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce shadow-lg"
                              style={{ animationDelay: '0s' }}
                            />
                            <div
                              className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce shadow-lg"
                              style={{ animationDelay: '0.5s' }}
                            />
                            <div
                              className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce shadow-lg"
                              style={{ animationDelay: '1s' }}
                            />
                          </div>

                          <div className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-700 ease-in-out ml-0 group-hover:ml-3 flex items-center">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 font-bold text-sm md:text-lg whitespace-nowrap transform translate-x-[-100%] group-hover:translate-x-0 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100">
                              {item.label}
                            </span>
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/40 to-pink-50/40 rounded-xl md:rounded-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out origin-right"></div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
