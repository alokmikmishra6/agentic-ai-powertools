import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

/* ═══════════════════════════════════════════════════════════════════════════
   AURORA NOISE FIELD — Fullscreen shader art
   
   No geometric primitives. No rotating spheres.
   Pure mathematical visual art via fragment shader:
   - Multi-layered simplex noise creating organic aurora ribbons
   - Mouse-reactive distortion field
   - Scroll-reactive color morphing
   - Subtle grain + film texture
   
   Inspired by: Linear.app, Vercel, Stripe, Lusion.co
   ═══════════════════════════════════════════════════════════════════════════ */

const auroraVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const auroraFragmentShader = `
  precision highp float;
  
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform vec2 uResolution;
  uniform float uLoad;
  
  // ── Simplex 3D noise ──
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x2_ = x_ * ns.x + ns.yyyy;
    vec4 y2_ = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x2_) - abs(y2_);
    vec4 b0 = vec4(x2_.xy, y2_.xy);
    vec4 b1 = vec4(x2_.zw, y2_.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  // ── Fractional Brownian Motion ──
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // ── Domain warping (creates organic flowing shapes) ──
  float warpedNoise(vec3 p) {
    vec3 q = vec3(
      fbm(p + vec3(0.0, 0.0, 0.0)),
      fbm(p + vec3(5.2, 1.3, 2.8)),
      fbm(p + vec3(1.7, 9.2, 3.4))
    );
    vec3 r = vec3(
      fbm(p + 4.0 * q + vec3(1.7, 9.2, 0.0) + 0.15 * uTime),
      fbm(p + 4.0 * q + vec3(8.3, 2.8, 0.0) + 0.12 * uTime),
      fbm(p + 4.0 * q + vec3(3.1, 4.7, 0.0) + 0.1 * uTime)
    );
    return fbm(p + 4.0 * r);
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 st = (uv - 0.5) * aspect;
    
    // Mouse influence — distorts UV space (subtle warp)
    vec2 mouseInfluence = uMouse * 0.15;
    float mouseDist = length(st - mouseInfluence);
    float mouseWarp = smoothstep(0.8, 0.0, mouseDist) * 0.08;
    st += normalize(st - mouseInfluence) * mouseWarp;
    
    // Scroll morphs the noise space
    float scrollOffset = uScroll * 2.0;
    
    // ── Layer 1: Deep aurora ribbons ──
    float n1 = warpedNoise(vec3(st * 1.2, uTime * 0.05 + scrollOffset * 0.3));
    
    // ── Layer 2: Mid-frequency detail ──
    float n2 = snoise(vec3(st * 2.5 + n1 * 0.5, uTime * 0.08 + scrollOffset * 0.5));
    
    // ── Layer 3: Fine grain movement ──
    float n3 = snoise(vec3(st * 5.0 + vec2(n1, n2) * 0.3, uTime * 0.12 + scrollOffset));
    
    // ── Combine into aurora shape ──
    float aurora = smoothstep(-0.4, 0.8, n1) * 0.6;
    aurora += smoothstep(-0.2, 0.6, n2) * 0.25;
    aurora += smoothstep(0.0, 0.5, n3) * 0.1;
    
    // Concentrate aurora in bands (like real aurora borealis)
    float band = sin(st.y * 3.0 + n1 * 2.0 + uTime * 0.03) * 0.5 + 0.5;
    aurora *= mix(0.4, 1.0, band);
    
    // Mouse proximity boost
    float mouseGlow = smoothstep(0.6, 0.0, mouseDist) * 0.3;
    aurora += mouseGlow;
    
    // ── Color palette (gold/warm tones — matches brand) ──
    vec3 color1 = vec3(0.788, 0.659, 0.486); // #c9a87c gold
    vec3 color2 = vec3(0.42, 0.30, 0.18);    // deep amber
    vec3 color3 = vec3(0.15, 0.10, 0.06);    // near-black warm
    vec3 color4 = vec3(0.55, 0.40, 0.25);    // mid warm
    
    // Scroll shifts palette subtly
    float scrollHue = uScroll * 0.3;
    vec3 colorA = mix(color2, color1, smoothstep(-0.3, 0.5, n1 + scrollHue));
    vec3 colorB = mix(color3, color4, smoothstep(-0.2, 0.4, n2));
    vec3 finalColor = mix(colorB, colorA, aurora);
    
    // Intensity control
    finalColor *= aurora * 0.7 + 0.02; // Very dark base, bright only where aurora exists
    
    // ── Edge fade (natural vignette in shader) ──
    float edgeFade = 1.0 - smoothstep(0.3, 0.9, length(st * 0.8));
    finalColor *= edgeFade;
    
    // ── Film grain ──
    float grain = fract(sin(dot(uv * uTime * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += (grain - 0.5) * 0.015;
    
    // ── Load-in fade ──
    finalColor *= uLoad;
    
    // Keep overall brightness very low — this is a background
    finalColor *= 0.35;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

// ═══ AURORA MESH — Fullscreen quad with custom shader ═══
function AuroraMesh() {
  const meshRef = useRef()
  const scrollRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const loadRef = useRef(0)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uLoad: { value: 0 },
  }), [])

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const onResize = () => {
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
    }
  }, [uniforms])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material

    // Smooth load-in
    loadRef.current = Math.min(1, loadRef.current + delta * 0.4)
    mat.uniforms.uLoad.value = loadRef.current

    // Time
    mat.uniforms.uTime.value += delta

    // Smooth mouse
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * delta * 3
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * delta * 3
    mat.uniforms.uMouse.value.set(smoothMouse.current.x, smoothMouse.current.y)

    // Scroll
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? scrollRef.current / maxScroll : 0
    mat.uniforms.uScroll.value += (progress - mat.uniforms.uScroll.value) * delta * 2
  })

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

// ═══ EXPORT ═══
export default function ImmersiveBackground() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <AuroraMesh />
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={0.8}
            mipmapBlur
          />
          <Vignette darkness={0.5} offset={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
