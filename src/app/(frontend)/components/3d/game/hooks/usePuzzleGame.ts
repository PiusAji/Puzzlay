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
  const generatePositions = useCallback((count: number): THREE.Vector3[] => {
    const positions: THREE.Vector3[] = []

    for (let i = 0; i < count; i++) {
      let validPosition = false
      let attempts = 0
      let newPos: THREE.Vector3

      while (!validPosition && attempts < 100) {
        newPos = new THREE.Vector3((Math.random() - 0.5) * 20, 0, Math.random() * 10 + 5)

        validPosition = positions.every((pos) => pos.distanceTo(newPos) >= MIN_PIECE_DISTANCE)
        attempts++
      }

      if (!validPosition) {
        // Grid fallback
        const gridSize = Math.ceil(Math.sqrt(count))
        const row = Math.floor(i / gridSize)
        const col = i % gridSize
        newPos = new THREE.Vector3(
          (col - gridSize / 2) * MIN_PIECE_DISTANCE,
          0,
          (row - gridSize / 2) * MIN_PIECE_DISTANCE + 8,
        )
      }

      positions.push(newPos!)
    }

    return positions
  }, [])

  // Initialize pieces
  const initialPieceStates = useMemo(() => {
    if (!scene) return []

    const extractedPieces: THREE.Mesh[] = []
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const clonedMesh = child.clone(true)
        extractedPieces.push(clonedMesh)
      }
    })

    if (extractedPieces.length === 0) return []

    const scatteredPositions = generatePositions(extractedPieces.length)

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

    return pieces.map((p, i) => ({
      ...p,
      currentPosition: scatteredPositions[i].clone(),
    }))
  }, [scene, generatePositions])

  const [pieceStates, setPieceStates] = useState<PieceState[]>(initialPieceStates)
  const [completedConnections, setCompletedConnections] = useState(0)
  const dragStartPositions = useRef<Map<string, THREE.Vector3>>(new Map())

  useEffect(() => {
    setPieceStates(initialPieceStates)
    setCompletedConnections(0)
  }, [initialPieceStates])

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
  }
}
