'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

function FloatingCloth({ position, color, size = 1 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.3
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.3
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size * 0.8, size * 1.2, size * 0.05]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  )
}

function FloatingStar({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.8
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.4
  })

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[0.15, 0.05, 8, 5]} />
      <meshStandardMaterial color="#FFD93D" roughness={0.2} metalness={0.8} />
    </mesh>
  )
}

function FloatingBubble({ position, color, radius = 0.25 }: { position: [number, number, number]; color: string; radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[2]) * 0.5
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} transparent opacity={0.7} roughness={0.1} metalness={0.3} />
    </mesh>
  )
}

function Scene() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 5)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#fff5f8" />
      <pointLight position={[-3, 3, 3]} intensity={0.8} color="#FF6B9D" />
      <pointLight position={[3, -2, 2]} intensity={0.6} color="#4FC3F7" />

      <FloatingCloth position={[-2.5, 1, 0]} color="#FF6B9D" size={1.2} />
      <FloatingCloth position={[2.5, 0.5, -1]} color="#4FC3F7" size={1.0} />
      <FloatingCloth position={[-1.5, -1, -0.5]} color="#C77DFF" size={0.8} />
      <FloatingCloth position={[1.8, -0.8, 0]} color="#6BCB77" size={1.1} />

      <FloatingStar position={[-3, 2, 1]} />
      <FloatingStar position={[3, 1.5, 0.5]} />
      <FloatingStar position={[0, 2.5, -0.5]} />
      <FloatingStar position={[-1, -2, 1]} />

      <FloatingBubble position={[-3.5, -0.5, 0.5]} color="#FF6B9D" radius={0.22} />
      <FloatingBubble position={[3.5, 1, -0.5]} color="#FFD93D" radius={0.28} />
      <FloatingBubble position={[0, -2, 0]} color="#C77DFF" radius={0.20} />
      <FloatingBubble position={[-2, 0, 1]} color="#4FC3F7" radius={0.30} />
      <FloatingBubble position={[2, 2, 0.5]} color="#6BCB77" radius={0.24} />
      <FloatingBubble position={[1, -1, -1]} color="#FF8B64" radius={0.26} />

      <Environment preset="city" />
    </>
  )
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
