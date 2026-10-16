// Regenerates the WebP copies of the hero character whenever the PNG changes,
// so replacing public/images/portfolio-character.png is all that's needed.
import { existsSync, statSync } from 'node:fs';

const src = 'public/images/portfolio-character.png';
const outputs = [
  { file: 'public/images/portfolio-character.webp', width: null },
  { file: 'public/images/portfolio-character-700.webp', width: 700 },
];

if (!existsSync(src)) {
  console.warn(`[images] ${src} is missing — the hero will render without the character.`);
} else {
  const stale = outputs.filter(({ file }) => !existsSync(file) || statSync(file).mtimeMs < statSync(src).mtimeMs);
  let sharp = null;
  if (stale.length) {
    try {
      sharp = (await import('sharp')).default;
    } catch {
      console.warn('[images] sharp is unavailable; keeping the committed WebP files.');
    }
  }
  for (const { file, width } of sharp ? stale : []) {
    let img = sharp(src);
    if (width) img = img.resize({ width });
    await img.webp({ quality: 86, alphaQuality: 90, effort: 5 }).toFile(file);
    console.log(`[images] wrote ${file}`);
  }
}
