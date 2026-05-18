import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Smooth lerp helper
function damp(current, target, speed, dt) {
  return current + (target - current) * (1 - Math.exp(-speed * dt))
}

// ═══ COSMOS STARFIELD — The universe horizon ═══
function CosmosStarfield() {
  const groupRef = useRef()
  const starsRef = useRef()
  const scrollRef = useRef(0)

  const starCount = 800
  const starData = useMemo(() => {
    const positions = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)
    const colors = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 15 + Math.random() * 40
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6 + 2
      positions[i * 3 + 2] = r * Math.cos(phi) - 10

      sizes[i] = 0.015 + Math.random() * 0.05

      // Warm color palette: whites, golds, soft blues
      const colorType = Math.random()
      if (colorType < 0.5) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1
      } else if (colorType < 0.75) {
        colors[i * 3] = 0.93; colors[i * 3 + 1] = 0.82; colors[i * 3 + 2] = 0.62
      } else {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.82; colors[i * 3 + 2] = 1
      }
    }
    return { positions, sizes, colors }
  }, [])

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const fadeStart = window.innerHeight * 0.05
    const fadeEnd = window.innerHeight * 0.5
    const scroll = scrollRef.current
    const visibility = Math.max(0, 1 - (scroll - fadeStart) / (fadeEnd - fadeStart))

    if (groupRef.current) {
      groupRef.current.visible = visibility > 0.01
      groupRef.current.rotation.y = t * 0.006
      groupRef.current.rotation.x = t * 0.002
    }

    if (starsRef.current) {
      starsRef.current.material.opacity = visibility * 0.8
      // Twinkle
      const sizes = starsRef.current.geometry.attributes.size.array
      for (let i = 0; i < Math.min(60, starCount); i++) {
        const base = starData.sizes[i]
        sizes[i] = base * (0.6 + Math.sin(t * 1.8 + i * 7.3) * 0.4)
      }
      starsRef.current.geometry.attributes.size.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={starCount} array={starData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={starCount} array={starData.sizes} itemSize={1} />
          <bufferAttribute attach="attributes-color" count={starCount} array={starData.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.04}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

// ═══ ORBITING PLANETS — Detailed celestial bodies with mouse reactivity ═══
function OrbitingPlanets() {
  const groupRef = useRef()
  const scrollRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })

  const planets = useMemo(() => [
    { orbitR: 9, speed: 0.1, size: 0.45, color: '#8b6cc4', ringColor: '#a988d8', hasRing: true, segments: 28, startAngle: 0 },
    { orbitR: 14, speed: 0.065, size: 0.6, color: '#4a8b9b', ringColor: '#6ab8cc', hasRing: true, segments: 32, startAngle: 2.1 },
    { orbitR: 18, speed: 0.04, size: 0.38, color: '#c9a87c', ringColor: '#d4b896', hasRing: false, segments: 24, startAngle: 4.2 },
    { orbitR: 6.5, speed: 0.15, size: 0.28, color: '#d4b896', ringColor: '#c9a87c', hasRing: true, segments: 20, startAngle: 1.0 },
  ], [])

  // Each planet is a group with sphere + inner wireframe + optional ring
  const planetGroupRefs = useRef(planets.map(() => null))

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    const fadeStart = window.innerHeight * 0.05
    const fadeEnd = window.innerHeight * 0.5
    const scroll = scrollRef.current
    const visibility = Math.max(0, 1 - (scroll - fadeStart) / (fadeEnd - fadeStart))

    // Smooth mouse
    smoothMouse.current.x = damp(smoothMouse.current.x, mouseRef.current.x, 2.5, delta)
    smoothMouse.current.y = damp(smoothMouse.current.y, mouseRef.current.y, 2.5, delta)
    const mx = smoothMouse.current.x
    const my = smoothMouse.current.y

    if (groupRef.current) {
      groupRef.current.visible = visibility > 0.01
      // Subtle mouse parallax on the whole group
      groupRef.current.rotation.y = mx * 0.08
      groupRef.current.rotation.x = my * 0.05
    }

    planetGroupRefs.current.forEach((ref, i) => {
      if (!ref) return
      const p = planets[i]
      const angle = p.startAngle + t * p.speed

      // Orbit position with mouse offset for parallax depth
      const depthFactor = p.orbitR / 18 // farther planets react less
      ref.position.x = Math.cos(angle) * p.orbitR + mx * depthFactor * 1.5
      ref.position.y = Math.sin(angle) * p.orbitR * 0.25 + Math.sin(angle * 0.7) * 1.2 + my * depthFactor * 0.8
      ref.position.z = Math.sin(angle) * p.orbitR * 0.5 - 6

      // Self rotation
      ref.rotation.y = t * (0.2 + i * 0.1)
      ref.rotation.x = t * 0.05 + i * 0.5

      // Opacity
      ref.children.forEach(child => {
        if (child.material) child.material.opacity = visibility * 0.55
      })
    })
  })

  return (
    <group ref={groupRef}>
      {planets.map((p, i) => (
        <group key={i} ref={el => planetGroupRefs.current[i] = el}>
          {/* Outer wireframe sphere */}
          <lineSegments>
            <wireframeGeometry args={[new THREE.SphereGeometry(p.size, p.segments, Math.floor(p.segments * 0.7))]} />
            <lineBasicMaterial color={p.color} transparent opacity={0.55} />
          </lineSegments>
          {/* Inner glowing core */}
          <mesh>
            <sphereGeometry args={[p.size * 0.5, 12, 8]} />
            <meshBasicMaterial color={p.color} transparent opacity={0.15} />
          </mesh>
          {/* Optional orbital ring */}
          {p.hasRing && (
            <mesh rotation={[Math.PI * 0.4 + i * 0.3, 0, i * 0.2]}>
              <torusGeometry args={[p.size * 1.6, 0.008, 8, 40]} />
              <meshBasicMaterial color={p.ringColor} transparent opacity={0.35} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

function WireframeGlobe() {
  const groupRef = useRef()
  const matRef = useRef()
  const innerMatRef = useRef()
  const ringMat1Ref = useRef()
  const ringMat2Ref = useRef()
  const particlesRef = useRef()
  const particleMatRef = useRef()

  const scrollRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const loadProgress = useRef(0)
  const { viewport } = useThree()

  // Particle system for assembly effect
  const particleCount = 200
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const targets = new Float32Array(particleCount * 3)
    const speeds = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Random scattered start positions (far away)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const startR = 8 + Math.random() * 12
      positions[i * 3] = startR * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = startR * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = startR * Math.cos(phi)

      // Target positions on the sphere surface
      const r = 3.2
      targets[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      targets[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      targets[i * 3 + 2] = r * Math.cos(phi)

      speeds[i] = 0.5 + Math.random() * 1.5
    }
    return { positions, targets, speeds }
  }, [])

  const ringGeo1 = useMemo(() => new THREE.TorusGeometry(4.0, 0.01, 16, 80), [])
  const ringGeo2 = useMemo(() => new THREE.TorusGeometry(4.6, 0.01, 16, 100), [])

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    const scroll = scrollRef.current
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? scroll / maxScroll : 0

    // Loading/assembly animation (first 3 seconds)
    loadProgress.current = Math.min(1, t / 2.5)
    const lp = loadProgress.current
    const eased = 1 - Math.pow(1 - lp, 3) // ease out cubic

    // Smooth mouse following
    smoothMouse.current.x = damp(smoothMouse.current.x, mouseRef.current.x, 3, delta)
    smoothMouse.current.y = damp(smoothMouse.current.y, mouseRef.current.y, 3, delta)
    const mx = smoothMouse.current.x
    const my = smoothMouse.current.y

    // ── Particle assembly animation ──
    if (particlesRef.current && lp < 1) {
      const geo = particlesRef.current.geometry
      const pos = geo.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3
        const speed = particleData.speeds[i]
        const t2 = Math.min(1, lp * speed * 1.2)
        const ease = 1 - Math.pow(1 - t2, 4)
        pos[idx] = particleData.positions[idx] + (particleData.targets[idx] - particleData.positions[idx]) * ease
        pos[idx + 1] = particleData.positions[idx + 1] + (particleData.targets[idx + 1] - particleData.positions[idx + 1]) * ease
        pos[idx + 2] = particleData.positions[idx + 2] + (particleData.targets[idx + 2] - particleData.positions[idx + 2]) * ease
      }
      geo.attributes.position.needsUpdate = true
    }
    if (particleMatRef.current) {
      // Particles fade out as globe fades in
      particleMatRef.current.opacity = Math.max(0, 1 - lp * 1.5) * 0.6
    }

    if (groupRef.current) {
      // Landing phase: globe centered. After first viewport scroll, drift to right side
      // progress is 0-1 of total scroll. First viewport ≈ first ~15% of scroll
      const landingScroll = Math.min(1, scroll / (window.innerHeight * 0.8))
      
      // Start centered (x:0), drift to right as user scrolls past landing
      const baseX = landingScroll * 3.5 - progress * 2.0
      const baseY = landingScroll * -0.5 + 0.2 - progress * 0.8
      const xPos = baseX + mx * 0.5
      const yPos = baseY + my * 0.3
      groupRef.current.position.set(xPos, yPos, -2)

      // Scale: large on landing, shrinks as content appears
      const entryScale = 0.3 + eased * 0.7
      const landingScale = 1.3 - landingScroll * 0.3
      const scrollScale = 1.0 - progress * 0.25
      groupRef.current.scale.setScalar(entryScale * landingScale * scrollScale)

      // Rotation: time + scroll + mouse tilt
      groupRef.current.rotation.y = t * 0.06 + progress * Math.PI * 0.7 + mx * 0.15
      groupRef.current.rotation.x = 0.25 + t * 0.015 + progress * 0.5 + my * 0.1
      groupRef.current.rotation.z = Math.sin(t * 0.04) * 0.08 + mx * 0.05
    }

    // Globe opacity: fades in during assembly
    if (matRef.current) {
      const base = 0.12 + Math.sin(t * 0.8) * 0.04 + Math.sin(t * 0.3) * 0.03
      // Glow brighter when mouse is near center of globe
      const mouseProximity = 1 - Math.min(1, Math.sqrt(mx * mx + my * my))
      matRef.current.opacity = (base + mouseProximity * 0.06) * eased
    }
    if (innerMatRef.current) {
      innerMatRef.current.opacity = 0.04 * eased
    }
    if (ringMat1Ref.current) {
      ringMat1Ref.current.opacity = (0.10 + Math.sin(t * 0.5 + 1.0) * 0.04) * eased
    }
    if (ringMat2Ref.current) {
      ringMat2Ref.current.opacity = (0.07 + Math.sin(t * 0.7 + 2.0) * 0.03) * eased
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.2, -2]}>
      {/* Particle assembly system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particleData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={particleMatRef}
          color="#c9a87c"
          size={0.04}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Main wireframe sphere */}
      <lineSegments>
        <wireframeGeometry args={[new THREE.SphereGeometry(3.2, 32, 24)]} />
        <lineBasicMaterial ref={matRef} color="#c9a87c" transparent opacity={0} />
      </lineSegments>

      {/* Inner sphere for depth */}
      <lineSegments rotation={[0.5, 0.3, 0]}>
        <wireframeGeometry args={[new THREE.SphereGeometry(2.8, 20, 16)]} />
        <lineBasicMaterial ref={innerMatRef} color="#c9a87c" transparent opacity={0} />
      </lineSegments>

      {/* Orbital ring 1 */}
      <mesh geometry={ringGeo1} rotation={[1.2, 0.3, 0.2]}>
        <meshBasicMaterial ref={ringMat1Ref} color="#c9a87c" transparent opacity={0} side={THREE.DoubleSide} wireframe />
      </mesh>

      {/* Orbital ring 2 */}
      <mesh geometry={ringGeo2} rotation={[0.6, -0.5, 0.8]}>
        <meshBasicMaterial ref={ringMat2Ref} color="#c9a87c" transparent opacity={0} side={THREE.DoubleSide} wireframe />
      </mesh>
    </group>
  )
}

function AmbientParticles() {
  const ref = useRef()
  const count = 80
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        const idx = i * 3
        pos[idx + 1] += Math.sin(t * 0.3 + i * 0.5) * 0.002
        pos[idx] += Math.cos(t * 0.2 + i * 0.3) * 0.001
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.02} transparent opacity={0.15} sizeAttenuation />
    </points>
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
        <CosmosStarfield />
        <OrbitingPlanets />
        <AmbientParticles />
        <WireframeGlobe />
      </Canvas>
    </div>
  )
}
