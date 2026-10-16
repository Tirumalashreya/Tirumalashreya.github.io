import { forwardRef } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  CodeXml,
  Download,
  FileText,
  Heart,
  House,
  Laptop,
  Lightbulb,
  Send,
  Users,
} from 'lucide-react';
import { ideasFlow, motto, profile, shelfBooks } from '../../data/content.js';
import { scrollToSection } from '../../lib/pointer.js';

// Design-pixel helpers for the desktop stage (1 unit = 1px of the 1536-wide reference).
export const u = (n) => `calc(var(--u) * ${n})`;
export const fs = (n, min) => `max(${min}px, calc(var(--u) * ${n}))`;
export const box = (x, y, w, h) => ({ position: 'absolute', left: u(x), top: u(y), width: u(w), ...(h ? { height: u(h) } : {}) });

export function HeroIntro({ stage = false }) {
  const s = (n, min, fallback) => (stage ? { fontSize: fs(n, min) } : { fontSize: fallback });
  return (
    <div>
      <h1 id="hero-title" className="font-extrabold tracking-tight">
        <span className="block leading-[1.05] text-white" style={s(46, 30, 'clamp(2.25rem, 7vw, 3rem)')}>
          {profile.headline.lead}
        </span>
        <span className="text-gradient block leading-[1.1] drop-shadow-[0_0_24px_rgb(139_92_246_/_0.45)]" style={s(68, 40, 'clamp(2.9rem, 10vw, 4.25rem)')}>
          {profile.headline.accent}
        </span>
        <span className="block leading-[1.15] text-white" style={s(38, 24, 'clamp(1.6rem, 5.5vw, 2.4rem)')}>
          {profile.headline.tail}
        </span>
      </h1>
      <p className="mt-[0.9em] font-semibold text-lilac" style={s(19, 14, '1.1rem')}>
        {profile.subtitle}
      </p>
      <p className="mt-[0.8em] leading-relaxed text-muted" style={stage ? { fontSize: fs(15.5, 13), maxWidth: u(360) } : { fontSize: '1.05rem', maxWidth: '34rem' }}>
        {profile.description}
      </p>
      <div className="flex flex-wrap gap-[0.9em]" style={stage ? { marginTop: u(22), fontSize: fs(15, 13) } : { marginTop: '1.75rem', fontSize: '1rem' }}>
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('projects');
          }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-violet-strong px-[1.5em] py-[0.85em] font-semibold text-ink shadow-[0_0_30px_-4px_rgb(139_92_246_/_0.9)] transition hover:brightness-110"
        >
          View My Work <ArrowRight className="h-[1.1em] w-[1.1em]" aria-hidden="true" />
        </a>
        {profile.resume ? (
          <a
            href={profile.resume}
            download
            className="glass inline-flex items-center gap-2 rounded-full px-[1.5em] py-[0.85em] font-semibold text-white transition hover:border-violet"
          >
            Download Resume <Download className="h-[1.1em] w-[1.1em]" aria-hidden="true" />
          </a>
        ) : (
          <a href="#contact" className="glass inline-flex items-center gap-2 rounded-full px-[1.5em] py-[0.85em] font-semibold text-white">
            Resume on request
          </a>
        )}
      </div>
    </div>
  );
}

export function IdeasPanel({ style }) {
  return (
    <div
      className="glass rounded-[14px] border-violet/50 font-hand text-white"
      style={{ ...style, transform: 'perspective(900px) rotateY(-10deg)', padding: u(16), fontSize: fs(21, 14), lineHeight: 1.25, whiteSpace: 'nowrap' }}
      aria-label={`Ideas, then ${ideasFlow.slice(1).join(', then ')}`}
      role="img"
    >
      <p>{ideasFlow[0]}</p>
      {ideasFlow.slice(1).map((step) => (
        <p key={step}>
          <span className="text-lilac" aria-hidden="true">→ </span>
          {step}
        </p>
      ))}
      <Heart className="mx-auto mt-[0.2em] h-[0.8em] w-[0.8em] text-lilac" aria-hidden="true" />
    </div>
  );
}

