import { useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Vector3 } from 'three'
import { SCENE_CONFIG } from '../config/sceneConfig'

gsap.registerPlugin(ScrollTrigger)

export function useScrollCamera(storySectionRef: React.RefObject<HTMLElement | null>) {
  const { camera } = useThree()

  useLayoutEffect(() => {
    if (!storySectionRef.current) return

    const storySection = storySectionRef.current
    const lookAtTarget = new Vector3(0, 0, 0)

    // Disable scrolling for the first 2 seconds
    const disableScroll = (e: Event) => {
      e.preventDefault()
    }

    // Add scroll prevention
    document.body.style.overflow = 'hidden'
    window.addEventListener('wheel', disableScroll, { passive: false })
    window.addEventListener('touchmove', disableScroll, { passive: false })

    // Re-enable scrolling after 2 seconds
    const enableScrollTimeout = setTimeout(() => {
      document.body.style.overflow = ''
      window.removeEventListener('wheel', disableScroll)
      window.removeEventListener('touchmove', disableScroll)
    }, 2000)

    // Set initial camera state for the intro animation
    camera.position.set(0, 2, 5) // Start from a higher and more distant position
    camera.lookAt(lookAtTarget)

    // Intro animation timeline
    const introTimeline = gsap.timeline()

    introTimeline
      .from(camera.position, {
        x: SCENE_CONFIG.camera.initialPosition.x,
        y: SCENE_CONFIG.camera.initialPosition.y,
        z: SCENE_CONFIG.camera.initialPosition.z,
        duration: 2.5, // Duration of the intro animation
        ease: 'power3.inOut', // A smooth easing function
        onUpdate: () => {
          camera.lookAt(lookAtTarget)
        },
      })
      .to(
        camera.position,
        {
          x: SCENE_CONFIG.camera.finalPosition.x,
          y: SCENE_CONFIG.camera.finalPosition.y,
          z: SCENE_CONFIG.camera.finalPosition.z,
          duration: 2.5,
          ease: 'power3.inOut',
        },
        '-=2',
      ) // Overlap with the previous animation for a smoother transition

    // Create a single, scroll-driven timeline.
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: storySection,
        start: 'top bottom', // Animation starts when the top of the stories section hits the bottom of the screen
        end: 'bottom bottom', // Animation ends when the bottom of the stories section hits the bottom of the screen
        scrub: 1, // Smoothly ties the animation progress to the scrollbar
      },
      defaults: {
        ease: 'power2.inOut',
      },
    })

    // Animate the camera position to the stories view
    scrollTimeline
      .to(camera.position, {
        x: 0, // Centered
        y: -0.5, // Move down slightly
        z: 4.5, // Move further back
      })
      // Animate the lookAt target simultaneously
      .to(
        lookAtTarget,
        {
          y: -0.5, // Look down towards the stories
          onUpdate: () => {
            camera.lookAt(lookAtTarget)
          },
        },
        '<', // Ensures the lookAt animation starts at the same time as the position animation
      )

    return () => {
      // Clean up timeout
      clearTimeout(enableScrollTimeout)

      // Re-enable scrolling in case component unmounts early
      document.body.style.overflow = ''
      window.removeEventListener('wheel', disableScroll)
      window.removeEventListener('touchmove', disableScroll)

      // Clean up all GSAP animations and ScrollTriggers
      gsap.getTweensOf(camera.position).forEach((tween) => tween.kill())
      gsap.getTweensOf(lookAtTarget).forEach((tween) => tween.kill())
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [camera, storySectionRef])
}
