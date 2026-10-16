import { m } from 'framer-motion';
import { GraduationCap, MapPin, Sparkles, Target } from 'lucide-react';
import { about, ideasFlow } from '../../data/content.js';
import SectionHeading from '../ui/SectionHeading.jsx';

const FACT_ICONS = [MapPin, GraduationCap, Target, Sparkles];

export default function About({ reducedMotion }) {
  return (
    <section id="about" aria-labelledby="about-title" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading id="about" eyebrow="About me" title="Practical AI, built one agent at a time" />
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 font-hand text-2xl text-lilac">
            {ideasFlow.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">→</span>}
                {step}
              </span>
            ))}
          </p>
        </div>
        <m.ul
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5 }}
          className="glass grid content-start gap-5 rounded-3xl p-6 sm:p-8"
        >
          {about.facts.map((f, i) => {
            const Icon = FACT_ICONS[i % FACT_ICONS.length];
            return (
              <li key={f.label} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-strong/20 text-lilac">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold tracking-wide text-violet uppercase">{f.label}</span>
                  <span className="text-text">{f.value}</span>
                </span>
              </li>
            );
          })}
        </m.ul>
      </div>
    </section>
  );
}
