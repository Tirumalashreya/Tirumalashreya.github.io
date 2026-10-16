import { m } from 'framer-motion';
import { BrainCircuit, Database, LayoutTemplate, Server, Wrench } from 'lucide-react';
import { skillGroups } from '../../data/content.js';
import SectionHeading from '../ui/SectionHeading.jsx';

const ICONS = { brain: BrainCircuit, server: Server, layout: LayoutTemplate, database: Database, wrench: Wrench };

export default function Skills({ reducedMotion }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        id="skills"
        eyebrow="Skills"
        title="The toolkit behind the agents"
        intro="Every skill here is backed by a project, internship or repository."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => {
          const Icon = ICONS[g.icon] ?? Wrench;
          return (
            <m.section
              key={g.id}
              aria-labelledby={`skills-${g.id}`}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className={`glass rounded-3xl p-6 ${i === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''}`}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-strong/20 text-lilac">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 id={`skills-${g.id}`} className="text-lg font-semibold text-white">
                  {g.title}
                </h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className={`rounded-xl border border-violet/25 bg-ink/40 text-text transition hover:border-violet/70 hover:text-white ${
                      i === 0 ? 'px-3.5 py-2 text-[15px]' : 'px-3 py-1.5 text-sm'
                    }`}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </m.section>
          );
        })}
      </div>
    </section>
  );
}
