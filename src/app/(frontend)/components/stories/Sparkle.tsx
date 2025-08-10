'use client'

import { useMemo, CSSProperties } from 'react'

interface SparkleProps {
  color: string
  size: number
  style: CSSProperties
}

export function Sparkle({ color, size, style }: SparkleProps) {
  const finalStyle: CSSProperties = useMemo(
    () => ({
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: '50%',
      position: 'absolute',
      animation: `bounce ${Math.random() * 2 + 1.5}s ease-in-out infinite`,
      ...style,
    }),
    [color, size, style],
  )

  return <div style={finalStyle} />
}
