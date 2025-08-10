// API service for Payload CMS data fetching
// Centralized location for all API calls

// Get the correct API base URL for server vs client
function getApiBaseUrl() {
  // For Netlify builds, use the deploy URL.
  if (process.env.NETLIFY && process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL
  }

  const payloadUrl = process.env.PAYLOAD_URL || 'http://localhost:3000'

  // On server side, use the environment variable
  if (typeof window === 'undefined') {
    return payloadUrl
  }

  // On client side, use the current origin or fallback to the environment variable
  return window.location.origin || payloadUrl
}

// Types for API responses
// Media interface with predefined sizes
export interface MediaItem {
  url: string
  alt?: string
  filename?: string
  width?: number
  height?: number
  sizes?: {
    thumbnail?: MediaItem
    card?: MediaItem
    hero?: MediaItem
    logo?: MediaItem
    avatar?: MediaItem
  }
}

export interface SiteSettings {
  siteName?: string
  logo?: MediaItem
  favicon?: MediaItem
  seo?: {
    metaTitle?: string
    metaDescription?: string
    metaImage?: {
      url: string
      alt?: string
    }
    keywords?: string
  }
  social?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
}

export interface NavItem {
  label: string
  url?: string // url is optional if subItems exist
  openInNewTab?: boolean
  subItems?: NavItem[] // Add subItems to NavItem
}

export interface Nav {
  title: string
  navItems?: NavItem[]
}

export interface Homepage {
  title: string
  hero?: {
    title: string
    description: string
    ctaButton?: {
      text: string
      url: string
      openInNewTab?: boolean
    }
  }
}

export interface Puzzle {
  order: number
  title: string
  description: string
  image: MediaItem
  id?: string
}

export interface Story {
  id: string
  title: string
  description: string
  slug: string
  status: 'draft' | 'published'
  puzzles: Puzzle[]
  totalCompletions?: number
  estimatedTime?: number
  createdAt: string
  updatedAt: string
}

