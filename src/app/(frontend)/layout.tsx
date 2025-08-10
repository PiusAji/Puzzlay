import React from 'react'
import CanvasWrapper from './components/3d/CanvasWrapper'
import '../globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <CanvasWrapper />
        {children}
      </body>
    </html>
  )
}
