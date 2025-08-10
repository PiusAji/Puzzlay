// Animation configuration constants
export const ANIMATION_CONFIG = {
  // Stability detection - Wait much longer for pieces to reach puzzle formation
  STABILITY_CHECK_DELAY: 0.1, // Start checking for stability almost immediately
  STABILITY_THRESHOLD: 0.001, // Movement threshold in units
  STABLE_FRAMES_REQUIRED: 5, // Reduce frames required for stability to minimize delay

  // Fallback timing
  MAX_ANIMATION_DURATION: 20.0, // Force completion after 20 seconds

  // Mouse interaction
  MOUSE_SCALE_FACTOR: 3, // Scale factor for mouse coordinates
  MAX_LIFT_DISTANCE: 1.5, // Maximum distance for lift effect
  MAX_LIFT_HEIGHT: 0.15, // Maximum lift height
  LIFT_LERP_SPEED: 0.08, // Interpolation speed for smooth movement
} as const

// Easing functions
export const easing = {
  // Cubic easing for smooth lift effects
  cubic: (t: number): number => t * t * t,

  // Ease out cubic
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
} as const

// Utility functions
export const animationUtils = {
  // Calculate lift factor based on distance
  calculateLiftFactor: (distance: number, maxDistance: number): number => {
    if (distance >= maxDistance) return 0
    return 1 - distance / maxDistance
  },

  // Apply cubic easing to lift factor
  applyLiftEasing: (liftFactor: number): number => {
    return easing.cubic(liftFactor)
  },

  // Linear interpolation
  lerp: (current: number, target: number, speed: number): number => {
    return current * (1 - speed) + target * speed
  },
} as const
