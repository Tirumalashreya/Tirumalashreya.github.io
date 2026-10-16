import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { pointer } from '../../lib/pointer.js';

const shell = { color: '#eef0ff', roughness: 0.28, metalness: 0.12 };
const trim = { color: '#8b7cf6', roughness: 0.35, metalness: 0.4, emissive: '#5b3fd6', emissiveIntensity: 0.35 };

// Procedural companion robot. Units: about 2.6 tall, origin at the body's centre.
export default function Robot({ animate = true, wave = false, phase = 0, lift = 0 }) {
  const root = useRef();
  const head = useRef();
  const arm = useRef();
  const eyes = useRef([]);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime + phase;
    if (root.current) {
      root.current.position.y += (Math.sin(t * 1.4) * 0.09 + lift - root.current.position.y) * 0.12;
      root.current.rotation.z = Math.sin(t * 0.9) * 0.04;
    }
    if (head.current) {
      head.current.rotation.y += (pointer.x * 0.5 - head.current.rotation.y) * 0.06;
      head.current.rotation.x += (-pointer.y * 0.25 - head.current.rotation.x) * 0.06;
    }
    if (arm.current && wave) arm.current.rotation.z = 2.3 + Math.sin(t * 4) * 0.35;
    // Blink every few seconds.
    const blink = (t % 4.2) < 0.12 ? 0.15 : 1;
    eyes.current.forEach((e) => e && (e.scale.y = 1.35 * blink));
  });

  return (
    <group ref={root}>
      <group ref={head} position={[0, 0.72, 0]}>
        <mesh scale={[1.12, 0.92, 1]}>
          <sphereGeometry args={[0.62, 40, 32]} />
          <meshStandardMaterial {...shell} />
        </mesh>
        <mesh position={[0, -0.02, 0.24]} scale={[0.98, 0.68, 0.62]}>
          <sphereGeometry args={[0.55, 40, 32]} />
          <meshStandardMaterial color="#090c24" roughness={0.15} metalness={0.6} />
        </mesh>
        {[-0.19, 0.19].map((x, i) => (
          <mesh key={x} ref={(el) => (eyes.current[i] = el)} position={[x, 0.02, 0.58]} scale={[1, 1.35, 0.4]}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshBasicMaterial color="#7dd3fc" toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, -0.16, 0.6]} rotation={[0, 0, Math.PI]} scale={[1, 0.6, 1]}>
          <torusGeometry args={[0.09, 0.018, 8, 24, Math.PI]} />
          <meshBasicMaterial color="#7dd3fc" toneMapped={false} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.17, 0.17, 0.14, 24]} />
            <meshStandardMaterial {...trim} />
          </mesh>
        ))}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.22, 8]} />
          <meshStandardMaterial {...shell} />
        </mesh>
        <mesh position={[0, 0.76, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#c4b5fd" toneMapped={false} />
        </mesh>
      </group>

      <mesh position={[0, -0.42, 0]}>
        <capsuleGeometry args={[0.42, 0.3, 8, 24]} />
        <meshStandardMaterial {...shell} />
      </mesh>
      <mesh position={[0, -0.3, 0.41]}>
        <circleGeometry args={[0.1, 24]} />
        <meshBasicMaterial color="#60a5fa" toneMapped={false} />
      </mesh>

      <mesh position={[-0.55, -0.42, 0]} rotation={[0, 0, -0.35]}>
        <capsuleGeometry args={[0.11, 0.38, 6, 12]} />
        <meshStandardMaterial {...shell} />
      </mesh>
      <group ref={arm} position={[0.5, -0.2, 0]} rotation={[0, 0, wave ? 2.3 : 0.35]}>
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.11, 0.38, 6, 12]} />
          <meshStandardMaterial {...shell} />
        </mesh>
      </group>
    </group>
  );
}
