'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Group, Mesh } from 'three'
import * as THREE from 'three'

interface ThreeFrameRendererProps {
  frameModelUrl?: string
  framePosition?: {
    center_x: number
    center_y: number
    width: number
    height: number
  }
  landmarks?: {
    left_eye: number[][]
    right_eye: number[][]
  }
}

function FrameModel({ frameModelUrl, framePosition }: { frameModelUrl?: string; framePosition?: any }) {
  const meshRef = useRef<Group>(null)
  
  // Load 3D model if available
  const { scene } = useGLTF(frameModelUrl || '/models/default-frame.glb')
  
  useFrame((state) => {
    if (meshRef.current) {
      // Rotate the frame slightly for better viewing
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={[1, 1, 1]} />
    </group>
  )
}

function DefaultFrame({ framePosition }: { framePosition?: any }) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 0.8, 0.1]} />
      <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      
      {/* Lens frames */}
      <mesh position={[-0.6, 0, 0.05]}>
        <boxGeometry args={[0.8, 0.6, 0.05]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.6, 0, 0.05]}>
        <boxGeometry args={[0.8, 0.6, 0.05]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
      
      {/* Bridge */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </mesh>
  )
}

export default function ThreeFrameRenderer({ 
  frameModelUrl, 
  framePosition, 
  landmarks 
}: ThreeFrameRendererProps) {
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {frameModelUrl ? (
          <FrameModel frameModelUrl={frameModelUrl} framePosition={framePosition} />
        ) : (
          <DefaultFrame framePosition={framePosition} />
        )}
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
