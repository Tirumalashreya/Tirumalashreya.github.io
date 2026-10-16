import { m } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { projects } from '../../data/content.js';
import ArchDiagram from '../ui/ArchDiagram.jsx';
import { GitHubIcon } from '../ui/BrandIcons.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

const STATUS = {
  live: { label: 'Live', className: 'border-ok/50 bg-ok/10 text-ok' },
  'open-source': { label: 'Open source', className: 'border-cyan/50 bg-cyan/10 text-cyan' },
  internship: { label: 'Internship project', className: 'border-violet/60 bg-violet/10 text-lilac' },
  'in-progress': { label: 'In progress', className: 'border-amber/50 bg-amber/10 text-amber' },
};

const NO_LINK_NOTE = {
  internship: 'Built during an internship · code not public',
  'in-progress': 'Repository coming soon',
};

function ProjectCard({ project, index, reducedMotion }) {
  const status = STATUS[project.status] ?? STATUS['open-source'];
  const { github, demo } = project.links;
  return (
    <m.article
      aria-labelledby={`project-${project.id}`}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
      className="glass group flex flex-col rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-violet/70 sm:p-7"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
        <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 id={`project-${project.id}`} className="text-2xl font-bold tracking-tight text-white">
        {project.name}
      </h3>
      <p className="mt-1 font-medium text-lilac">{project.tagline}</p>
      <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>

      {project.architecture && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold tracking-wider text-violet uppercase">How it works</p>
          <ArchDiagram architecture={project.architecture} id={project.id} name={project.name} />
        </div>
      )}

      <ul className="mt-5 space-y-2 text-[15px] text-text/90">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" aria-hidden="true" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.name} technology`}>
        {project.tools.map((t) => (
          <li key={t} className="rounded-lg border border-violet/30 bg-violet-strong/10 px-2.5 py-1 font-mono text-xs text-lilac">
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-violet hover:text-lilac"
          >
            <GitHubIcon /> Code<span className="sr-only"> for {project.name} on GitHub</span>
          </a>
        )}
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-violet-strong px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Live demo <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only"> of {project.name}</span>
          </a>
        )}
        {!github && !demo && <span className="text-sm text-muted">{NO_LINK_NOTE[project.status] ?? 'Links coming soon'}</span>}
      </div>
    </m.article>
  );
}

export default function Projects({ reducedMotion }) {
  const visible = projects.filter((p) => !p.draft);
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        id="projects"
        eyebrow="Projects"
        title="Agents I've designed, built and shipped"
        intro="Multi-agent pipelines and retrieval systems, each with the architecture that makes it work."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {visible.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} reducedMotion={reducedMotion} />
        ))}
      </div>
    </section>
  );
}
