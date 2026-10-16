# SVS Shreya — Interactive 3D Agentic AI Portfolio

A cinematic night-time workspace that doubles as a portfolio. The hero recreates `design/design-reference.jpg`: Shreya at her laptop in front of a dusk skyline, an interactive 3D globe with four "Agentic AI" panels, floating robots, and six 3D navigation platforms. Below it are About, Projects, Skills, Experience, Blog and Contact sections.

**Stack:** Vite · React 19 · React Three Fiber + drei · three.js · Framer Motion · Tailwind CSS v4 · lucide-react. Hosted on GitHub Pages.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the build at http://localhost:4173
```

`npm run dev` and `npm run build` first run `scripts/optimize-images.mjs`, which regenerates the WebP copies of the character image whenever the PNG changes.

## How the hero is built

| Layer | What it is |
|---|---|
| Backdrop | One SVG in the reference's 1536×1024 coordinates: sky, procedural skyline with lit windows, window frame, plants, globe lamps, desk, orbit ellipse, mug (`components/hero/Backdrop.jsx`, `City.jsx`) |
| Props | HTML glass panels: Ideas flow, motivational wall panel, bookshelf (`HeroParts.jsx`) |
| Character | `public/images/portfolio-character.png`, served as WebP via `<picture>` (`<img>` falls back to the PNG), with a gentle float and pointer parallax |
| 3D | One fixed, transparent WebGL canvas. drei `<View>` renders the globe, two robots and six platform objects into DOM-tracked slots (`components/scene/`) |
| Foreground | Heading, buttons, "Agentic AI" label and feature panels as real HTML |

On desktop (≥1200px wide) the hero is a fixed-proportion "stage": every position is in design pixels × `--u` (stage width ÷ 1536), so it matches the reference at any width. Below 1200px it switches to a stacked layout: heading, character card, globe with a panel grid, and a 2×3 platform grid.

**Interactions:**
- Hovering or focusing a feature panel highlights its orbit ring on the globe.
- Clicking a panel or a platform scrolls to its section.
- Robots follow the cursor and blink.
- Platform objects lift and turn on hover.
- On desktop, layers move with subtle pointer parallax under a soft cursor glow.

## Editing content

All text and links live in **[`src/data/content.js`](src/data/content.js)**.

| Export | Controls |
|---|---|
| `profile` | Name, headline, subtitle, description, email, links, resume path, education |
| `about` | About paragraphs and quick facts |
| `ideasFlow`, `motto`, `shelfBooks` | Hero ideas panel, wall panel, book spines |
| `globeFeatures` | The four panels around the globe (`target` = section a click scrolls to) |
| `platforms` | The six bottom platforms (`object`: house, laptop, robot, document, books, plane) |
| `projects` | Project cards. `draft: true` hides a card; `architecture` draws the mini-diagram |
| `skillGroups` | The five skill groups |
| `experience` | Timeline entries |
| `posts` | Blog cards. `placeholder: true` shows a "Coming soon" draft; set it to `false` and add a `url` to publish |
| `faq` | Scripted answers for the "ask my agent" chat |

**Replacing assets:**
- **Character:** overwrite `public/images/portfolio-character.png` with a transparent PNG; the WebPs regenerate on the next dev or build. The original JPEG you supplied is kept locally in `design/` (not pushed to GitHub).
- **Resume:** replace `public/SVS_Shreya_Resume.pdf`, or set `profile.resume` to `null` to show "Resume on request".
- **Domain:** if you add a custom domain, replace `https://tirumalashreya.github.io` in `index.html` and `site.url`.

## Content that still needs you

- **Graduation year:** the site says "2026 CSE Graduate" (from your brief), but `SVS_Shreya_Resume.pdf` says "Completed April 2025". Make them agree.
- **EduBridge:** a hidden draft in `projects`. Add a description, stack and links, then delete `draft: true`.
- **Blog:** three clearly marked placeholder posts. Replace them with real write-ups.

## Contact form

No form backend is configured, so the Contact form validates the input and then opens the visitor's email app with the message pre-filled. Nothing is stored. To collect messages instead, point the form at a service such as Formspree or Resend, or a Vercel function, in `components/sections/Contact.jsx`.

## Ask-my-agent chat

- **Default (scripted):** keyword matching over `content.js` in the browser.
- **LLM mode:** set `VITE_ASK_AGENT_MODE=llm` and `ANTHROPIC_API_KEY` in Vercel; `api/ask.js` then answers using only `content.js`. The key never reaches the browser, and the widget falls back to scripted answers on any error.

## Performance and accessibility

- **Deferred 3D:** the three.js chunk (~250 KB gzipped) loads on the first pointer, scroll, touch or key event, or after 3 s idle on desktop (6 s on phones). Until then, a CSS globe, SVG robots and icon platforms stand in.
- **Fallbacks:** without WebGL, or on low-power devices (Save-Data, under 4 GB memory, or under 4 CPU cores), the 2D scene stays, with a note explaining why.
- **Efficient rendering:** one WebGL context for all views. Rendering stops when the hero is off-screen, and drei `PerformanceMonitor` lowers resolution when frame rate drops. There are no shadows or post-processing, and particle counts are reduced on phones.
- **`prefers-reduced-motion`:** scene animations, floating, parallax and CSS animations are off, and the 3D scene renders as still frames.
- **Accessibility:** skip link, semantic landmarks, alt text on the character, labelled diagrams and book/idea panels, keyboard-reachable panels and platforms, an accessible mobile menu (Esc closes it), and visible focus styles.

Lighthouse on the local production build (`vite preview`, uncompressed; GitHub Pages compresses files, which should improve the numbers):

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Mobile | 87 | 100 | 100 | 100 |
| Desktop | 99 | 100 | 100 | 100 |

## Hosting (GitHub Pages)

The site is hosted from the repository **Tirumalashreya/Tirumalashreya.github.io** at **https://tirumalashreya.github.io/**.

`.github/workflows/deploy.yml` builds and deploys automatically on every push to `main`. To publish a change:

```bash
git add -A
git commit -m "Update portfolio"
git push
```

The new version is live a minute or two later; progress shows in the repository's **Actions** tab. The repo's **Settings → Pages → Source** must stay on **GitHub Actions**.

GitHub Pages only serves static files, so `api/ask.js` doesn't run there and the chat widget uses its scripted answers. That's the default mode, so no change is needed. To use LLM chat later, deploy the same repo to Vercel, which runs `api/` functions, and set `ANTHROPIC_API_KEY` and `VITE_ASK_AGENT_MODE=llm`.

## Project structure

```
api/ask.js                    optional LLM chat (Vercel function)
design/                       design reference + original character JPEG (local only, gitignored)
public/images/                portfolio-character.png (+ generated .webp copies)
public/textures/              earth-day.jpg (NASA, public domain) + CREDITS.md
scripts/optimize-images.mjs   PNG → WebP, run before dev/build
src/
  data/content.js             ← all editable content
  components/
    navigation/Navbar.jsx     sticky nav, active section, mobile menu
    hero/                     Hero (stage + compact layouts), Backdrop, City, HeroParts
    scene/                    SceneCanvas (fixed canvas + Views), Globe, Robot, PlatformObjects
    sections/                 About, Projects, Skills, Experience, Blog, Contact
    ui/                       SectionHeading, ArchDiagram, BrandIcons
    AskAgent.jsx              chat widget
  hooks/                      useCapabilities, useActiveSection
  lib/                        pointer + scroll helpers, scripted chat answers
```
