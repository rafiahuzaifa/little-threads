'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

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

      <FloatingStar position={[-3, 2, 1]} />
      <FloatingStar position={[3, 1.5, 0.5]} />
      <FloatingStar position={[0, 2.5, -0.5]} />
      <FloatingStar position={[-1, -2, 1]} />

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
