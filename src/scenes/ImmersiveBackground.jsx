import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WireframeGlobe() {
  const groupRef = useRef()
  const matRef = useRef()
  const ringMat1Ref = useRef()
  const ringMat2Ref = useRef()
  const scrollRef = useRef(0)

  const ringGeo1 = useMemo(() => new THREE.TorusGeometry(4.0, 0.01, 16, 80), [])
  const ringGeo2 = useMemo(() => new THREE.TorusGeometry(4.6, 0.01, 16, 100), [])

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const scroll = scrollRef.current
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? scroll / maxScroll : 0

    if (groupRef.current) {
      // Move across screen: starts right, drifts toward center-left
      const xPos = 3.5 - progress * 4.5  // right → slightly left
      const yPos = 0.3 - progress * 1.5   // gentle downward drift
      groupRef.current.position.set(xPos, yPos, -2)

      // Scale: starts bigger, shrinks as you scroll down
      const scale = 1.1 - progress * 0.35
      groupRef.current.scale.setScalar(scale)

      // Rotation
      groupRef.current.rotation.y = t * 0.08 + progress * Math.PI * 0.8
      groupRef.current.rotation.x = 0.3 + t * 0.02 + progress * 0.6
      groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.1
    }

    if (matRef.current) {
      const pulse = 0.12 + Math.sin(t * 0.8) * 0.04 + Math.sin(t * 0.3) * 0.03
      matRef.current.opacity = pulse
    }
    if (ringMat1Ref.current) {
      ringMat1Ref.current.opacity = 0.10 + Math.sin(t * 0.5 + 1.0) * 0.04
    }
    if (ringMat2Ref.current) {
      ringMat2Ref.current.opacity = 0.07 + Math.sin(t * 0.7 + 2.0) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={[3.0, 0.5, 0]}>
      {/* Main wireframe sphere */}
      <lineSegments>
        <wireframeGeometry args={[new THREE.SphereGeometry(3.2, 32, 24)]} />
        <lineBasicMaterial ref={matRef} color="#c9a87c" transparent opacity={0.18} />
      </lineSegments>

      {/* Inner sphere for depth */}
      <lineSegments rotation={[0.5, 0.3, 0]}>
        <wireframeGeometry args={[new THREE.SphereGeometry(2.8, 20, 16)]} />
        <lineBasicMaterial color="#c9a87c" transparent opacity={0.06} />
      </lineSegments>

      {/* Orbital ring 1 — tilted */}
      <mesh geometry={ringGeo1} rotation={[1.2, 0.3, 0.2]}>
        <meshBasicMaterial ref={ringMat1Ref} color="#c9a87c" transparent opacity={0.12} side={THREE.DoubleSide} wireframe />
      </mesh>

      {/* Orbital ring 2 — different tilt */}
      <mesh geometry={ringGeo2} rotation={[0.6, -0.5, 0.8]}>
        <meshBasicMaterial ref={ringMat2Ref} color="#c9a87c" transparent opacity={0.08} side={THREE.DoubleSide} wireframe />
      </mesh>
    </group>
  )
}

export default function ImmersiveBackground() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <WireframeGlobe />
      </Canvas>
    </div>
  )
}
