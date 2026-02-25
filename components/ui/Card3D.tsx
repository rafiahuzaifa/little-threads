'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface Card3DProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  glare?: boolean
  scale?: number
}

export function Card3D({
  children,
  className = '',
  intensity = 15,
  glare = true,
  scale = 1.04,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useSpring(0, { stiffness: 300, damping: 30 })
  const y = useSpring(0, { stiffness: 300, damping: 30 })
  const glareX = useSpring(50, { stiffness: 300, damping: 30 })
  const glareY = useSpring(50, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      const xVal = (e.clientX - rect.left) / rect.width - 0.5
      const yVal = (e.clientY - rect.top) / rect.height - 0.5
      x.set(xVal)
      y.set(yVal)
      glareX.set(((e.clientX - rect.left) / rect.width) * 100)
      glareY.set(((e.clientY - rect.top) / rect.height) * 100)
    },
    [x, y, glareX, glareY]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    glareX.set(50)
    glareY.set(50)
    setIsHovered(false)
  }, [x, y, glareX, glareY])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        scale: isHovered ? scale : 1,
      }}
      transition={{ scale: { duration: 0.3 } }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Glare effect */}
      {glare && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-50 overflow-hidden"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.25) 0%, transparent 60%)`
            ),
          }}
        />
      )}
    </motion.div>
  )
}
