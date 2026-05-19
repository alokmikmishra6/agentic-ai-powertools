import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN PHILOSOPHY:
   The 3D scene visualizes "the architecture of intelligence" — not generic
   space/planets. Every element has meaning:
   - Central nexus = the intelligence core (icosahedron — platonic solid)
   - Network nodes = distributed systems / microservices / agents
   - Connection lines = data flow / architecture relationships
   - Flowing particles = live data streaming through the system
   - Ambient field = the possibility space of computation

   Color system: Single gold (#c9a87c) palette with opacity for depth.
   This creates visual unity between 3D scene and UI.
   ═══════════════════════════════════════════════════════════════════════════ */

function damp(current, target, speed, dt) {
  return current + (target - current) * (1 - Math.exp(-speed * dt))
}

// Seeded random for deterministic node placement
function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

// ═══ NETWORK GRAPH — The core visualization ═══
function NetworkGraph() {
  const groupRef = useRef()
  const linesRef = useRef()
  const nodesRef = useRef([])
  const nexusRef = useRef()
  const nexusInnerRef = useRef()
  const flowRef = useRef()
  const fieldRef = useRef()

  const scrollRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const loadProgress = useRef(0)

  // Generate network topology
  const nodeCount = 18
  const network = useMemo(() => {
    const nodes = []
    const connections = []

    for (let i = 0; i < nodeCount; i++) {
      const layer = i < 5 ? 0 : i < 12 ? 1 : 2
      const layerRadius = [3.5, 6.5, 10][layer]
      const angleOffset = layer * 0.4
      const nodesInLayer = [5, 7, 6][layer]
      const indexInLayer = i - [0, 5, 12][layer]
      const angle = angleOffset + (indexInLayer / nodesInLayer) * Math.PI * 2
      const elevation = (seededRandom(i * 7 + 3) - 0.5) * layerRadius * 0.6

      const x = Math.cos(angle) * layerRadius + (seededRandom(i * 13) - 0.5) * 1.5
      const y = elevation
      const z = Math.sin(angle) * layerRadius * 0.7 + (seededRandom(i * 19) - 0.5) * 2 - 3

      const size = [0.25, 0.16, 0.1][layer]
      const geoType = layer

      nodes.push({ x, y, z, size, layer, geoType, angle })
    }

    // Connect nearby nodes, prioritize cross-layer connections
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dz = nodes[i].z - nodes[j].z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const layerDiff = Math.abs(nodes[i].layer - nodes[j].layer)
        const threshold = layerDiff === 1 ? 5.5 : layerDiff === 0 ? 4.0 : 8.0

        if (dist < threshold && seededRandom(i * 100 + j) > 0.35) {
          connections.push([i, j, dist])
        }
      }
    }

    return { nodes, connections }
  }, [])

  // Line geometry for connections
  const linePositions = useMemo(() => {
    const arr = new Float32Array(network.connections.length * 6)
    network.connections.forEach(([i, j], idx) => {
      arr[idx * 6] = network.nodes[i].x
      arr[idx * 6 + 1] = network.nodes[i].y
      arr[idx * 6 + 2] = network.nodes[i].z
      arr[idx * 6 + 3] = network.nodes[j].x
      arr[idx * 6 + 4] = network.nodes[j].y
      arr[idx * 6 + 5] = network.nodes[j].z
    })
    return arr
  }, [network])

  // Data flow particles
  const flowCount = 90
  const flowData = useMemo(() => {
    const positions = new Float32Array(flowCount * 3)
    const meta = []
    for (let i = 0; i < flowCount; i++) {
      const connIdx = Math.floor(seededRandom(i * 37) * network.connections.length)
      const progress = seededRandom(i * 53)
      const speed = 0.3 + seededRandom(i * 71) * 0.7
      meta.push({ connIdx, progress, speed })
    }
    return { positions, meta }
  }, [network])

  // Ambient field particles
  const fieldCount = 180
  const fieldPositions = useMemo(() => {
    const arr = new Float32Array(fieldCount * 3)
    for (let i = 0; i < fieldCount; i++) {
      const theta = seededRandom(i * 23) * Math.PI * 2
      const phi = Math.acos(2 * seededRandom(i * 31) - 1)
      const r = 4 + seededRandom(i * 41) * 16
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5
      arr[i * 3 + 2] = r * Math.cos(phi) * 0.7 - 4
    }
    return arr
  }, [])

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

    // Entry animation (3s assembly)
    loadProgress.current = Math.min(1, t / 3.0)
    const lp = loadProgress.current
    const eased = 1 - Math.pow(1 - lp, 3)

    // Smooth mouse
    smoothMouse.current.x = damp(smoothMouse.current.x, mouseRef.current.x, 3, delta)
    smoothMouse.current.y = damp(smoothMouse.current.y, mouseRef.current.y, 3, delta)
    const mx = smoothMouse.current.x
    const my = smoothMouse.current.y

    // Landing/scroll phase
    const landingScroll = Math.min(1, scroll / (window.innerHeight * 0.8))

    if (groupRef.current) {
      const baseX = landingScroll * 3.0 - progress * 1.5
      const baseY = landingScroll * -0.3 + 0.1 - progress * 0.5
      groupRef.current.position.set(
        baseX + mx * 0.6,
        baseY + my * 0.4,
        -2
      )

      const entryScale = 0.15 + eased * 0.85
      const scrollScale = 1.0 - progress * 0.2
      groupRef.current.scale.setScalar(entryScale * scrollScale)

      groupRef.current.rotation.y = t * 0.03 + progress * Math.PI * 0.4 + mx * 0.12
      groupRef.current.rotation.x = 0.15 + t * 0.01 + progress * 0.3 + my * 0.08
    }

    // ── Nexus ──
    if (nexusRef.current) {
      nexusRef.current.rotation.y = t * 0.15
      nexusRef.current.rotation.x = t * 0.08
      const pulse = 0.2 + Math.sin(t * 1.2) * 0.05 + Math.sin(t * 0.4) * 0.03
      const mouseGlow = 1 - Math.min(1, Math.sqrt(mx * mx + my * my))
      nexusRef.current.material.opacity = (pulse + mouseGlow * 0.1) * eased
    }
    if (nexusInnerRef.current) {
      nexusInnerRef.current.rotation.y = -t * 0.2
      nexusInnerRef.current.rotation.z = t * 0.12
      nexusInnerRef.current.material.opacity = (0.4 + Math.sin(t * 0.8) * 0.12) * eased
    }

    // ── Network nodes ──
    nodesRef.current.forEach((ref, i) => {
      if (!ref) return
      const node = network.nodes[i]
      const breathe = 1 + Math.sin(t * 0.5 + i * 1.3) * 0.08
      ref.scale.setScalar(breathe * eased)
      ref.position.x = node.x + Math.sin(t * 0.3 + i * 2.1) * 0.12
      ref.position.y = node.y + Math.cos(t * 0.25 + i * 1.7) * 0.08
      ref.position.z = node.z + Math.sin(t * 0.2 + i * 3.3) * 0.08
      ref.rotation.y = t * 0.2 + i
      ref.rotation.x = t * 0.1 + i * 0.5
      const layerOpacity = [0.6, 0.35, 0.2][node.layer]
      if (ref.children[0] && ref.children[0].material) {
        ref.children[0].material.opacity = layerOpacity * eased
      }
      if (ref.children[1] && ref.children[1].material) {
        ref.children[1].material.opacity = layerOpacity * 0.4 * eased
      }
    })

    // ── Connection lines ──
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.12 * eased
    }

    // ── Data flow particles ──
    if (flowRef.current) {
      const pos = flowRef.current.geometry.attributes.position.array
      flowData.meta.forEach((m, i) => {
        m.progress += m.speed * delta * 0.4
        if (m.progress > 1) m.progress -= 1
        const [nodeA, nodeB] = network.connections[m.connIdx]
        const a = network.nodes[nodeA]
        const b = network.nodes[nodeB]
        const p = m.progress
        pos[i * 3] = a.x + (b.x - a.x) * p + Math.sin(t * 0.3 + i) * 0.08
        pos[i * 3 + 1] = a.y + (b.y - a.y) * p + Math.cos(t * 0.25 + i) * 0.06
        pos[i * 3 + 2] = a.z + (b.z - a.z) * p
      })
      flowRef.current.geometry.attributes.position.needsUpdate = true
      flowRef.current.material.opacity = 0.6 * eased
    }

    // ── Ambient field ──
    if (fieldRef.current) {
      const pos = fieldRef.current.geometry.attributes.position.array
      for (let i = 0; i < fieldCount; i++) {
        const idx = i * 3
        pos[idx + 1] += Math.sin(t * 0.15 + i * 0.7) * 0.002
        pos[idx] += Math.cos(t * 0.12 + i * 0.5) * 0.0015
      }
      fieldRef.current.geometry.attributes.position.needsUpdate = true
      fieldRef.current.material.opacity = 0.15 * eased
    }
  })

  // Node geometries by layer type
  const geoTypes = useMemo(() => [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
  ], [])

  return (
    <group ref={groupRef} position={[0, 0.1, -2]}>
      {/* Central Nexus */}
      <lineSegments ref={nexusRef}>
        <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.8, 1)]} />
        <lineBasicMaterial color="#c9a87c" transparent opacity={0} />
      </lineSegments>
      <lineSegments ref={nexusInnerRef}>
        <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.1, 0)]} />
        <lineBasicMaterial color="#d4b896" transparent opacity={0} />
      </lineSegments>

      {/* Network Nodes */}
      {network.nodes.map((node, i) => (
        <group
          key={i}
          ref={el => { nodesRef.current[i] = el }}
          position={[node.x, node.y, node.z]}
        >
          <lineSegments scale={[node.size, node.size, node.size]}>
            <wireframeGeometry args={[geoTypes[node.geoType]]} />
            <lineBasicMaterial color="#c9a87c" transparent opacity={0.3} />
          </lineSegments>
          <mesh scale={[node.size * 0.5, node.size * 0.5, node.size * 0.5]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="#c9a87c" transparent opacity={0.1} />
          </mesh>
        </group>
      ))}

      {/* Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={network.connections.length * 2}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#c9a87c" transparent opacity={0.06} />
      </lineSegments>

      {/* Data Flow Particles */}
      <points ref={flowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={flowCount}
            array={flowData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c9a87c"
          size={0.08}
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Ambient Computation Field */}
      <points ref={fieldRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={fieldCount}
            array={fieldPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c9a87c"
          size={0.018}
          transparent
          opacity={0.1}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
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
        <NetworkGraph />
      </Canvas>
    </div>
  )
}
