import { useState, useEffect, useCallback, useMemo } from 'react'
import { Vector2, Vector3, Raycaster, Plane } from 'three'
import { useThree } from '@react-three/fiber'

export function useMouseInteraction() {
  const { gl, camera } = useThree()
  const [mouse, setMouse] = useState(new Vector2())
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false)
  const [worldMousePosition, setWorldMousePosition] = useState(new Vector3(0, 0, 0))
  const [hasValidMousePosition, setHasValidMousePosition] = useState(false)

  // These are stable and don't need to be in useCallback deps if they don't change
  const groundPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), [])
  const raycaster = useMemo(() => new Raycaster(), [])

  const updateMousePosition = useCallback(
    (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()

      const isWithinBounds =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      setIsMouseInCanvas(isWithinBounds)

      if (isWithinBounds) {
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        const newMouse = new Vector2(x, y)
        setMouse(newMouse)

        raycaster.setFromCamera(newMouse, camera)
        const intersectionPoint = new Vector3()
        const intersected = raycaster.ray.intersectPlane(groundPlane, intersectionPoint)

        if (intersected) {
          setWorldMousePosition(intersectionPoint)
          setHasValidMousePosition(true)
        } else {
          setHasValidMousePosition(false)
        }
      } else {
        setHasValidMousePosition(false)
      }
    },
    [gl, camera, raycaster, groundPlane], // Correct, stable dependencies
  )

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      updateMousePosition(event)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [updateMousePosition])

  const getWorldMousePosition = () => {
    return {
      mouseX: worldMousePosition.x,
      mouseZ: worldMousePosition.z,
    }
  }

  return {
    mouse,
    isMouseInCanvas: isMouseInCanvas && hasValidMousePosition,
    getWorldMousePosition,
  }
}
