import { useRef, useEffect, useState } from 'react'
import { Group, Object3D } from 'three'
import { ANIMATION_CONFIG, animationUtils } from '../utils/animationUtils'

interface PuzzlePiece {
  mesh: Object3D
  originalY: number
  currentLift: number
  finalAnimationY: number // Add this to store the final fallen position
  finalAnimationX: number // Store final X position after animation
  finalAnimationZ: number // Store final Z position after animation
}

interface UsePuzzlePiecesProps {
  scene: Group | null
  isAnimationComplete: boolean
  canCheckStability: boolean
  onStabilityDetected: () => void
}

export function usePuzzlePieces({
  scene,
  isAnimationComplete,
  canCheckStability,
  onStabilityDetected,
}: UsePuzzlePiecesProps) {
  const puzzlePieces = useRef<{ [key: string]: PuzzlePiece }>({})
  const lastPositionsRef = useRef<{ [key: string]: { x: number; y: number; z: number } }>({})
  const stableFramesRef = useRef(0)
  const [isStabilityDetected, setIsStabilityDetected] = useState(false)
  const finalPositionsCapturedRef = useRef(false) // Track if final positions have been captured
  const mouseInteractionEnabledRef = useRef(false) // Track if mouse interactions are allowed
  const stabilityDetectedTimeRef = useRef<number>(0) // Track when stability was detected

  // Initialize puzzle pieces
  useEffect(() => {
    if (!scene) return

    const pieces: { [key: string]: PuzzlePiece } = {}

    scene.traverse((child) => {
      if (child.name.startsWith('Plane')) {
        pieces[child.name] = {
          mesh: child,
          originalY: child.position.y, // This is the initial Blender position
          finalAnimationY: 0, // Will be set after animation completes
          finalAnimationX: 0, // Will be set after animation completes
          finalAnimationZ: 0, // Will be set after animation completes
          currentLift: 0,
        }
      }
    })

    puzzlePieces.current = pieces

    // Reset stability detection when scene changes
    setIsStabilityDetected(false)
    stableFramesRef.current = 0
    lastPositionsRef.current = {}
  }, [scene])

  // Check for animation stability
  const checkStability = () => {
    if (!canCheckStability || isStabilityDetected) {
      return
    }

    let allPiecesStable = true
    const currentPositions: { [key: string]: { x: number; y: number; z: number } } = {}

    // Check if all pieces have stopped moving (CHECK ALL AXES: X, Y, Z)
    Object.values(puzzlePieces.current).forEach((piece) => {
      const currentX = piece.mesh.position.x
      const currentY = piece.mesh.position.y
      const currentZ = piece.mesh.position.z

      currentPositions[piece.mesh.name] = { x: currentX, y: currentY, z: currentZ }

      // If we have a previous position, check if ANY axis changed significantly
      if (lastPositionsRef.current[piece.mesh.name] !== undefined) {
        const lastPos = lastPositionsRef.current[piece.mesh.name]
        const deltaX = Math.abs(currentX - lastPos.x)
        const deltaY = Math.abs(currentY - lastPos.y)
        const deltaZ = Math.abs(currentZ - lastPos.z)

        // If ANY axis is still moving significantly, piece is not stable
        if (
          deltaX > ANIMATION_CONFIG.STABILITY_THRESHOLD ||
          deltaY > ANIMATION_CONFIG.STABILITY_THRESHOLD ||
          deltaZ > ANIMATION_CONFIG.STABILITY_THRESHOLD
        ) {
          allPiecesStable = false
        }
      } else {
        allPiecesStable = false // First frame, not stable yet
      }
    })

    // Update last positions
    lastPositionsRef.current = currentPositions

    if (allPiecesStable) {
      const isPuzzleFormation = true // TODO: Implement a check to ensure pieces are in a valid puzzle formation

      if (!isPuzzleFormation) {
        stableFramesRef.current = 0 // Reset counter
        return
      }

      stableFramesRef.current++

      // If stable for required frames, consider animation complete
      if (stableFramesRef.current >= ANIMATION_CONFIG.STABLE_FRAMES_REQUIRED) {
        // Capture the final positions where pieces ended up after falling
        Object.values(puzzlePieces.current).forEach((piece) => {
          const currentY = piece.mesh.position.y
          const currentX = piece.mesh.position.x
          const currentZ = piece.mesh.position.z

          // Always capture the final positions after animation completes
          piece.finalAnimationY = currentY
          piece.finalAnimationX = currentX
          piece.finalAnimationZ = currentZ
          piece.currentLift = 0 // Reset lift to ensure clean state
        })

        finalPositionsCapturedRef.current = true
        stabilityDetectedTimeRef.current = Date.now()
        mouseInteractionEnabledRef.current = true
        setIsStabilityDetected(true)
        onStabilityDetected()
      }
    } else {
      stableFramesRef.current = 0 // Reset counter if pieces are still moving
    }
  }

  // Fallback: If animation is complete but stability not detected, force it
  useEffect(() => {
    if (isAnimationComplete && !isStabilityDetected) {
      // Capture final positions immediately
      Object.values(puzzlePieces.current).forEach((piece) => {
        const currentY = piece.mesh.position.y
        const currentX = piece.mesh.position.x
        const currentZ = piece.mesh.position.z

        // Always capture the final positions after animation completes
        piece.finalAnimationY = currentY
        piece.finalAnimationX = currentX
        piece.finalAnimationZ = currentZ
        piece.currentLift = 0
      })

      // Enable mouse interactions and set stability
      finalPositionsCapturedRef.current = true
      mouseInteractionEnabledRef.current = true
      setIsStabilityDetected(true)
      // No need to call onStabilityDetected() as isAnimationComplete is already true
    }
  }, [isAnimationComplete, isStabilityDetected])

  // Apply lift effects to pieces
  const applyLiftEffects = (
    mouseX: number,
    mouseZ: number,
    isMouseInCanvas: boolean,
    lerpSpeed: number = ANIMATION_CONFIG.LIFT_LERP_SPEED,
  ) => {
    if (!mouseInteractionEnabledRef.current) {
      return
    }

    // Only apply lift effects after animation is complete and stability is detected
    if (
      !isAnimationComplete ||
      !isStabilityDetected ||
      Object.keys(puzzlePieces.current).length === 0
    ) {
      return
    }

    // Also don't apply lift effects if final positions haven't been captured yet
    if (!finalPositionsCapturedRef.current) {
      return
    }

    Object.values(puzzlePieces.current).forEach((piece) => {
      // Default: no lift
      let targetLift = 0

      // Only calculate lift if mouse is in canvas
      if (isMouseInCanvas) {
        // Use the final animation position for distance calculation (not current mesh position)
        // This prevents feedback loops where lifted pieces affect other pieces
        const pieceX = piece.finalAnimationX
        const pieceZ = piece.finalAnimationZ

        const distanceX = Math.abs(pieceX - mouseX)
        const distanceZ = Math.abs(pieceZ - mouseZ)
        const distance = Math.sqrt(distanceX * distanceX + distanceZ * distanceZ)

        // Apply lift based on distance using configuration
        if (distance < ANIMATION_CONFIG.MAX_LIFT_DISTANCE) {
          const liftFactor = animationUtils.calculateLiftFactor(
            distance,
            ANIMATION_CONFIG.MAX_LIFT_DISTANCE,
          )
          const easedLiftFactor = animationUtils.applyLiftEasing(liftFactor)
          targetLift = ANIMATION_CONFIG.MAX_LIFT_HEIGHT * easedLiftFactor
        }
      }

      // Smooth interpolation for lift animation
      piece.currentLift = animationUtils.lerp(piece.currentLift, targetLift, lerpSpeed)

      // Only update Y position for lift effect - don't touch X and Z!
      // The pieces are already in the correct X,Z positions from the animation
      // Apply the final animation positions for all axes, plus the current lift for Y
      piece.mesh.position.set(
        piece.finalAnimationX,
        piece.finalAnimationY + piece.currentLift,
        piece.finalAnimationZ,
      )
    })
  }

  return {
    puzzlePieces: puzzlePieces.current,
    checkStability,
    applyLiftEffects,
    isStabilityDetected,
  }
}
