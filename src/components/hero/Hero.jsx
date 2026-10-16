import { Suspense, createRef, lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { globeFeatures, platforms } from '../../data/content.js';
import { hasWebGL, useMediaQuery } from '../../hooks/useCapabilities.js';
import { trackPointer } from '../../lib/pointer.js';
import Backdrop, { SceneDefs } from './Backdrop.jsx';
import City, { Stars } from './City.jsx';
import {
  AgenticLabel,
  Bookshelf,
  FeaturePanel,
  GlobeFallback,
  HeroIntro,
  IdeasPanel,
  MottoPanel,
  Platform,
  RobotFallback,
  box,
  u,
} from './HeroParts.jsx';

const SceneCanvas = lazy(() => import('../scene/SceneCanvas.jsx'));

const CHARACTER_ALT = 'Illustration of Shreya in a purple hoodie, chin resting on her hand, thinking behind her laptop';

function Character({ className, style, eager = true }) {
  return (
    <picture className={className} style={style}>
      <source
        srcSet="/images/portfolio-character-700.webp 700w, /images/portfolio-character.webp 1265w"
        sizes="(min-width: 1200px) 32vw, min(82vw, 470px)"
        type="image/webp"
      />
      <img
        src="/images/portfolio-character.png"
        alt={CHARACTER_ALT}
        width="1265"
        height="1164"
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        className="block h-auto w-full select-none"
        draggable="false"
      />
    </picture>
  );
}

// three.js is ~250 KB gzipped, so the 2D fallbacks render first and the 3D
// chunk loads on the first interaction or once the page has settled.
const INTERACTIONS = ['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart'];

function useDeferredUpgrade(enabled, idleDelayMs) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let timer;
    const go = () => setReady(true);
    INTERACTIONS.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const arm = () => {
      timer = setTimeout(() => (window.requestIdleCallback ?? ((cb) => cb()))(go), idleDelayMs);
    };
    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', arm);
      INTERACTIONS.forEach((e) => window.removeEventListener(e, go));
    };
  }, [enabled, idleDelayMs]);
  return ready;
}

function useStageUnit(ref) {
  const [unit, setUnit] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setUnit(el.clientWidth / 1536);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return unit;
}

function useParallax(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    let last = null;
    const apply = () => {
      raf = 0;
      if (!last) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--px', (((last.x - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty('--py', (((last.y - r.top) / r.height) * 2 - 1).toFixed(3));
      el.style.setProperty('--mx', `${(last.x - r.left).toFixed(0)}px`);
      el.style.setProperty('--my', `${(last.y - r.top).toFixed(0)}px`);
    };
    const onMove = (e) => {
      last = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
    };
  }, [ref, enabled]);
}

const shift = (x, y) => ({
  transform: `translate3d(calc(var(--px, 0) * ${x}px), calc(var(--py, 0) * ${y}px), 0)`,
  transition: 'transform 0.35s ease-out',
});

const PLATFORM_X = [96, 322, 552, 800, 1032, 1254];
// Globe centre and the four panels arranged symmetrically around it, clear of the sphere.
const GLOBE = { x: 768, y: 676 };
const FEATURE_BOXES = [
  box(400, 596, 246, 76),
  box(890, 596, 246, 76),
  box(400, 690, 246, 76),
  box(890, 690, 246, 76),
];

function FeatureLinks({ active }) {
  // Short connectors from each panel's inner edge to the globe's rim.
  const links = [
    [646, 634, 680, 648],
    [890, 634, 856, 648],
    [646, 728, 680, 712],
    [890, 728, 856, 712],
  ];
  return (
    <svg viewBox="0 0 1536 1024" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <line x1={GLOBE.x} y1="562" x2={GLOBE.x} y2="572" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.6" />
      {links.map(([x1, y1, x2, y2], i) => {
        const on = active === i;
        return (
          <g key={i} opacity={on ? 1 : 0.5}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? '#e0e7ff' : '#a78bfa'} strokeWidth={on ? 2 : 1.2} strokeLinecap="round" />
            <circle cx={x2} cy={y2} r={on ? 3.5 : 2.5} fill={on ? '#e0e7ff' : '#c4b5fd'} />
          </g>
        );
      })}
    </svg>
  );
}

