// Scene configuration constants
export const SCENE_CONFIG = {
  // Camera settings
  camera: {
    initialPosition: { x: -1.5, y: 2, z: 5 },
    finalPosition: { x: 0, y: 1, z: 1.8 },
    fov: 50,
    animationDuration: 13, // seconds
  },

  // Environment settings
  environment: {
    // Built-in preset (optimized and fast loading)
    preset: 'park' as const, // Options: "park", "sunset", "forest", "dawn", "studio", "city", "apartment", "night"
    // Environment intensity
    intensity: 1.2, // Slightly brighter for playful feel
    // Background intensity (separate from environment lighting)
    backgroundIntensity: 0.6,
    // Background blur (0 = sharp, 1 = very blurred)
    backgroundBlur: 0.1,
  },

  // Surface/Table settings
  surface: {
    type: 'none' as const, // Options: "none", "simple-table", "floating", "pedestal"
    // If using table, these settings apply
    tableHeight: -0.5,
    tableColor: '#8B4513', // Brown wood color
    showShadows: true,
  },

  // UI Integration
  ui: {
    // Whether to show 3D text in scene or overlay HTML
    use3DText: false,
    // 3D text settings (if enabled)
    text3D: {
      title: 'NIPPLAYY',
      subtitle: 'Interactive Puzzle Experience',
      position: [0, 3, -2] as [number, number, number],
      color: '#ffffff',
    },
  },

  // Floating animation
  floating: {
    yAmplitude: 0.1,
    ySpeed: 0.8,
    rotationAmplitude: 0.1,
    rotationSpeed: 0.5,
  },

  // Realistic lighting configuration
  lighting: {
    // Main directional light (softer, more realistic)
    main: {
      position: [2, 6, 4] as [number, number, number],
      intensity: 1.5, // Reduced from 3 to 1.5 for realism
      color: '#ffffff', // Pure white for natural look
      castShadow: true, // Enable shadows for depth
    },

    // Subtle animated lights (more realistic)
    animated: {
      light1: {
        initialPosition: [4, 5, 3] as [number, number, number],
        intensity: 0.8, // Much more subtle
        color: '#fff8dc', // Warm white instead of golden
        orbitRadius: 4,
        orbitSpeed: 0.3, // Slower movement
      },
      light2: {
        initialPosition: [-3, 4, 2] as [number, number, number],
        intensity: 0.6, // More subtle
        color: '#f0f8ff', // Very light blue
        figureEightRadius: { x: 3, z: 2 },
        figureEightSpeed: 0.4, // Slower movement
      },
    },

    // Puzzle highlighting lights (focused on puzzle area)
    accent: [
      {
        position: [2, 3, 2] as [number, number, number], // Above-right of puzzle
        intensity: 1.2,
        color: '#ffffff', // Pure white for highlighting
        distance: 5,
      },
      {
        position: [-2, 3, 2] as [number, number, number], // Above-left of puzzle
        intensity: 1.0,
        color: '#ffffff',
        distance: 5,
      },
      {
        position: [0, 1, 4] as [number, number, number], // Front of puzzle
        intensity: 0.8,
        color: '#fff8dc', // Slightly warm
        distance: 6,
      },
    ],

    // Rim lighting for puzzle definition
    rim: [
      {
        position: [0, 2, -3] as [number, number, number], // Behind puzzle
        intensity: 0.6,
        color: '#e6f3ff', // Cool rim light
      },
      {
        position: [3, 1, 0] as [number, number, number], // Side rim
        intensity: 0.4,
        color: '#fff8dc', // Warm rim light
      },
    ],

    // Realistic ambient light
    ambient: {
      intensity: 0.4, // Much more subtle for realism
      color: '#f5f5f5', // Neutral ambient
    },

    // Realistic hemisphere light
    hemisphere: {
      skyColor: '#b8d4f0', // Softer sky blue
      groundColor: '#8b8680', // Neutral ground
      intensity: 0.5, // Reduced for more realistic contrast
    },
  },

  // Particle effects (using your puzzle colors)
  particles: {
    puzzle: {
      count: 25,
      radius: 3,
      speed: 0.3,
      colors: ['#F44336', '#FFC107', '#4CAF50', '#03A9F4', '#9C27B0'],
    },
    sparkles: {
      count: 12,
      colors: ['#F44336', '#FFC107', '#4CAF50', '#03A9F4', '#9C27B0'],
      opacity: 0.5,
    },
  },

  // Background effects
  background: {
    animated: true,
    shapes: {
      count: 8,
      opacity: 0.1,
    },
  },

  // Controls
  controls: {
    enableZoom: false, // Disabled to allow page scrolling
    enablePan: true,
    maxPolarAngle: Math.PI,
    enableDamping: true,
    dampingFactor: 0.05,
  },
} as const

// Easing functions for animations
export const sceneEasing = {
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
} as const
