// Single source of truth for all site text, links and the Ask-my-agent widget.
// Anything marked `draft: true` is hidden from the site until you fill it in.

export const site = {
  url: 'https://tirumalashreya.github.io', // keep in sync with the canonical / Open Graph URLs in index.html
  title: 'SVS Shreya — Building Agentic AI for a Better Tomorrow',
};

export const profile = {
  name: 'SVS Shreya',
  shortName: 'Shreya',
  role: 'Aspiring AI Engineer',
  // NOTE: your latest resume PDF says "Completed April 2025". Make these two agree before publishing.
  graduation: '2026 CSE Graduate',
  location: 'Hyderabad, Telangana, India',
  headline: { lead: 'Building', accent: 'Agentic AI', tail: 'for a Better Tomorrow' },
  subtitle: '2026 CSE Graduate | Aspiring AI Engineer',
  description:
    'Passionate about building real-world AI solutions using LLMs, multi-agent systems and full-stack technologies.',
  availability: 'Available immediately · open to relocation',
  email: 'venkataseshashreya@gmail.com',
  links: {
    github: 'https://github.com/Tirumalashreya',
    linkedin: 'https://www.linkedin.com/in/svsshreya',
  },
  // Set to null if you remove the PDF; the buttons then switch to "Resume on request".
  resume: '/SVS_Shreya_Resume.pdf',
  education: {
    school: 'Stanley College of Engineering and Technology for Women, Hyderabad',
    degree: 'B.Tech, Computer Science Engineering',
    cgpa: '8.78 / 10',
  },
};

export const about = {
  paragraphs: [
    "I'm an aspiring AI Engineer from Hyderabad who likes turning language models into systems that do real work: agents that research, write, review and hand off to each other.",
    'Most of what I build is multi-agent: orchestrators that route intent, specialist agents with tools (MCP, retrieval, web search), and a review step before anything reaches a person. I care as much about the FastAPI backend and the UI around an agent as about the prompt inside it.',
    'I learn by shipping: internships at Tech Mahindra Makers Lab and Carbynetech, open-source pull requests, hackathons, and personal projects that keep getting another iteration.',
  ],
  facts: [
    { label: 'Based in', value: 'Hyderabad, India' },
    { label: 'Education', value: 'B.Tech CSE · CGPA 8.78' },
    { label: 'Focus', value: 'Agentic AI, LLMs, RAG, full-stack AI apps' },
    { label: 'Status', value: 'Available immediately · open to relocation' },
  ],
};

// Hero: floating ideas panel and motivational wall panel.
export const ideasFlow = ['Ideas', 'Build', 'Learn', 'Improve', 'Travel', 'Make it happen'];
export const motto = ['Disciplined', 'Learning', 'Creates', 'a Life I Love'];
export const shelfBooks = ['LLMs', 'Multi-Agent Systems', 'Computer Science', 'A Better Tomorrow'];

// Hero: panels around the globe. `target` is the section a click scrolls to.
export const globeFeatures = [
  {
    id: 'llm',
    title: 'LLM Agents',
    items: ['Multi-agent systems', 'RAG', 'Tool use'],
    icon: 'brain',
    target: 'projects',
  },
  {
    id: 'impact',
    title: 'Real-world Impact',
    items: ['AI for education', 'Farmers', 'Operations'],
    icon: 'users',
    target: 'about',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    items: ['React', 'FastAPI', 'Databases'],
    icon: 'code',
    target: 'skills',
  },
  {
    id: 'research',
    title: 'Research & Innovation',
    items: ['Building', 'Learning', 'Exploring new ideas'],
    icon: 'file',
    target: 'blog',
  },
];

// Bottom navigation platforms in the hero. `object` picks the 3D model.
export const platforms = [
  { id: 'about', label: 'About Me', object: 'house' },
  { id: 'projects', label: 'Projects', object: 'laptop' },
  { id: 'skills', label: 'Skills', object: 'robot' },
  { id: 'experience', label: 'Experience', object: 'document' },
  { id: 'blog', label: 'Blog', object: 'books' },
  { id: 'contact', label: 'Contact', object: 'plane' },
];

export const navLinks = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

/*
 * Projects. status: 'live' | 'open-source' | 'in-progress' | 'internship'.
 * architecture.nodes use a small grid: col (0..3) left→right, row (0..2) top→bottom.
 */
