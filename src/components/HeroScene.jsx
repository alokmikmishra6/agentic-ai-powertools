import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/**
 * 3D Metallic Torus that rotates based on scroll position
 * Inspired by ascendmarketing.xyz hero object
 */
function RotatingTorus() {
  const meshRef = useRef()
  const scrollRef = useRef({ y: 0, mouseX: 0, mouseY: 0 })
  const rotationRef = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current.y = window.scrollY
    }
    const onMouse = (e) => {
      scrollRef.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      scrollRef.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const scroll = scrollRef.current.y
    const mouseX = scrollRef.current.mouseX
    const mouseY = scrollRef.current.mouseY

    // Scroll-driven rotation — rotates as you scroll down
    const scrollRotX = scroll * 0.002
    const scrollRotY = scroll * 0.001
    const scrollRotZ = scroll * 0.0005

    // Mouse influence — gentle tilt
    const mouseInfluenceX = mouseY * 0.15
    const mouseInfluenceY = mouseX * 0.15

    // Smooth interpolation
    const lerp = (a, b, t) => a + (b - a) * t
    rotationRef.current.x = lerp(rotationRef.current.x, scrollRotX + mouseInfluenceX + 0.3, 0.03)
    rotationRef.current.y = lerp(rotationRef.current.y, scrollRotY + mouseInfluenceY, 0.03)
    rotationRef.current.z = lerp(rotationRef.current.z, scrollRotZ, 0.03)

    meshRef.current.rotation.x = rotationRef.current.x
    meshRef.current.rotation.y = rotationRef.current.y
    meshRef.current.rotation.z = rotationRef.current.z

    // Subtle floating motion
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* Torus: radius 2.2, tube radius 0.35, many segments for ribbed look */}
      <torusGeometry args={[2.2, 0.35, 64, 128]} />
      <meshStandardMaterial
        color="#b0b0b0"
        metalness={1}
        roughness={0.15}
        envMapIntensity={1.5}
      />
    </mesh>
  )
}

function LightRays() {
  const raysRef = useRef()

  useFrame((state) => {
    if (raysRef.current) {
      raysRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={raysRef}>
      {/* God rays effect using elongated planes with emissive material */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const length = 6 + Math.random() * 3
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.5,
              Math.sin(angle) * 0.5,
              -1.5,
            ]}
            rotation={[0, 0, angle]}
          >
            <planeGeometry args={[0.03 + Math.random() * 0.04, length]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.06 + Math.random() * 0.04}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function HeroScene() {
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    // Only render when hero is visible for performance
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
          dpr={[1, 1.5]}
        >
          {/* Dramatic lighting */}
          <ambientLight intensity={0.1} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-3, -2, 4]} intensity={0.5} color="#aaaacc" />
          <pointLight position={[0, 0, -3]} intensity={2} color="#ffffff" distance={10} />
          <spotLight
            position={[0, 3, 2]}
            intensity={1.5}
            angle={0.5}
            penumbra={0.8}
            color="#ffffff"
          />

          <LightRays />
          <RotatingTorus />
          <Environment preset="studio" />
        </Canvas>
      )}
    </div>
  )
}
