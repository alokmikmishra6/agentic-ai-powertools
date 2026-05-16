import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WireframeGrid() {
  const group = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    group.current.rotation.x = -0.5
    group.current.rotation.z = t * 0.025
  })

  const lines = useMemo(() => {
    const pts = []
    const size = 12
    const divisions = 20
    const step = size / divisions

    for (let i = 0; i <= divisions; i++) {
      const pos = -size / 2 + i * step
      pts.push(new THREE.Vector3(pos, 0, -size / 2))
      pts.push(new THREE.Vector3(pos, 0, size / 2))
      pts.push(new THREE.Vector3(-size / 2, 0, pos))
      pts.push(new THREE.Vector3(size / 2, 0, pos))
    }
    return pts
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(lines.length * 3)
    lines.forEach((v, i) => {
      positions[i * 3] = v.x
      positions[i * 3 + 1] = v.y
      positions[i * 3 + 2] = v.z
    })
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [lines])

  return (
    <group ref={group} position={[0, 0, -2]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#7b6cf0" transparent opacity={0.15} />
      </lineSegments>
      {/* Floating nodes at intersections */}
      {[...Array(8)].map((_, i) => {
        const x = (Math.random() - 0.5) * 8
        const z = (Math.random() - 0.5) * 8
        return (
          <mesh key={i} position={[x, 0.1, z]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#22d3c8" transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function PhilosophyScene() {
  return (
    <Canvas
      camera={{ position: [0, 4, 8], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* transparent bg via gl alpha */}
      <WireframeGrid />
    </Canvas>
  )
}