export const projects = [
  {
    id: 'scholaragent',
    name: 'ScholarAgent',
    tagline: 'Multi-agent research & writing system · Tech Mahindra Makers Lab',
    status: 'internship',
    summary:
      'My internship project at Tech Mahindra Makers Lab. Give it a topic and get a publication-ready paper. An Orchestrator routes each request to one of three pipelines (full, write, edit) across Researcher, Writer and Editor agents built on Google ADK.',
    highlights: [
      'Researcher finds real papers on arXiv and fetches pages live through an MCP fetch server',
      'Writer drafts Abstract → References; Editor fixes tone, removes AI-pattern phrasing and checks citations',
      'FastAPI backend with JWT auth and SQLite, deployed on Railway',
    ],
    tools: ['Google ADK', 'MCP', 'Groq · Llama 3', 'FastAPI', 'JWT', 'SQLite', 'Railway'],
    architecture: {
      nodes: [
        { id: 'u', label: 'user', col: 0, row: 1 },
        { id: 'orc', label: 'orchestrator', col: 1, row: 1 },
        { id: 'res', label: 'researcher', col: 2, row: 0 },
        { id: 'wri', label: 'writer', col: 2, row: 2 },
        { id: 'edi', label: 'editor', col: 3, row: 1 },
      ],
      edges: [['u', 'orc'], ['orc', 'res'], ['res', 'wri'], ['orc', 'wri'], ['wri', 'edi']],
    },
    links: {
      github: 'https://github.com/Tirumalashreya/ScholarAgent',
      demo: 'https://scholaragent-production.up.railway.app/app.html',
    },
  },
  {
    id: 'rag-debate',
    name: 'Multi-PDF RAG Debate Bot',
    tagline: 'Grounded comparison of two research papers',
    status: 'open-source',
    summary:
      'Upload two papers and ask a question: the bot retrieves evidence from each, compares them, and reports differences, contradictions and a confidence score using a local LLM.',
    highlights: [
      'Hybrid retrieval: cosine top-10 search, then CrossEncoder reranking to the best 5 chunks per paper',
      'Local Llama 3 through Ollama for cross-paper reasoning',
      'Hallucination check with the Gemini API against the retrieved context',
    ],
    tools: ['LangChain', 'ChromaDB', 'MiniLM', 'CrossEncoder', 'Ollama', 'Gemini', 'Gradio'],
    architecture: {
      nodes: [
        { id: 'pdf', label: 'pdf A / B', col: 0, row: 1 },
        { id: 'vec', label: 'chroma', col: 1, row: 1 },
        { id: 'rr', label: 'reranker', col: 2, row: 0 },
        { id: 'llm', label: 'llama 3', col: 2, row: 2 },
        { id: 'eval', label: 'checker', col: 3, row: 1 },
      ],
      edges: [['pdf', 'vec'], ['vec', 'rr'], ['rr', 'llm'], ['llm', 'eval']],
    },
    links: { github: 'https://github.com/Tirumalashreya/multi-pdf-rag-debate-bot', demo: null },
  },
  {
    id: 'edubridge',
    draft: true, // TODO(shreya): add description, stack and links, then delete this line.
    name: 'EduBridge',
    tagline: 'Offline-first rural education PWA with AI tutoring',
    status: 'in-progress',
    summary: '',
    highlights: [],
    tools: [],
    architecture: null,
    links: { github: null, demo: null },
  },
];

// Skill groups (verified against the resume and local repositories).
export const skillGroups = [
  {
    id: 'ai',
    title: 'AI, LLMs & agentic systems',
    icon: 'brain',
    items: ['Google ADK', 'LangGraph', 'LangChain', 'MCP', 'A2A protocol', 'Multi-agent systems', 'RAG pipelines', 'Tool calling', 'Prompt engineering', 'Gemini', 'Llama 3 · Groq · Ollama', 'scikit-learn', 'NumPy · Pandas'],
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    icon: 'server',
    items: ['Python', 'Java', 'OOP', 'FastAPI', 'REST APIs', 'JWT auth'],
  },
  {
    id: 'frontend',
    title: 'Frontend development',
    icon: 'layout',
    items: ['React', 'React Native', 'JavaScript', 'HTML', 'CSS', 'Streamlit', 'Gradio'],
  },
  {
    id: 'data',
    title: 'Databases & infrastructure',
    icon: 'database',
    items: ['SQL', 'SQLite', 'MongoDB', 'ChromaDB', 'Firebase', 'Railway'],
  },
  {
    id: 'tools',
    title: 'Developer tools',
    icon: 'wrench',
    items: ['Git', 'GitHub', 'Cursor', 'Vite', 'Jupyter'],
  },
];

export const experience = [
  {
    id: 'techmahindra',
    org: 'Tech Mahindra · Makers Lab',
    role: 'AI Engineering Intern',
    type: 'Internship',
    period: 'Apr 2025 – Jul 2025',
    location: 'Hyderabad',
    points: [
      'Built ScholarAgent, a multi-agent research and writing system on Google ADK in which Orchestrator, Researcher, Writer and Editor agents hand work to each other to produce a full research paper.',
      'Connected the Researcher to arXiv paper discovery and MCP tool calling for live web fetching; the Editor polishes tone and removes AI-pattern phrasing.',
      'Designed the Orchestrator to route intent across three pipelines (full, write, edit) using Groq LLMs.',
      'Built the FastAPI backend with JWT auth and SQLite, and deployed it live on Railway.',
      'MCP Video Insight Hub: semantic search and Q&A over video, with transcript extraction, highlights, analytics and translation.',
    ],
  },
  {
    id: 'carbynetech',
    org: 'Carbynetech',
    role: 'Software Engineering Intern (ReactJS)',
    type: 'Internship',
    period: 'Apr 2024 – Jun 2024',
    location: 'Hyderabad',
    points: [
      'Built a ReactJS front end for a pharmaceutical batch-manufacturing system, integrated with MongoDB.',
      'Enabled monitoring of production workflows, batch records and inventory.',
    ],
  },
  {
    id: 'education',
    org: 'Stanley College of Engineering and Technology for Women',
    role: 'B.Tech, Computer Science Engineering · CGPA 8.78',
    type: 'Education',
    period: '',
    location: 'Hyderabad',
    points: [
      'Open source: SSOC 2025 AutoEDA (null-handling refactor PR #50, unit tests PR #97, PCA suite PR #79) and a Stock Market Analyzer SMA strategy (PR #12).',
      "Hackathons: shortlisted internationally at REVA 'She Codes' (AR/VR in medicine); ML career-guidance tool at ACM-W BITS; second round at CODE-A-THON 2K24.",
    ],
  },
];

