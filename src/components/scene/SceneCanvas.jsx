import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerformanceMonitor, PerspectiveCamera, View } from '@react-three/drei';
import Globe from './Globe.jsx';
import Robot from './Robot.jsx';
import PlatformObject from './PlatformObjects.jsx';

function Lights({ warm = 1 }) {
  return (
    <>
      <ambientLight intensity={0.55} color="#c7c9ff" />
      <directionalLight position={[-3, 4, 5]} intensity={1.6} color="#ffffff" />
      <pointLight position={[4, 1, 3]} intensity={18} distance={12} color="#8b5cf6" />
      <pointLight position={[-4, -1, 2]} intensity={10 * warm} distance={10} color="#fbbf6a" />
    </>
  );
}

// Views read their DOM slot every frame; in demand mode we redraw on scroll/resize.
function InvalidateOnScroll() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const on = () => invalidate();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [invalidate]);
  return null;
}

function ReadySignal({ onReady }) {
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}

export default function SceneCanvas({ tracks, activeFeature, hoveredPlatform, reducedMotion, mobile, heroRef, onReady }) {
  const [visible, setVisible] = useState(true);
  const maxDpr = mobile ? 1.5 : 1.75;
  const [dpr, setDpr] = useState(maxDpr);
  const animate = !reducedMotion;

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, [heroRef]);

  const frameloop = !visible ? 'never' : animate ? 'always' : 'demand';

  return (
    <Canvas
      aria-hidden="true"
      frameloop={frameloop}
      dpr={dpr}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 3,
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} />
      {!animate && <InvalidateOnScroll />}
      <Suspense fallback={null}>
        {tracks.globe && (
          <View track={tracks.globe}>
            <PerspectiveCamera makeDefault position={[0, 0, 4.9]} fov={38} />
            <Lights warm={0.6} />
            <Globe activeIndex={activeFeature} animate={animate} particleCount={mobile ? 110 : 260} />
          </View>
        )}
        {tracks.robots.map((r) => (
          <View key={r.id} track={r.ref}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
            <Lights />
            <group scale={r.scale ?? 1} rotation={[0, r.turn ?? 0, 0]}>
              <Robot animate={animate} wave={r.wave} phase={r.phase} />
            </group>
          </View>
        ))}
        {tracks.platforms.map((p, i) => (
          <View key={p.id} track={p.ref}>
            <PerspectiveCamera makeDefault position={[0, 0.6, 4.2]} fov={32} onUpdate={(c) => c.lookAt(0, 0, 0)} />
            <Lights warm={1.2} />
            <PlatformObject object={p.object} hovered={hoveredPlatform === i} animate={animate} phase={i * 0.9} />
          </View>
        ))}
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
