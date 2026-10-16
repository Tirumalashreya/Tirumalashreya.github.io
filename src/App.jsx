import { LazyMotion } from 'framer-motion';
import Navbar from './components/navigation/Navbar.jsx';
import Hero from './components/hero/Hero.jsx';
import About from './components/sections/About.jsx';
import Projects from './components/sections/Projects.jsx';
import Skills from './components/sections/Skills.jsx';
import Experience from './components/sections/Experience.jsx';
import Blog from './components/sections/Blog.jsx';
import Contact from './components/sections/Contact.jsx';
import AskAgent from './components/AskAgent.jsx';
import { useCapabilities } from './hooks/useCapabilities.js';
import { profile } from './data/content.js';
import { GitHubIcon, LinkedInIcon } from './components/ui/BrandIcons.jsx';

const loadMotionFeatures = () => import('./lib/motionFeatures.js').then((mod) => mod.default);

export default function App() {
  const caps = useCapabilities();
  const rm = caps.reducedMotion;
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <Navbar />
      <main id="main">
        <Hero caps={caps} />
        <div className="relative bg-[radial-gradient(ellipse_at_top,rgb(76_52_160_/_0.18),transparent_55%),linear-gradient(180deg,#070818,#0b0a22_40%,#070818)]">
          <About reducedMotion={rm} />
          <Projects reducedMotion={rm} />
          <Skills reducedMotion={rm} />
          <Experience reducedMotion={rm} />
          <Blog />
          <Contact />
        </div>
      </main>
      <footer className="border-t border-line/60 bg-ink py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted sm:flex-row sm:px-8">
          <p>
            <span className="font-script text-2xl text-lilac">Shreya</span> · © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex items-center gap-4">
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="hover:text-lilac" aria-label="GitHub">
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-lilac" aria-label="LinkedIn">
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a href={`mailto:${profile.email}`} className="hover:text-lilac">
              {profile.email}
            </a>
          </div>
        </div>
      </footer>
      <AskAgent reducedMotion={rm} />
    </LazyMotion>
  );
}
