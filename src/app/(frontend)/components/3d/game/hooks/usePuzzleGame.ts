import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useSound } from '../../hooks/useSound'

const SNAP_THRESHOLD = 1.0
const MIN_PIECE_DISTANCE = 3.0

interface PieceState {
  id: string
  mesh: THREE.Mesh
  originalPosition: THREE.Vector3
  currentPosition: THREE.Vector3
  isDragging: boolean
  isConnected: boolean
  partners: { partnerId: string }[]
  lastConnected?: boolean
}

export function usePuzzleGame(modelUrl: string, _textureUrl: string) {
  const { scene } = useGLTF(modelUrl)
  const { raycaster, size } = useThree()
  const playSnapSound = useSound('/sounds/snap.mp3', 0.7)
  const playSuccessSound = useSound('/sounds/success.mp3', 0.6)

  // Generate scattered positions
  const generatePositions = useCallback(
    (count: number, minX: number, maxX: number, minZ: number, maxZ: number): THREE.Vector3[] => {
      const positions: THREE.Vector3[] = []
      const rangeX = maxX - minX
      const rangeZ = maxZ - minZ

      for (let i = 0; i < count; i++) {
        let validPosition = false
        let attempts = 0
        let newPos: THREE.Vector3

        while (!validPosition && attempts < 100) {
          newPos = new THREE.Vector3(
            Math.random() * rangeX + minX,
            0,
            Math.random() * rangeZ + minZ,
          )

          validPosition = positions.every((pos) => pos.distanceTo(newPos) >= MIN_PIECE_DISTANCE)
          attempts++
        }

        if (!validPosition) {
          // Fallback to a more compact grid if random placement fails
          const gridSize = Math.ceil(Math.sqrt(count))
          const row = Math.floor(i / gridSize)
          const col = i % gridSize
          newPos = new THREE.Vector3(
            minX + (col / gridSize) * rangeX,
            0,
            minZ + (row / gridSize) * rangeZ,
          )
        }

        positions.push(newPos!)
      }

      return positions
    },
    [],
  )

  const puzzleBounds: THREE.Box3 = useMemo(() => {
    const box = new THREE.Box3()
    // Calculate bounds based on original positions to keep the camera static
    if (!scene) return box // Return empty box if scene is not available yet

    const tempPieces: { mesh: THREE.Mesh; originalPosition: THREE.Vector3 }[] = []
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        tempPieces.push({ mesh: child.clone(), originalPosition: child.position.clone() })
      }
    })

    tempPieces.forEach((p: { mesh: THREE.Mesh; originalPosition: THREE.Vector3 }) => {
      const meshClone = p.mesh.clone()
      meshClone.position.copy(p.originalPosition)
      meshClone.updateMatrixWorld(true) // Ensure world matrix is updated for correct bounding box calculation
      box.expandByObject(meshClone)
    })
    return box
  }, [scene])

  // Calculate scatter area bounds based on puzzleBounds
  const scatterAreaBounds: THREE.Box3 = useMemo(() => {
    const scatterPadding = 5 // Adjust this value as needed for desired padding
    const bounds = puzzleBounds.clone()
    bounds.min.x -= scatterPadding
    bounds.max.x += scatterPadding
    bounds.min.z -= scatterPadding
    bounds.max.z += scatterPadding
    return bounds
  }, [puzzleBounds])

  // Initialize pieces
  const initialPieceStates: PieceState[] = useMemo(() => {
    if (!scene) return []

    const extractedPieces: THREE.Mesh[] = []
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const clonedMesh = child.clone(true)
        extractedPieces.push(clonedMesh)
      }
    })

    if (extractedPieces.length === 0) return []

    const scatteredPositions = generatePositions(
      extractedPieces.length,
      scatterAreaBounds.min.x,
      scatterAreaBounds.max.x,
      scatterAreaBounds.min.z,
      scatterAreaBounds.max.z,
    )

    const pieces = extractedPieces.map((mesh) => {
      const size = new THREE.Vector3()
      mesh.geometry.computeBoundingBox()
      mesh.geometry.boundingBox?.getSize(size)
      return {
        id: mesh.uuid,
        mesh,
        originalPosition: mesh.position.clone(),
        currentPosition: new THREE.Vector3(), // Will be set later
        isDragging: false,
        isConnected: false,
        partners: [] as { partnerId: string }[],
        size,
      }
    })

    // Determine partners by checking distance between original positions
    pieces.forEach((p1) => {
      pieces.forEach((p2) => {
        if (p1.id === p2.id) return
        const dist = p1.originalPosition.distanceTo(p2.originalPosition)
        const threshold = Math.max(p1.size.x, p1.size.z, p2.size.x, p2.size.z) * 1.1
        if (dist < threshold) {
          p1.partners.push({ partnerId: p2.id })
        }
      })
    })

    // Identify the top-left piece and apply a small offset to its originalPosition
    let minX = Infinity
    let minZ = Infinity
    let topLeftPieceId: string | null = null

    pieces.forEach((p) => {
      if (p.originalPosition.x < minX) {
        minX = p.originalPosition.x
      }
      if (p.originalPosition.z < minZ) {
        minZ = p.originalPosition.z
      }
    })

    // Find the piece that is closest to the minX and minZ
    let closestDist = Infinity
    pieces.forEach((p) => {
      const dist = Math.sqrt(
        Math.pow(p.originalPosition.x - minX, 2) + Math.pow(p.originalPosition.z - minZ, 2),
      )
      if (dist < closestDist) {
        closestDist = dist
        topLeftPieceId = p.id
      }
    })

    // Apply the fix: adjust the originalPosition of the top-left piece
    if (topLeftPieceId) {
      const TOP_LEFT_OFFSET = 0.1 // Small adjustment to move it slightly inward
      pieces.forEach((p) => {
        if (p.id === topLeftPieceId) {
          p.originalPosition.x += TOP_LEFT_OFFSET
          p.originalPosition.z += -0.07
        }
      })
    }

    return pieces.map((p, i) => ({
      ...p,
      currentPosition: scatteredPositions[i].clone(),
    }))
  }, [scene, generatePositions, scatterAreaBounds])

  const [pieceStates, setPieceStates] = useState<PieceState[]>(initialPieceStates)
  const [completedConnections, setCompletedConnections] = useState(0)
  const dragStartPositions = useRef<Map<string, THREE.Vector3>>(new Map())

  // Reset lastConnected flag
  useEffect(() => {
    if (pieceStates.some((p) => p.lastConnected)) {
      const timer = setTimeout(() => {
        setPieceStates((prev) => prev.map((p) => ({ ...p, lastConnected: false })))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [pieceStates])

  const handleDragStart = useCallback((pieceId: string) => {
    setPieceStates((prev) => {
      const piece = prev.find((p) => p.id === pieceId)
      if (!piece || piece.isConnected) return prev // Prevent dragging connected pieces

      // Use the logical position from the state as the starting point
      dragStartPositions.current.set(pieceId, piece.currentPosition.clone())
      return prev.map((p) => (p.id === pieceId ? { ...p, isDragging: true } : p))
    })
  }, [])

  const handleDrag = useCallback(
    (pieceId: string, [x, y]: [number, number], camera: THREE.Camera) => {
      const piece = pieceStates.find((p) => p.id === pieceId)
      if (!piece) return

      // Create a virtual plane to intersect with
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const mouse = new THREE.Vector2((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1)

      raycaster.setFromCamera(mouse, camera)

      const intersection = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        setPieceStates((prev) =>
          prev.map((p) => (p.id === pieceId ? { ...p, currentPosition: intersection } : p)),
        )
      }
    },
    [pieceStates, raycaster, size],
  )

  const handleDragEnd = useCallback(
    (pieceId: string) => {
      dragStartPositions.current.delete(pieceId)
      setPieceStates((prevStates) => {
        let newStates = prevStates.map((p) => ({ ...p, isDragging: false, lastConnected: false }))
        const draggedPiece = newStates.find((p) => p.id === pieceId)

        if (!draggedPiece) return newStates

        let connectionMade = false

        for (const partnerInfo of draggedPiece.partners) {
          const partner = newStates.find((p) => p.id === partnerInfo.partnerId)
          if (!partner) continue

          const distance = draggedPiece.currentPosition.distanceTo(partner.currentPosition)

          if (distance < SNAP_THRESHOLD) {
            const isNewConnection = !draggedPiece.isConnected || !partner.isConnected
            if (isNewConnection) {
              connectionMade = true
              newStates = newStates.map((p) => {
                if (p.id === draggedPiece.id)
                  return {
                    ...p,
                    isConnected: true,
                    lastConnected: true,
                    currentPosition: p.originalPosition,
                  }
                if (p.id === partner.id)
                  return {
                    ...p,
                    isConnected: true,
                    lastConnected: true,
                    currentPosition: p.originalPosition,
                  }
                return p
              })
            }
          }
        }

        if (connectionMade) {
          playSnapSound()
          const connectedCount = newStates.filter((p) => p.isConnected).length
          setCompletedConnections(connectedCount)
        }

        return newStates
      })
    },
    [playSnapSound],
  )

  const { totalConnections, totalPieces } = useMemo(() => {
    if (pieceStates.length === 0) {
      return { totalConnections: 0, totalPieces: 0 }
    }
    return {
      totalConnections: pieceStates.length,
      totalPieces: pieceStates.length,
    }
  }, [pieceStates])

  const puzzleCompleted = useMemo(() => {
    if (totalPieces === 0) return false
    return completedConnections > 0 && completedConnections >= totalPieces
  }, [completedConnections, totalPieces])

  useEffect(() => {
    if (puzzleCompleted) {
      playSuccessSound()
    }
  }, [puzzleCompleted, playSuccessSound])

  return {
    pieceStates,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    puzzleCompleted,
    completedConnections,
    totalConnections,
    totalPieces,
    puzzleBounds,
  }
}
