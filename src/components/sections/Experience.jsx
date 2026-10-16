import { m } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import { experience } from '../../data/content.js';
import SectionHeading from '../ui/SectionHeading.jsx';

export default function Experience({ reducedMotion }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative mx-auto max-w-4xl px-5 py-24 sm:px-8">
      <SectionHeading id="experience" eyebrow="Experience" title="Where I've been building" />
      <ol className="relative space-y-8 border-l border-violet/30 pl-8 sm:pl-10">
        {experience.map((job, i) => {
          const Icon = job.type === 'Education' ? GraduationCap : Briefcase;
          return (
            <m.li
              key={job.id}
              initial={reducedMotion ? false : { opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="relative"
            >
              <span
                className="absolute top-6 -left-[49px] flex h-9 w-9 items-center justify-center rounded-full border border-violet/60 bg-deep text-lilac shadow-[0_0_18px_rgb(139_92_246_/_0.6)] sm:-left-[57px]"
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </span>
              <article className="glass rounded-3xl p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  <span className="rounded-full border border-violet/50 bg-violet-strong/15 px-3 py-0.5 font-semibold text-lilac">{job.type}</span>
                  {job.period && <span className="text-muted">{job.period}</span>}
                  {job.location && <span className="text-muted">· {job.location}</span>}
                </div>
                <h3 className="mt-3 text-xl font-bold text-white">{job.role}</h3>
                <p className="font-medium text-lilac">{job.org}</p>
                <ul className="mt-4 space-y-2.5 text-muted">
                  {job.points.map((p) => (
                    <li key={p.slice(0, 30)} className="flex gap-2.5 leading-relaxed">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </m.li>
          );
        })}
      </ol>
    </section>
  );
}
