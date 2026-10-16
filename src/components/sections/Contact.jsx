import { useState } from 'react';
import { Check, Copy, Download, Mail, Send } from 'lucide-react';
import { contact, profile } from '../../data/content.js';
import { GitHubIcon, LinkedInIcon } from '../ui/BrandIcons.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

function ChannelLink({ href, icon: Icon, label, value, external, download }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      download={download || undefined}
      className="glass flex items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-violet/70"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-strong/20 text-lilac">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-white">{label}</span>
        <span className="block truncate text-sm text-muted">{value}</span>
      </span>
    </a>
  );
}

// No form backend is configured, so the form composes an email in the visitor's own mail app.
function ComposeForm() {
  const [errors, setErrors] = useState({});
  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    const next = {};
    if (!name) next.name = 'Please add your name.';
    if (message.length < 10) next.message = 'Please write at least a sentence.';
    setErrors(next);
    if (Object.keys(next).length) return;
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={onSubmit} noValidate className="glass rounded-3xl p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-white">Write a quick note</h3>
      <p className="mt-1 text-sm text-muted">This opens your email app with the message filled in. Nothing is stored on this site.</p>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium text-lilac">
            Your name
          </label>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'cf-name-err' : undefined}
            className="w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-text placeholder:text-muted/70 focus:border-violet focus:outline-none"
          />
          {errors.name && (
            <p id="cf-name-err" className="mt-1 text-sm text-amber">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium text-lilac">
            Message
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={4}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'cf-message-err' : undefined}
            className="w-full resize-y rounded-xl border border-line bg-ink/60 px-4 py-3 text-text focus:border-violet focus:outline-none"
          />
          {errors.message && (
            <p id="cf-message-err" className="mt-1 text-sm text-amber">
              {errors.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-violet-strong px-6 py-3 font-semibold text-ink shadow-[0_0_26px_-6px_rgb(139_92_246_/_0.9)] transition hover:brightness-110"
      >
        Open in email app <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading id="contact" eyebrow="Contact" title={contact.heading} intro={contact.intro} />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <ChannelLink href={`mailto:${profile.email}`} icon={Mail} label="Email" value={profile.email} />
          <ChannelLink href={profile.links.linkedin} icon={LinkedInIcon} label="LinkedIn" value="linkedin.com/in/svsshreya" external />
          <ChannelLink href={profile.links.github} icon={GitHubIcon} label="GitHub" value="github.com/Tirumalashreya" external />
          {profile.resume && <ChannelLink href={profile.resume} icon={Download} label="Resume" value="Download PDF" download />}
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 pt-2 text-sm text-muted transition hover:text-lilac"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? 'Email copied' : 'Copy email address'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </div>
        <ComposeForm />
      </div>
    </section>
  );
}