export function MottoPanel({ style }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[10px] border border-amber/30 bg-gradient-to-b from-[#3a2a2a]/50 to-[#20172e]/60 text-center font-hand text-[#ffe9c7] shadow-[0_0_40px_-10px_rgb(251_191_106_/_0.5)]"
      style={{ ...style, transform: 'perspective(800px) rotateY(-24deg)', fontSize: fs(27, 16), lineHeight: 1.2 }}
    >
      <p className="neon-text">
        {motto.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      <Heart className="neon-text mt-[0.4em] h-[0.9em] w-[0.9em]" aria-hidden="true" />
    </div>
  );
}

export function Bookshelf({ style }) {
  const offsets = [0, 10, -4, 14];
  return (
    <div style={style} className="flex flex-col justify-end" aria-label={`Books: ${shelfBooks.join(', ')}`} role="img">
      {shelfBooks.map((b, i) => (
        <div
          key={b}
          className="flex items-center justify-between rounded-[4px] border border-white/5 bg-gradient-to-b from-[#232457] to-[#15153a] text-lilac shadow-[0_6px_14px_-6px_rgb(0_0_0_/_0.8)]"
          style={{ height: u(36), marginLeft: u(offsets[i]), marginTop: u(2), paddingInline: u(14), fontSize: fs(16.5, 11) }}
        >
          <span className="font-medium">{b}</span>
          <span className="flex gap-[3px]" aria-hidden="true">
            <span className="h-[1.1em] w-[2px] bg-amber/70" />
            <span className="h-[1.1em] w-[2px] bg-amber/70" />
          </span>
        </div>
      ))}
    </div>
  );
}

const FEATURE_ICONS = { brain: BrainCircuit, users: Users, code: CodeXml, file: FileText };

export function FeaturePanel({ feature, active, onActivate, onDeactivate, style, compact = false }) {
  const Icon = FEATURE_ICONS[feature.icon] ?? BrainCircuit;
  return (
    <button
      type="button"
      onClick={() => scrollToSection(feature.target)}
      onPointerEnter={onActivate}
      onPointerLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className={`flex items-center rounded-2xl text-left transition duration-300 ${
        active ? 'glass-strong -translate-y-0.5 shadow-[0_0_36px_-2px_rgb(167_139_250_/_0.85)]' : 'glass'
      }`}
      style={style}
    >
      <Icon
        className={`shrink-0 transition-colors ${active ? 'text-white' : 'text-lilac'}`}
        style={{ width: compact ? 34 : u(34), height: compact ? 34 : u(34) }}
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <span className="flex flex-col" style={{ marginLeft: compact ? 12 : u(12) }}>
        <span className="leading-tight font-semibold whitespace-nowrap text-white" style={{ fontSize: compact ? '1rem' : fs(15.5, 11.5) }}>
          {feature.title}
        </span>
        <span className="mt-[0.2em] leading-snug text-muted" style={{ fontSize: compact ? '0.85rem' : fs(12, 10) }}>
          {feature.items.join(', ')}
        </span>
      </span>
      <span className="sr-only"> (go to {feature.target})</span>
    </button>
  );
}

export function AgenticLabel({ style, compact = false }) {
  return (
    <div
      className="glass-strong flex items-center justify-center rounded-2xl font-bold text-white"
      style={{ ...style, fontSize: compact ? '1.6rem' : fs(32, 20), textShadow: '0 0 18px rgb(196 181 253 / 0.8)' }}
    >
      Agentic AI
    </div>
  );
}

export function GlobeFallback({ hidden, size }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700"
      style={{
        width: size,
        height: size,
        opacity: hidden ? 0 : 1,
        backgroundImage: "radial-gradient(circle at 35% 30%, rgb(255 255 255 / 0.18), transparent 45%), radial-gradient(circle at 70% 75%, rgb(5 6 24 / 0.75), transparent 60%), url('/textures/earth-day.jpg')",
        backgroundSize: '100% 100%, 100% 100%, 200% 100%',
        backgroundPosition: 'center, center, 30% center',
        boxShadow: '0 0 40px 8px rgb(96 165 250 / 0.55), inset -12px -10px 30px rgb(5 6 24 / 0.7)',
      }}
    />
  );
}

