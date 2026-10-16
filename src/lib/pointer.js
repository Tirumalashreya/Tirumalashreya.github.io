// Shared, allocation-free pointer position for the 3D scene: x/y in [-1, 1], y up.
export const pointer = { x: 0, y: 0 };

let attached = false;
export function trackPointer() {
  if (attached) return;
  attached = true;
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  if (id !== 'top') {
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
  history.replaceState(null, '', id === 'top' ? '#' : `#${id}`);
}