// Blog / learning. Entries with `placeholder: true` are shown as clearly marked drafts.
// Replace with real posts: set placeholder to false and add a `url`.
export const posts = [
  {
    id: 'mcp-fetch',
    placeholder: true,
    title: 'Giving a research agent live web access with MCP',
    excerpt: "Planned write-up: wiring an MCP fetch server into ScholarAgent's Researcher agent.",
    tags: ['MCP', 'Tool use'],
    url: null,
  },
  {
    id: 'adk-routing',
    placeholder: true,
    title: 'Routing intent across three pipelines with Google ADK',
    excerpt: "Planned write-up: how ScholarAgent's orchestrator chooses between full, write and edit flows.",
    tags: ['Google ADK', 'Agents'],
    url: null,
  },
  {
    id: 'rerank',
    placeholder: true,
    title: 'Why reranking mattered more than the LLM',
    excerpt: 'Planned write-up: lessons from hybrid retrieval and CrossEncoder reranking in the RAG Debate Bot.',
    tags: ['RAG', 'Retrieval'],
    url: null,
  },
];

export const contact = {
  heading: "Let's build something together",
  intro:
    "I'm looking for AI Engineer roles and collaborations on agentic AI. The fastest way to reach me is email; I usually reply within a day.",
};

/*
 * Scripted answers for the Ask-my-agent widget (used when no LLM backend is
 * configured, or as a fallback). Keywords are matched against the question.
 */
export const faq = [
  {
    keywords: ['who', 'about', 'yourself', 'introduce', 'shreya', 'summary'],
    answer: `${profile.name} is an aspiring AI Engineer in Hyderabad, focused on agentic AI: multi-agent systems, LLMs, RAG and full-stack AI apps.`,
  },
  {
    keywords: ['available', 'hire', 'hiring', 'join', 'relocat', 'notice', 'open to', 'job', 'role'],
    answer: `${profile.availability}. Best way to reach her: ${profile.email}.`,
  },
  {
    keywords: ['contact', 'email', 'reach', 'mail', 'linkedin', 'connect'],
    answer: `Email ${profile.email} or connect on LinkedIn (${profile.links.linkedin}).`,
  },
  {
    keywords: ['resume', 'cv'],
    answer: 'Use the "Download Resume" button in the hero or the Contact section.',
  },
  {
    keywords: ['education', 'college', 'degree', 'cgpa', 'gpa', 'study', 'graduat'],
    answer: `${profile.education.degree} from ${profile.education.school}, CGPA ${profile.education.cgpa}.`,
  },
  {
    keywords: ['experience', 'intern', 'work', 'tech mahindra', 'makers lab', 'carbynetech', 'company'],
    answer:
      'Two internships: AI Engineering Intern at Tech Mahindra Makers Lab (Apr–Jul 2025), where she built ScholarAgent (a Google ADK multi-agent research and writing system) and an MCP video insight hub; and ReactJS Software Engineering Intern at Carbynetech (Apr–Jun 2024).',
  },
  {
    keywords: ['mcp', 'model context protocol'],
    answer:
      'She has used MCP in ScholarAgent, her Tech Mahindra Makers Lab project (an MCP fetch server gives the Researcher live web access), and in the MCP Video Insight Hub.',
  },
  {
    keywords: ['a2a', 'agent-to-agent', 'agent to agent'],
    answer:
      'At Tech Mahindra Makers Lab she built ScholarAgent, where Orchestrator, Researcher, Writer and Editor agents hand work to each other to research and write a full paper.',
  },
  {
    keywords: ['adk', 'google adk', 'agent development kit', 'multi-agent', 'multi agent', 'orchestrat', 'langgraph'],
    answer:
      'Her main agent framework is Google ADK: ScholarAgent coordinates Orchestrator, Researcher, Writer and Editor agents, with the Orchestrator routing between full, write and edit pipelines. She also works with LangChain and LangGraph.',
  },
  {
    keywords: ['rag', 'retrieval', 'vector', 'chroma', 'embedding', 'rerank'],
    answer:
      'The Multi-PDF RAG Debate Bot uses MiniLM embeddings in ChromaDB, top-10 cosine search, CrossEncoder reranking to the best 5 chunks, a local Llama 3 and a Gemini hallucination check.',
  },
];
