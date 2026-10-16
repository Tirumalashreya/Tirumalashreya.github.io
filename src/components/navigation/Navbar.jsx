import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Download, Menu, X } from 'lucide-react';
import { navLinks, profile } from '../../data/content.js';
import { useActiveSection } from '../../hooks/useActiveSection.js';
import { scrollToSection } from '../../lib/pointer.js';
import { GitHubIcon } from '../ui/BrandIcons.jsx';

const ids = navLinks.map((l) => l.id);

function go(e, id, after) {
  e.preventDefault();
  after?.();
  scrollToSection(id);
}

export default function Navbar() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef(null);
  const firstLink = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-line/60 bg-ink/75 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-violet focus:px-3 focus:py-1.5 focus:text-ink"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <a
          href="#top"
          onClick={(e) => go(e, 'top')}
          className="font-script text-[2.6rem] leading-none text-lilac drop-shadow-[0_0_14px_rgb(167_139_250_/_0.85)]"
          aria-label={`${profile.name} — home`}
        >
          Shreya
        </a>

        <ul className="glass hidden items-center gap-1 rounded-full p-1.5 lg:flex">
          {navLinks.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`block rounded-full px-4 py-2 text-[15px] font-medium transition ${
                    isActive
                      ? 'bg-violet-strong/35 text-white shadow-[inset_0_0_0_1px_rgb(196_181_253_/_0.45)]'
                      : 'text-muted hover:text-white'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="glass hidden h-11 w-11 items-center justify-center rounded-full text-lilac transition hover:text-white sm:flex"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href="#contact"
            onClick={(e) => go(e, 'contact')}
            className="hidden items-center gap-2 rounded-full border border-violet/70 bg-violet-strong/15 px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_0_24px_-6px_rgb(139_92_246_/_0.9)] transition hover:bg-violet-strong/30 sm:flex"
          >
            Let&apos;s Connect <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line/60 px-4 pb-6 lg:hidden">
          <ul className="mx-auto grid max-w-md gap-1 pt-3">
            {navLinks.map((l, i) => (
              <li key={l.id}>
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={`#${l.id}`}
                  onClick={(e) => go(e, l.id, () => setOpen(false))}
                  aria-current={active === l.id ? 'location' : undefined}
                  className={`block rounded-xl px-4 py-3 text-lg font-medium ${
                    active === l.id ? 'bg-violet-strong/25 text-white' : 'text-muted hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-4 grid max-w-md grid-cols-2 gap-2">
            {profile.resume && (
              <a href={profile.resume} download className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium">
                <Download className="h-4 w-4" aria-hidden="true" /> Resume
              </a>
            )}
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium"
            >
              <GitHubIcon /> GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