// Generic API fetch function with error handling
async function apiRequest<T>(endpoint: string): Promise<T | null> {
  try {
    const baseUrl = getApiBaseUrl()

    // Skip API calls during build time when running locally
    if (typeof window === 'undefined' && baseUrl.includes('localhost')) {
      console.log(`Skipping API request during build: ${endpoint}`)
      return null
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control for better performance
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!response.ok) {
      console.error(`API request failed: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Don't log ECONNREFUSED errors during build time
    if (
      error instanceof Error &&
      error.message.includes('ECONNREFUSED') &&
      typeof window === 'undefined'
    ) {
      console.log(`Build-time API call skipped for ${endpoint} (this is normal)`)
      return null
    }
    console.error(`API request error for ${endpoint}:`, error)
    return null
  }
}

// Site Settings API
export const siteSettingsApi = {
  // Get site settings (logo, metadata, etc.)
  async getSiteSettings(): Promise<SiteSettings | null> {
    return apiRequest<SiteSettings>('/api/globals/site-settings')
  },

  // Get just the logo for quick access
  async getLogo(): Promise<SiteSettings['logo'] | null> {
    const settings = await this.getSiteSettings()
    return settings?.logo || null
  },

  // Get SEO metadata
  async getSEOData(): Promise<SiteSettings['seo'] | null> {
    const settings = await this.getSiteSettings()
    return settings?.seo || null
  },
}

// Navigation API
export const navigationApi = {
  // Get navigation data
  async getNavigation(): Promise<Nav | null> {
    const response = await apiRequest<{ docs: Nav[] }>('/api/nav')
    // Return the first navigation document (there should only be one)
    return response?.docs?.[0] || null
  },

  // Get just nav items
  async getNavItems(): Promise<NavItem[] | null> {
    const nav = await this.getNavigation()
    return nav?.navItems || null
  },
}

// Homepage API
export const homepageApi = {
  // Get homepage data
  async getHomepage(): Promise<Homepage | null> {
    const response = await apiRequest<{ docs: Homepage[] }>('/api/homepage')
    return response?.docs?.[0] || null
  },

  // Get just hero section
  async getHeroData(): Promise<Homepage['hero'] | null> {
    const homepage = await this.getHomepage()
    return homepage?.hero || null
  },
}

// Stories API
export const storiesApi = {
  // Get all published stories
  async getStories(): Promise<Story[] | null> {
    const response = await apiRequest<{ docs: Story[] }>(
      '/api/stories?where[status][equals]=published',
    )
    return response?.docs || null
  },

  // Get a single story by slug
  async getStoryBySlug(slug: string): Promise<Story | null> {
    const response = await apiRequest<{ docs: Story[] }>(
      `/api/stories?where[slug][equals]=${slug}&where[status][equals]=published`,
    )
    return response?.docs?.[0] || null
  },

  // Get story by ID
  async getStoryById(id: string): Promise<Story | null> {
    return apiRequest<Story>(`/api/stories/${id}`)
  },

  // Get featured stories (you can add a featured field later if needed)
  async getFeaturedStories(limit: number = 6): Promise<Story[] | null> {
    const response = await apiRequest<{ docs: Story[] }>(
      `/api/stories?where[status][equals]=published&limit=${limit}`,
    )
    return response?.docs || null
  },
}

// Combined API object for easy importing
export const api = {
  siteSettings: siteSettingsApi,
  navigation: navigationApi,
  homepage: homepageApi,
  stories: storiesApi,
}

// Utility functions for common operations
export const apiUtils = {
  // Build full image URL from Payload media (already optimized for Cloudinary)
  getImageUrl(media: { url?: string; filename?: string } | undefined): string | null {
    if (!media) return null
    return media.url || null // This is already a Cloudinary URL!
  },

  // Get optimized image URL with Cloudinary transformations
  getOptimizedImageUrl(
    media: { url?: string; filename?: string } | undefined,
    options?: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'jpg' | 'png' | 'auto'
      crop?: 'fill' | 'fit' | 'scale' | 'crop'
      gravity?: 'auto' | 'face' | 'center'
    },
  ): string | null {
    const baseUrl = this.getImageUrl(media)
    if (!baseUrl) return null

    // If using Cloudinary, add transformation parameters
    if (baseUrl.includes('cloudinary.com')) {
      const transformations = []

      // Add responsive and optimization defaults
      if (options?.format === 'auto') transformations.push('f_auto')
      else if (options?.format) transformations.push(`f_${options.format}`)
      else transformations.push('f_auto') // Default to auto format

      transformations.push('q_auto') // Auto quality unless specified
      if (options?.quality) transformations.push(`q_${options.quality}`)

      if (options?.width) transformations.push(`w_${options.width}`)
      if (options?.height) transformations.push(`h_${options.height}`)
      if (options?.crop) transformations.push(`c_${options.crop}`)
      if (options?.gravity) transformations.push(`g_${options.gravity}`)

      if (transformations.length > 0) {
        // Insert transformations into Cloudinary URL
        return baseUrl.replace('/upload/', `/upload/${transformations.join(',')}/`)
      }
    }

    return baseUrl
  },

  // Get responsive image URLs for different screen sizes
  getResponsiveImageUrls(media: { url?: string; filename?: string } | undefined) {
    if (!media) return null

    return {
      mobile: this.getOptimizedImageUrl(media, { width: 400, format: 'auto' }),
      tablet: this.getOptimizedImageUrl(media, { width: 768, format: 'auto' }),
      desktop: this.getOptimizedImageUrl(media, { width: 1200, format: 'auto' }),
      original: this.getImageUrl(media),
    }
  },

  // Get predefined size URL (if available) or generate dynamically
  getSizedImageUrl(
    media: MediaItem | undefined,
    size: 'thumbnail' | 'card' | 'hero' | 'logo' | 'avatar',
  ): string | null {
    if (!media) return null

    // First try to get predefined size from Payload
    if (media.sizes?.[size]?.url) {
      return media.sizes[size]!.url
    }

    // Fallback to dynamic generation with common sizes
    const sizeMap = {
      thumbnail: { width: 150, height: 150, crop: 'fill' as const },
      card: { width: 400, height: 300, crop: 'fill' as const },
      hero: { width: 1200, height: 800, crop: 'fill' as const },
      logo: { width: 200, height: 200, crop: 'fit' as const },
      avatar: { width: 100, height: 100, crop: 'fill' as const },
    }

    return this.getOptimizedImageUrl(media, sizeMap[size])
  },

  // Get all available sizes for a media item
  getAllSizes(media: MediaItem | undefined) {
    if (!media) return null

    return {
      original: this.getImageUrl(media),
      thumbnail: this.getSizedImageUrl(media, 'thumbnail'),
      card: this.getSizedImageUrl(media, 'card'),
      hero: this.getSizedImageUrl(media, 'hero'),
      logo: this.getSizedImageUrl(media, 'logo'),
      avatar: this.getSizedImageUrl(media, 'avatar'),
    }
  },
}

export default api