export function RobotFallback({ hidden }) {
  return (
    <svg
      viewBox="0 0 100 110"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 m-auto h-[80%] w-[80%] transition-opacity duration-700"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <line x1="50" y1="6" x2="50" y2="16" stroke="#eef0ff" strokeWidth="2" />
      <circle cx="50" cy="5" r="3.5" fill="#c4b5fd" />
      <ellipse cx="50" cy="38" rx="34" ry="24" fill="#eef0ff" />
      <ellipse cx="50" cy="40" rx="25" ry="15" fill="#0b0f2a" />
      <ellipse cx="41" cy="39" rx="4" ry="5.5" fill="#7dd3fc" />
      <ellipse cx="59" cy="39" rx="4" ry="5.5" fill="#7dd3fc" />
      <rect x="14" y="32" width="6" height="12" rx="3" fill="#8b7cf6" />
      <rect x="80" y="32" width="6" height="12" rx="3" fill="#8b7cf6" />
      <rect x="30" y="64" width="40" height="34" rx="16" fill="#eef0ff" />
      <circle cx="50" cy="76" r="4" fill="#60a5fa" />
    </svg>
  );
}

const PLATFORM_ICONS = { house: House, laptop: Laptop, robot: Bot, document: FileText, books: BookOpen, plane: Send };

export const Platform = forwardRef(function Platform(
  { platform, index, onHover, ready3D, style, compact = false },
  trackRef,
) {
  const Icon = PLATFORM_ICONS[platform.object] ?? Lightbulb;
  return (
    <a
      href={`#${platform.id}`}
      onClick={(e) => {
        e.preventDefault();
        scrollToSection(platform.id);
      }}
      onPointerEnter={() => onHover(index)}
      onPointerLeave={() => onHover(-1)}
      onFocus={() => onHover(index)}
      onBlur={() => onHover(-1)}
      className="group flex flex-col items-center transition-transform duration-300 hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
      style={style}
    >
      <span ref={trackRef} className="relative block w-[86%]" style={{ height: compact ? 92 : u(118) }} aria-hidden="true">
        <Icon
          className="absolute inset-0 m-auto text-lilac transition-opacity duration-700"
          style={{ width: '42%', height: '62%', opacity: ready3D ? 0 : 0.9 }}
          strokeWidth={1.2}
        />
      </span>
      <span className="relative block w-full" style={{ marginTop: compact ? -22 : u(-30) }}>
        <span
          aria-hidden="true"
          className="relative z-[1] block aspect-[4/1] rounded-[50%] border border-violet/60 bg-[radial-gradient(ellipse_at_center,#2c2464_0%,#151238_65%,#0d0b28_100%)] shadow-[0_0_24px_-2px_rgb(139_92_246_/_0.75),inset_0_2px_10px_rgb(196_181_253_/_0.25)] transition-shadow duration-300 group-hover:shadow-[0_0_34px_2px_rgb(167_139_250_/_0.95),inset_0_2px_10px_rgb(196_181_253_/_0.35)]"
        />
        <span className="relative -mt-[12.5%] flex aspect-[4/1.3] items-end justify-center rounded-b-[50%/45%] border-x border-b border-violet/25 bg-gradient-to-b from-[#221c50] to-[#0e0c26] pb-[5%]">
          <span
            className="flex items-center gap-1.5 font-semibold text-white drop-shadow-[0_0_10px_rgb(139_92_246_/_0.9)]"
            style={{ fontSize: compact ? '0.95rem' : fs(19, 12) }}
          >
            {platform.label}
            <ArrowRight className="h-[0.9em] w-[0.9em] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </span>
      </span>
    </a>
  );
});
