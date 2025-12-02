// components/ui/ProfileCard.tsx
'use client'

interface ProfileCardProps {
  name: string
  role: string
  imageUrl: string
  imagePosition?: string // Custom positioning like "translate-y-[-8px] translate-x-[-4px]"
  imageScale?: number // Custom zoom level (default 1.5)
}

export function ProfileCard({
  name,
  role,
  imageUrl,
  imagePosition = 'object-top',
  imageScale = 1.5,
}: ProfileCardProps) {
  // Parse the imagePosition to extract translate values
  const getTransformStyle = () => {
    if (!imagePosition || imagePosition === 'object-top' || imagePosition === 'object-center') {
      return undefined
    }

    // Extract translateY and translateX values
    const yMatch = imagePosition.match(/translate-y-\[(.*?)\]/)
    const xMatch = imagePosition.match(/translate-x-\[(.*?)\]/)

    const translateY = yMatch ? yMatch[1] : '0px'
    const translateX = xMatch ? xMatch[1] : '0px'

    return {
      objectPosition: 'center top',
      transform: `scale(${imageScale}) translateY(${translateY}) translateX(${translateX})`,
    }
  }

  return (
    <div className="relative group">
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-1 rounded-3xl shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl p-6 md:p-8">
          {/* Avatar Container */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Avatar image */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover scale-150"
                  style={getTransformStyle()}
                />
              </div>

              {/* Badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-6 py-1 shadow-lg border-2 border-white whitespace-nowrap">
                <span className="text-xs font-black text-white">{role}</span>
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div className="text-center space-y-3 mt-8">
            <h3 className="text-xl md:text-2xl font-black bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
              {name}
            </h3>

            {/* Decorative stars */}
            <div className="flex justify-center gap-2">
              <span className="text-yellow-400 text-sm">⭐</span>
              <span className="text-pink-400 text-sm">✨</span>
              <span className="text-cyan-400 text-sm">💫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
