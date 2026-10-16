import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Robot from './Robot.jsx';

const white = { color: '#eef0ff', roughness: 0.4, metalness: 0.05 };
const glow = (color) => ({ color, toneMapped: false });

function House() {
  return (
    <group position={[0, -0.25, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.2, 0.7, 0.9]} />
        <meshStandardMaterial color="#efe7dc" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.95, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.05, 0.62, 0.8]}>
        <coneGeometry args={[1.0, 0.8, 4]} />
        <meshStandardMaterial color="#5b2c3f" roughness={0.6} />
      </mesh>
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.42, 0.455]}>
          <planeGeometry args={[0.22, 0.2]} />
          <meshBasicMaterial {...glow('#ffc46b')} />
        </mesh>
      ))}
      <mesh position={[0, 0.2, 0.455]}>
        <planeGeometry args={[0.2, 0.36]} />
        <meshBasicMaterial {...glow('#ffb347')} />
      </mesh>
      {[-0.75, 0.78].map((x, i) => (
        <mesh key={x} position={[x, 0.18 + i * 0.05, 0.15]}>
          <sphereGeometry args={[0.24 + i * 0.04, 16, 16]} />
          <meshStandardMaterial color="#2f6b3a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Laptop() {
  const bars = [0.25, 0.45, 0.32, 0.6, 0.5, 0.75];
  return (
    <group position={[0, -0.35, 0]} rotation={[0.1, -0.35, 0]}>
      <mesh position={[0, 0.03, 0.3]}>
        <boxGeometry args={[1.5, 0.06, 1.0]} />
        <meshStandardMaterial color="#9aa0b8" roughness={0.35} metalness={0.6} />
      </mesh>
      <group position={[0, 0.06, -0.18]} rotation={[-0.25, 0, 0]}>
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[1.5, 0.96, 0.05]} />
          <meshStandardMaterial color="#2a2d45" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.48, 0.03]}>
          <planeGeometry args={[1.36, 0.82]} />
          <meshBasicMaterial {...glow('#2a1f6b')} />
        </mesh>
        {bars.map((h, i) => (
          <mesh key={i} position={[-0.5 + i * 0.2, 0.15 + h / 2, 0.04]}>
            <planeGeometry args={[0.11, h]} />
            <meshBasicMaterial {...glow(i % 2 ? '#a78bfa' : '#67e8f9')} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Document() {
  return (
    <group rotation={[-0.15, -0.3, 0.05]}>
      <mesh>
        <boxGeometry args={[1.0, 1.3, 0.04]} />
        <meshStandardMaterial {...white} />
      </mesh>
      <mesh position={[-0.25, 0.38, 0.03]}>
        <circleGeometry args={[0.13, 24]} />
        <meshStandardMaterial color="#c08457" />
      </mesh>
      {[0.42, 0.3, 0.05, -0.1, -0.25, -0.4].map((y, i) => (
        <mesh key={y} position={[i < 2 ? 0.15 : 0, y, 0.025]}>
          <boxGeometry args={[i < 2 ? 0.42 : 0.72, 0.05, 0.01]} />
          <meshStandardMaterial color={i < 2 ? '#3b3b5c' : '#9a9ab8'} />
        </mesh>
      ))}
    </group>
  );
}

function Books({ animate }) {
  const bulb = useRef();
  useFrame((state) => {
    if (bulb.current) bulb.current.intensity = 2.2 + (animate ? Math.sin(state.clock.elapsedTime * 2) * 0.4 : 0);
  });
  const stack = [
    { c: '#2b2f6b', w: 1.3, r: 0.05 },
    { c: '#4c2a7a', w: 1.2, r: -0.08 },
    { c: '#1f4b6e', w: 1.1, r: 0.1 },
  ];
  return (
    <group position={[0, -0.55, 0]}>
      {stack.map((b, i) => (
        <mesh key={i} position={[0, 0.1 + i * 0.2, 0]} rotation={[0, b.r, 0]}>
          <boxGeometry args={[b.w, 0.18, 0.8]} />
          <meshStandardMaterial color={b.c} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.16, 16]} />
        <meshStandardMaterial color="#9aa0b8" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshBasicMaterial {...glow('#ffd27a')} />
      </mesh>
      <pointLight ref={bulb} position={[0, 1.1, 0.4]} color="#ffc46b" intensity={2.2} distance={4} />
    </group>
  );
}

function Plane() {
  const geometry = useMemo(() => {
    // Paper airplane: nose, two wings and a keel.
    const v = [
      0, 0, 1.0, -0.7, 0.05, -0.6, 0, 0, -0.45,
      0, 0, 1.0, 0, 0, -0.45, 0.7, 0.05, -0.6,
      0, 0, 1.0, 0, -0.28, -0.5, 0, 0, -0.45,
    ];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={geometry} rotation={[0.35, -0.9, 0.25]} position={[0.1, 0.2, 0]} scale={1.1}>
        <meshStandardMaterial color="#f5f7ff" side={THREE.DoubleSide} roughness={0.5} />
      </mesh>
      {[
        [-0.6, -0.45, 0, 0.32],
        [-0.2, -0.5, 0.1, 0.38],
        [0.25, -0.48, 0, 0.3],
        [0.62, -0.42, -0.1, 0.24],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 20, 20]} />
          <meshStandardMaterial color="#e6e9ff" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export const OBJECTS = { house: House, laptop: Laptop, document: Document, books: Books, plane: Plane };

export default function PlatformObject({ object, hovered, animate, phase = 0 }) {
  const ref = useRef();
  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + phase;
    const lift = hovered ? 0.25 : 0;
    const bob = animate ? Math.sin(t * 1.3) * 0.05 : 0;
    ref.current.position.y += (lift + bob - ref.current.position.y) * Math.min(1, dt * 6);
    const spinTarget = animate ? Math.sin(t * 0.5) * 0.25 + (hovered ? 0.5 : 0) : 0;
    ref.current.rotation.y += (spinTarget - ref.current.rotation.y) * Math.min(1, dt * 3);
  });

  if (object === 'robot') {
    return (
      <group scale={0.62} position={[0, 0.05, 0]}>
        <Robot animate={animate} lift={hovered ? 0.4 : 0} phase={phase} wave={hovered} />
      </group>
    );
  }
  const Obj = OBJECTS[object];
  return <group ref={ref}>{Obj ? <Obj animate={animate} /> : null}</group>;
}
