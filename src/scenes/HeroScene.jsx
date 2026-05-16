import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

/* ── Outer wireframe sphere with gentle breathing ── */
function CoreSphere() {
  const mesh = useRef()
  const geo = useRef()
  const original = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    mesh.current.rotation.x = t * 0.035
    mesh.current.rotation.y = t * 0.05

    const pos = geo.current.attributes.position
    if (!original.current) original.current = pos.array.slice()
    const orig = original.current
    for (let i = 0; i < pos.count; i++) {
      const ox = orig[i * 3], oy = orig[i * 3 + 1], oz = orig[i * 3 + 2]
      const wave = Math.sin(ox * 1.2 + t * 0.35) * Math.cos(oy * 1.2 + t * 0.25) * 0.045
      pos.array[i * 3]     = ox * (1 + wave)
      pos.array[i * 3 + 1] = oy * (1 + wave)
      pos.array[i * 3 + 2] = oz * (1 + wave)
    }
    pos.needsUpdate = true
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry ref={geo} args={[2.6, 5]} />
      <meshBasicMaterial color="#8b7cf6" wireframe transparent opacity={0.14} />
    </mesh>
  )
}

/* ── Inner counter-rotating core ── */
function InnerCore() {
  const mesh = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    mesh.current.rotation.x = -t * 0.025
    mesh.current.rotation.z = t * 0.04
    const s = 1 + Math.sin(t * 0.5) * 0.012
    mesh.current.scale.setScalar(s)
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.3, 2]} />
      <meshBasicMaterial color="#7b6cf0" wireframe transparent opacity={0.06} />
    </mesh>
  )
}

/* ── Thin orbital ring ── */
function OrbitalRing({ radius, tilt, speed = 0.015, opacity = 0.08 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * speed
  })

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.003, 6, 128]} />
      <meshBasicMaterial color="#7b6cf0" transparent opacity={opacity} />
    </mesh>
  )
}

/* ── Sparse ambient particles ── */
function AmbientParticles({ count = 45 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 24
      p[i * 3 + 1] = (Math.random() - 0.5) * 18
      p[i * 3 + 2] = (Math.random() - 0.5) * 14
    }
    return p
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += Math.sin(t * 0.12 + i * 0.3) * 0.0006
      pos.array[i * 3]     += Math.cos(t * 0.08 + i * 0.7) * 0.0003
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#a594f9" transparent opacity={0.3} sizeAttenuation />
    </points>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#060611']} />
      <fog attach="fog" args={['#060611', 10, 32]} />
      <ambientLight intensity={0.15} />
      <CoreSphere />
      <InnerCore />
      <OrbitalRing radius={4.0} tilt={1.15} speed={0.012} opacity={0.07} />
      <OrbitalRing radius={4.8} tilt={0.5} speed={-0.008} opacity={0.04} />
      <AmbientParticles count={45} />
      <Stars radius={80} depth={100} count={600} factor={2} saturation={0} fade speed={0.2} />
    </Canvas>
  )
}
