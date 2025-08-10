import { useRef, useEffect, useState } from 'react'
import { AnimationMixer, Group, AnimationClip, AnimationAction, LoopOnce } from 'three'
import { useFrame } from '@react-three/fiber'
import { ANIMATION_CONFIG } from '../utils/animationUtils'

interface UseAnimationMixerProps {
  group: Group | null
  animations: AnimationClip[]
  onAnimationComplete: () => void
}

export function useAnimationMixer({
  group,
  animations,
  onAnimationComplete,
}: UseAnimationMixerProps) {
  const mixerRef = useRef<AnimationMixer | null>(null)
  const animationTimeRef = useRef(0)
  const isAnimationInitializedRef = useRef(false)
  const animationActionsRef = useRef<AnimationAction[]>([])
  const actualAnimationDurationRef = useRef(13)
  const completionTriggeredRef = useRef(false)
  const lastPositionsRef = useRef<{ [key: string]: number }>({})
  const stableFramesRef = useRef(0)

  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  // Initialize animation mixer
  useEffect(() => {
    if (isAnimationInitializedRef.current || !group || animations.length === 0) {
      return
    }

    // Reset all animation state
    animationTimeRef.current = 0
    setIsAnimationComplete(false)
    completionTriggeredRef.current = false
    lastPositionsRef.current = {}
    stableFramesRef.current = 0
    isAnimationInitializedRef.current = true

    // Store the current group ref for cleanup
    const currentGroup = group

    // Create mixer
    const mixer = new AnimationMixer(currentGroup)
    mixerRef.current = mixer

    // Clear previous actions
    animationActionsRef.current = []

    // Find the longest animation duration
    let maxDuration = 0

    // Play all animations
    animations.forEach((clip) => {
      maxDuration = Math.max(maxDuration, clip.duration)

      const action = mixer.clipAction(clip)
      if (action) {
        action.setLoop(LoopOnce, 1)
        action.clampWhenFinished = true
        action.reset()
        action.play()

        animationActionsRef.current.push(action)
      }
    })

    // Set the actual animation duration
    actualAnimationDurationRef.current = maxDuration

    // Set up finished callback (backup mechanism)
    const onFinished = () => {
      // Event-based completion disabled to prevent early interruption
      // Animation completion is handled by position-based detection
    }

    mixer.addEventListener('finished', onFinished)

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
        mixerRef.current.removeEventListener('finished', onFinished)
        if (currentGroup) {
          mixerRef.current.uncacheRoot(currentGroup)
        }
      }
      isAnimationInitializedRef.current = false
      completionTriggeredRef.current = false
    }
  }, [animations, group])

  // Animation frame update
  useFrame((_, delta) => {
    // 🔥 CRITICAL: Only update mixer if animation is NOT complete
    if (mixerRef.current && !completionTriggeredRef.current) {
      mixerRef.current.update(delta)
      animationTimeRef.current += delta

      // Fallback: Force completion after configured max duration
      if (animationTimeRef.current >= ANIMATION_CONFIG.MAX_ANIMATION_DURATION) {
        completionTriggeredRef.current = true
        setIsAnimationComplete(true)
        onAnimationComplete()
      }
    }
  })

  const triggerCompletion = () => {
    if (!completionTriggeredRef.current) {
      // Force stop all actions to prevent further updates
      // A more robust way to stop the animation and freeze it in its final state
      animationActionsRef.current.forEach((action) => {
        action.paused = true // Freeze the animation at its current frame
        action.enabled = false // Detach the action from influencing the model
      })

      // We don't call stopAllAction() because it RESETS the animation state.
      // The loop above that disables and pauses the actions is sufficient.

      completionTriggeredRef.current = true
      setIsAnimationComplete(true)
      onAnimationComplete()
    }
  }

  return {
    isAnimationComplete,
    animationTime: animationTimeRef.current,
    canCheckStability: animationTimeRef.current >= ANIMATION_CONFIG.STABILITY_CHECK_DELAY,
    triggerCompletion,
  }
}