function DesktopStage({ refs, state }) {
  const { activeFeature, setActiveFeature, setHoveredPlatform, ready3D, parallax } = state;
  const stageRef = useRef(null);
  const unit = useStageUnit(stageRef);
  useParallax(stageRef, parallax);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto w-full max-w-[1920px]"
      style={{ '--u': unit ? `${unit}px` : 'calc(100vw / 1536)', height: u(1024) }}
    >
      <div className="absolute inset-0 z-0" style={parallax ? shift(-6, -4) : undefined}>
        <Backdrop />
      </div>
      {parallax && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ background: 'radial-gradient(420px circle at var(--mx, -999px) var(--my, -999px), rgb(139 92 246 / 0.10), transparent 70%)' }}
        />
      )}

      <div className="absolute inset-0 z-[1]" style={parallax ? shift(-10, -6) : undefined}>
        <IdeasPanel style={box(1030, 205, 175)} />
        <MottoPanel style={box(1372, 118, 140, 272)} />
        <Bookshelf style={box(1195, 438, 285, 160)} />
        <FeatureLinks active={activeFeature} />
      </div>

      <div className="absolute z-[2]" style={{ ...box(491, 90, 490), ...(parallax ? shift(-3, -2) : {}) }}>
        <div aria-hidden="true" className="absolute -inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(124_92_255_/_0.35),transparent)]" />
        <Character className="float-slow relative block" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div ref={refs.globe} style={box(GLOBE.x - 170, GLOBE.y - 135, 340, 270)}>
          <GlobeFallback hidden={ready3D} size={u(184)} />
        </div>
        <div ref={refs.robotA} style={box(420, 448, 165, 155)}>
          <RobotFallback hidden={ready3D} />
        </div>
        <div style={{ ...box(1180, 165, 160, 170), ...(parallax ? shift(-12, -8) : {}) }}>
          <div ref={refs.robotB} className="absolute inset-0">
            <RobotFallback hidden={ready3D} />
          </div>
        </div>
      </div>

      <nav aria-label="Portfolio sections" className="absolute z-[2]" style={box(0, 780, 1536, 230)}>
        <ul className="relative h-full">
          {platforms.map((p, i) => (
            <li key={p.id} className="absolute top-0" style={{ left: u(PLATFORM_X[i]), width: u(196) }}>
              <Platform ref={refs.platforms[i]} platform={p} index={i} onHover={setHoveredPlatform} ready3D={ready3D} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="pointer-events-none absolute inset-0 z-[4]">
        <div className="pointer-events-auto" style={box(105, 112, 480)}>
          <HeroIntro stage />
        </div>
        <AgenticLabel style={box(668, 500, 200, 62)} />
      </div>

      {globeFeatures.map((f, i) => (
        <div key={f.id} className="absolute z-[4]" style={FEATURE_BOXES[i]}>
          <FeaturePanel
            feature={f}
            active={activeFeature === i}
            onActivate={() => setActiveFeature(i)}
            onDeactivate={() => setActiveFeature(-1)}
            style={{ width: '100%', height: '100%', padding: u(14) }}
          />
        </div>
      ))}
    </div>
  );
}

function CompactHero({ refs, state }) {
  const { activeFeature, setActiveFeature, setHoveredPlatform, ready3D } = state;
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,#0c0a25_0%,#141038_45%,#0a0920_100%)]" />
      <div aria-hidden="true" className="absolute top-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(124_92_255_/_0.25),transparent)]" />
      <div className="relative z-[4] mx-auto max-w-3xl px-5 pt-28 sm:px-8">
        <HeroIntro />
      </div>

      <div className="relative mx-auto mt-10 max-w-xl px-5 sm:px-8">
        <div className="relative">
          <svg
            viewBox="300 48 880 512"
            className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_70%_75%_at_50%_45%,#000_45%,transparent_100%)]"
            preserveAspectRatio="xMidYMax slice"
            aria-hidden="true"
          >
            <SceneDefs />
            <rect x="300" y="48" width="880" height="512" fill="url(#sky)" />
            <Stars x0={300} x1={1180} y0={60} y1={300} count={50} />
            <City x0={300} x1={1180} base={562} seed={11} />
          </svg>
          <div className="relative z-[2] mx-auto w-[82%] pt-10">
            <Character className="float-slow block" />
          </div>
          <div aria-hidden="true" className="relative z-[2] h-6 rounded-[50%] bg-[radial-gradient(closest-side,#2a2060,transparent)]" />
        </div>
        <div ref={refs.robotA} className="pointer-events-none absolute -top-6 right-0 z-[2] h-28 w-24 sm:right-2 sm:h-32 sm:w-28">
          <RobotFallback hidden={ready3D} />
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-3xl px-5 sm:px-8">
        <div className="relative z-[4] flex justify-center">
          <AgenticLabel compact style={{ padding: '0.6rem 1.6rem' }} />
        </div>
        <div className="relative mx-auto -mt-2 h-[260px] max-w-[420px]">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-6 mx-auto h-16 w-[92%] rounded-[50%] border border-violet/60 shadow-[0_0_24px_rgb(139_92_246_/_0.6)]" />
          <div ref={refs.globe} className="pointer-events-none absolute inset-0 z-[2]">
            <GlobeFallback hidden={ready3D} size="150px" />
          </div>
        </div>
        <div className="relative z-[4] grid gap-3 sm:grid-cols-2">
          {globeFeatures.map((f, i) => (
            <FeaturePanel
              key={f.id}
              compact
              feature={f}
              active={activeFeature === i}
              onActivate={() => setActiveFeature(i)}
              onDeactivate={() => setActiveFeature(-1)}
              style={{ padding: '1rem', width: '100%' }}
            />
          ))}
        </div>
      </div>

      <nav aria-label="Portfolio sections" className="relative z-[2] mx-auto max-w-3xl px-5 pt-14 pb-16 sm:px-8">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          {platforms.map((p, i) => (
            <li key={p.id}>
              <Platform compact ref={refs.platforms[i]} platform={p} index={i} onHover={setHoveredPlatform} ready3D={ready3D} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default function Hero({ caps }) {
  const desktop = useMediaQuery('(min-width: 1200px)');
  const heroRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(-1);
  const [hoveredPlatform, setHoveredPlatform] = useState(-1);
  const [ready3D, setReady3D] = useState(false);

  const refs = useMemo(
    () => ({ globe: createRef(), robotA: createRef(), robotB: createRef(), platforms: platforms.map(() => createRef()) }),
    [],
  );

  // Phones parse three.js slowly, so they wait longer before loading it unprompted.
  const upgrade = useDeferredUpgrade(!caps.lowPower, desktop ? 3000 : 6000);
  const webgl = useMemo(() => (upgrade ? hasWebGL() : null), [upgrade]);
  const show3D = Boolean(upgrade && webgl);

  useEffect(() => {
    if (show3D) trackPointer();
  }, [show3D]);

  const onReady = useCallback(() => setReady3D(true), []);

  const tracks = useMemo(
    () => ({
      globe: refs.globe,
      robots: desktop
        ? [
            { id: 'desk', ref: refs.robotA, scale: 0.95, turn: 0.35, phase: 0 },
            { id: 'float', ref: refs.robotB, scale: 0.9, turn: -0.4, wave: true, phase: 1.3 },
          ]
        : [{ id: 'float', ref: refs.robotA, scale: 0.95, turn: -0.3, wave: true, phase: 1.3 }],
      platforms: platforms.map((p, i) => ({ id: p.id, object: p.object, ref: refs.platforms[i] })),
    }),
    [refs, desktop],
  );

  const state = {
    activeFeature,
    setActiveFeature,
    setHoveredPlatform,
    ready3D,
    parallax: desktop && caps.finePointer && !caps.reducedMotion,
  };

  return (
    <section id="top" ref={heroRef} aria-labelledby="hero-title" className="relative overflow-hidden bg-ink">
      {desktop ? <DesktopStage refs={refs} state={state} /> : <CompactHero refs={refs} state={state} />}
      {show3D && (
        <Suspense fallback={null}>
          <SceneCanvas
            key={desktop ? 'desktop' : 'compact'}
            tracks={tracks}
            activeFeature={activeFeature}
            hoveredPlatform={hoveredPlatform}
            reducedMotion={caps.reducedMotion}
            mobile={!desktop}
            heroRef={heroRef}
            onReady={onReady}
          />
        </Suspense>
      )}
      {(caps.lowPower || webgl === false) && (
        <p className="relative z-[4] pb-4 text-center text-xs text-muted">
          Showing the 2D scene — {caps.lowPower ? 'low-power device detected' : 'WebGL is unavailable in this browser'}.
        </p>
      )}
    </section>
  );
}
