import { ArrowUpRight, PenLine } from 'lucide-react';
import { posts } from '../../data/content.js';
import SectionHeading from '../ui/SectionHeading.jsx';

export default function Blog() {
  const hasPlaceholders = posts.some((p) => p.placeholder);
  return (
    <section id="blog" aria-labelledby="blog-title" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        id="blog"
        eyebrow="Blog & learning"
        title="Notes from building agents"
        intro="Project write-ups, experiments and the lessons behind them."
      />
      {hasPlaceholders && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-sm text-amber">
          <PenLine className="h-4 w-4" aria-hidden="true" /> Drafts in progress: these posts are not published yet.
        </p>
      )}
      <ul className="grid gap-5 md:grid-cols-3">
        {posts.map((post) => {
          const body = (
            <>
              <div className="mb-4 flex items-center justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    post.placeholder ? 'border border-dashed border-amber/60 text-amber' : 'bg-violet-strong/20 text-lilac'
                  }`}
                >
                  {post.placeholder ? 'Coming soon' : 'Article'}
                </span>
                {!post.placeholder && post.url && <ArrowUpRight className="h-4 w-4 text-lilac" aria-hidden="true" />}
              </div>
              <h3 className="text-lg font-semibold text-white">{post.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
              <p className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="font-mono text-xs text-violet">
                    #{t}
                  </span>
                ))}
              </p>
            </>
          );
          return (
            <li key={post.id}>
              {!post.placeholder && post.url ? (
                <a href={post.url} target="_blank" rel="noreferrer" className="glass block h-full rounded-3xl p-6 transition hover:-translate-y-1 hover:border-violet/70">
                  {body}
                </a>
              ) : (
                <article className={`h-full rounded-3xl p-6 ${post.placeholder ? 'border border-dashed border-violet/30 bg-deep/40' : 'glass'}`}>
                  {body}
                </article>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
