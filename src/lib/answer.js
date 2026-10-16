import { experience, faq, profile, projects as allProjects, skillGroups } from '../data/content.js';

const projects = allProjects.filter((p) => !p.draft);

// Scripted, grounded answers built only from src/data/content.js.

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ');

const projectChunks = projects.map((p) => ({
  keywords: [p.name, p.id, ...p.tagline.split(' ').filter((w) => w.length > 4), ...p.tools].map((k) => k.toLowerCase()),
  answer: `${p.name} — ${p.tagline}. ${p.summary} Tools: ${p.tools.join(', ')}.${
    p.links.demo ? ` Live demo: ${p.links.demo}` : ''
  }`,
  weight: 1.5,
}));

const experienceChunks = experience
  .filter((e) => e.id !== 'education')
  .map((e) => ({
    keywords: [e.org.toLowerCase(), e.id],
    answer: `${e.role} at ${e.org} (${e.period}): ${e.points.slice(0, 2).join(' ')}`,
    weight: 2,
  }));

const chunks = [...faq.map((f) => ({ ...f, weight: 2 })), ...projectChunks, ...experienceChunks];

const allTools = skillGroups.flatMap((c) =>
  c.items.map((t) => ({
    name: t,
    key: t.toLowerCase().replace(/\s*\(.*\)/, ''),
    category: c.title,
  })),
);

function toolAnswer(q) {
  const hits = allTools.filter((t) => t.key.length > 2 && new RegExp(`\\b${t.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(q));
  if (!hits.length) return null;
  const names = hits.map((h) => h.name);
  const usedIn = projects.filter((p) => p.tools.some((t) => hits.some((h) => t.toLowerCase().includes(h.key))));
  return `Yes — ${names.join(', ')} ${hits.length > 1 ? 'are' : 'is'} in her skills (${[
    ...new Set(hits.map((h) => h.category)),
  ].join(', ')}).${usedIn.length ? ` Used in: ${usedIn.map((p) => p.name).join(', ')}.` : ''}`;
}

export function answerQuestion(question) {
  const q = norm(question);
  if (!q.trim()) return null;

  if (/\b(skills?|tech stack|stack|technolog|tools)\b/.test(q) && !/\bproject/.test(q)) {
    return `Her skills — ${skillGroups.map((c) => `${c.title}: ${c.items.slice(0, 5).join(', ')}`).join('; ')}.`;
  }
  if (/\bprojects?\b/.test(q) && !projects.some((p) => q.includes(p.id) || q.includes(p.name.toLowerCase()))) {
    return `Her projects: ${projects.map((p) => `${p.name} (${p.tagline})`).join('; ')}. Ask about any of them by name.`;
  }

  let best = null;
  let bestScore = 0;
  for (const c of chunks) {
    const score = c.keywords.reduce((s, k) => (q.includes(k) ? s + k.length : s), 0) * c.weight;
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  if (best && bestScore >= 3) return best.answer;

  const tool = toolAnswer(q);
  if (tool) return tool;

  if (/\b(hi|hello|hey)\b/.test(q)) {
    return `Hi! I'm ${profile.shortName}'s portfolio agent. Ask me about her projects, skills, experience or how to reach her.`;
  }
  return null;
}

export const FALLBACK_ANSWER = `I only answer from this portfolio, and I couldn't find that here. Try asking about her projects, MCP, Google ADK, RAG, internships, or how to contact her — or email ${profile.email}.`;

export const suggestions = ['What has she built with MCP?', 'Tell me about ScholarAgent', 'Is she available?', 'What was her Tech Mahindra work?'];
