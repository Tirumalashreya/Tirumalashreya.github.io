import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { pointer } from '../../lib/pointer.js';

const atmosphereShader = {
  uniforms: { glowColor: { value: new THREE.Color('#6aa8ff') } },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 glowColor;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      // Rendered on the back faces: dot() runs from about -0.5 at the planet's
      // edge to 0 at the halo's outer edge, so the glow fades outwards.
      float d = max(-dot(vNormal, vView), 0.0);
      float a = clamp(pow(d, 1.6) * 1.5, 0.0, 1.0);
      gl_FragColor = vec4(glowColor, a);
    }`,
};

// One ring per feature panel, in globeFeatures order.
const RINGS = [
  { radius: 1.16, tilt: [1.2, 0, 0.35], color: '#a78bfa' },
  { radius: 1.24, tilt: [1.35, 0, -0.4], color: '#60a5fa' },
  { radius: 1.32, tilt: [1.05, 0, -0.15], color: '#c4b5fd' },
  { radius: 1.4, tilt: [1.45, 0, 0.2], color: '#67e8f9' },
];

function Ring({ radius, tilt, color, active, animate, index }) {
  const mat = useRef();
  const sat = useRef();
  useFrame((state, dt) => {
    if (mat.current) {
      const target = active ? 1 : 0.22;
      mat.current.opacity += (target - mat.current.opacity) * Math.min(1, dt * 8);
    }
    if (sat.current) {
      const t = (animate ? state.clock.elapsedTime : 0) * (0.35 + index * 0.08) + index * 1.7;
      sat.current.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0);
      const s = active ? 1.6 : 1;
      sat.current.scale.setScalar(s);
    }
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, active ? 0.012 : 0.006, 8, 160]} />
        <meshBasicMaterial ref={mat} color={color} transparent opacity={0.32} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh ref={sat}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Particles({ count, animate }) {
  const ref = useRef();
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.08 + Math.random() * 0.22;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.55;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => {
    if (animate && ref.current) ref.current.rotation.y += dt * 0.05;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.025} color="#c7d2fe" transparent opacity={0.8} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export default function Globe({ activeIndex = -1, animate = true, particleCount = 260 }) {
  const earth = useTexture('/textures/earth-day.jpg');
  earth.colorSpace = THREE.SRGBColorSpace;
  earth.anisotropy = 4;

  const spin = useRef();
  const tilt = useRef();

  useFrame((_, dt) => {
    if (animate && spin.current) spin.current.rotation.y += dt * 0.12;
    if (tilt.current) {
      tilt.current.rotation.x += (-pointer.y * 0.12 + 0.18 - tilt.current.rotation.x) * 0.05;
      tilt.current.rotation.z += (-pointer.x * 0.08 - tilt.current.rotation.z) * 0.05;
    }
  });

  return (
    <group ref={tilt} rotation={[0.18, 0, 0]}>
      <group ref={spin} rotation={[0, -1.6, 0]}>
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={earth}
            emissiveMap={earth}
            emissive="#b9c8ff"
            emissiveIntensity={0.45}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
      </group>
      <mesh scale={1.2}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          args={[atmosphereShader]}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {RINGS.map((r, i) => (
        <Ring key={i} index={i} {...r} active={activeIndex === i} animate={animate} />
      ))}
      <Particles count={particleCount} animate={animate} />
    </group>
  );
}
