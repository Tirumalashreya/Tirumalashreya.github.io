export default function SectionHeading({ id, eyebrow, title, intro, align = 'left' }) {
  const center = align === 'center';
  return (
    <div className={`mb-12 ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      <p className={`mb-3 flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-violet uppercase ${center ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-violet" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 id={`${id}-title`} className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
