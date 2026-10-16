import City, { GlobeLamp, Plant, Stars } from './City.jsx';

export function SceneDefs() {
  return (
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0c0a25" />
        <stop offset="0.55" stopColor="#141038" />
        <stop offset="1" stopColor="#0a0920" />
      </linearGradient>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1036" />
        <stop offset="0.42" stopColor="#24196a" />
        <stop offset="0.72" stopColor="#583690" />
        <stop offset="0.9" stopColor="#9d5a9e" />
        <stop offset="1" stopColor="#d07ea2" />
      </linearGradient>
      <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a2060" />
        <stop offset="0.12" stopColor="#1a1446" />
        <stop offset="0.6" stopColor="#0d0b27" />
        <stop offset="1" stopColor="#070818" />
      </linearGradient>
      <radialGradient id="lampHalo">
        <stop offset="0" stopColor="#ffcf8a" stopOpacity="0.55" />
        <stop offset="0.35" stopColor="#ffb35c" stopOpacity="0.18" />
        <stop offset="1" stopColor="#ffb35c" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lampBulb" cx="0.4" cy="0.35">
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset="0.45" stopColor="#ffd795" />
        <stop offset="1" stopColor="#f39a3c" />
      </radialGradient>
      <radialGradient id="violetGlow">
        <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.5" />
        <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="blueGlow">
        <stop offset="0" stopColor="#60a5fa" stopOpacity="0.45" />
        <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cityHaze">
        <stop offset="0" stopColor="#ffb38a" stopOpacity="0.35" />
        <stop offset="1" stopColor="#ffb38a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="mug" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c9cbe0" />
        <stop offset="0.45" stopColor="#f8f8ff" />
        <stop offset="1" stopColor="#b3b5cf" />
      </linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <filter id="softer" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
      <clipPath id="window">
        <rect x="300" y="48" width="880" height="512" rx="38" />
      </clipPath>
    </defs>
  );
}

// Desktop backdrop, drawn in the reference's 1536×1024 coordinate space.
export default function Backdrop() {
  return (
    <svg viewBox="0 0 1536 1024" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <SceneDefs />
      <rect width="1536" height="1024" fill="url(#wall)" />
      <ellipse cx="768" cy="300" rx="760" ry="380" fill="url(#violetGlow)" opacity="0.35" />

      {/* Window with dusk city */}
      <g clipPath="url(#window)">
        <rect x="300" y="48" width="880" height="512" fill="url(#sky)" />
        <Stars x0={300} x1={1180} y0={60} y1={300} count={80} />
        <ellipse cx="560" cy="500" rx="260" ry="70" fill="url(#cityHaze)" />
        <ellipse cx="980" cy="520" rx="220" ry="60" fill="url(#cityHaze)" />
        <City x0={300} x1={1180} base={562} scale={1} seed={11} />
      </g>
      <rect x="300" y="48" width="880" height="512" rx="38" fill="none" stroke="#17143b" strokeWidth="16" />
      <rect x="309" y="57" width="862" height="494" rx="31" fill="none" stroke="rgb(167 139 250 / 0.28)" strokeWidth="1.5" />
      <rect x="994" y="48" width="14" height="512" fill="#17143b" />

      {/* Left wall: plants, books, lamps */}
      <Plant x={52} y={120} scale={1.25} leaves={11} seed={4} pot={false} />
      <Plant x={70} y={470} scale={1.45} leaves={10} seed={9} />
      <g>
        <rect x="8" y="512" width="132" height="16" rx="3" fill="#3a2a6e" />
        <rect x="16" y="528" width="120" height="16" rx="3" fill="#25315e" />
        <rect x="4" y="544" width="140" height="18" rx="3" fill="#4a2b5c" />
      </g>
      <GlobeLamp cx={48} cy={484} r={27} />
      <GlobeLamp cx={276} cy={548} r={21} />

      {/* Right wall: shelf, plants, lamps */}
      <rect x="1012" y="96" width="210" height="7" rx="2" fill="#2a2152" />
      <Plant x={1110} y={96} scale={1.05} leaves={9} seed={21} />
      <Plant x={1500} y={430} scale={1.2} leaves={9} seed={33} flip />
      <GlobeLamp cx={1306} cy={420} r={14} />
      <GlobeLamp cx={1508} cy={548} r={28} />

      {/* Desk */}
      <path d="M0 560 Q768 528 1536 560 L1536 1024 L0 1024 Z" fill="url(#desk)" />
      <path d="M0 560 Q768 528 1536 560" fill="none" stroke="rgb(167 139 250 / 0.55)" strokeWidth="2" filter="url(#soft)" />
      <ellipse cx="48" cy="600" rx="110" ry="26" fill="#ffb35c" opacity="0.18" filter="url(#softer)" />
      <ellipse cx="1500" cy="610" rx="120" ry="26" fill="#ffb35c" opacity="0.18" filter="url(#softer)" />
      <ellipse cx="768" cy="720" rx="330" ry="110" fill="url(#blueGlow)" opacity="0.6" />

      {/* Orbit ellipses on the desk around the globe */}
      <ellipse cx="768" cy="706" rx="388" ry="96" fill="none" stroke="#a78bfa" strokeWidth="6" opacity="0.35" filter="url(#soft)" />
      <ellipse cx="768" cy="706" rx="388" ry="96" fill="none" stroke="#c4b5fd" strokeWidth="1.6" opacity="0.8" />
      <ellipse cx="768" cy="712" rx="318" ry="72" fill="none" stroke="#60a5fa" strokeWidth="1.2" opacity="0.45" strokeDasharray="2 6" />
      {[0.1, 0.33, 0.58, 0.81].map((p) => {
        const a = p * Math.PI * 2;
        return <circle key={p} cx={768 + Math.cos(a) * 388} cy={706 + Math.sin(a) * 96} r="3.5" fill="#e0e7ff" />;
      })}

      {/* Notebook and pencil on the desk */}
      <path d="M300 590 L420 576 L452 594 L330 610 Z" fill="#e8e4f6" opacity="0.9" />
      <path d="M306 596 L424 581" stroke="#9a92c0" strokeWidth="1" />
      <path d="M312 602 L430 587" stroke="#9a92c0" strokeWidth="1" />
      <path d="M440 606 L500 598" stroke="#f2b84b" strokeWidth="4" strokeLinecap="round" />

      {/* Mug: "AI Builds Possibilities" */}
      <g transform="translate(1030 458)">
        <ellipse cx="54" cy="112" rx="58" ry="10" fill="#000" opacity="0.35" />
        <path d="M100 30 C138 30 138 84 100 86" fill="none" stroke="#d9dbef" strokeWidth="11" />
        <path d="M0 8 L0 104 Q54 120 108 104 L108 8 Z" fill="url(#mug)" />
        <ellipse cx="54" cy="8" rx="54" ry="10" fill="#e9eaf7" />
        <ellipse cx="54" cy="9" rx="47" ry="7" fill="#3a2a22" />
        <text x="54" y="46" textAnchor="middle" fontSize="15" fontWeight="700" fill="#241c4f" fontFamily="Plus Jakarta Sans Variable, sans-serif">
          AI
        </text>
        <text x="54" y="64" textAnchor="middle" fontSize="13" fontWeight="700" fill="#241c4f" fontFamily="Plus Jakarta Sans Variable, sans-serif">
          Builds
        </text>
        <text x="54" y="81" textAnchor="middle" fontSize="12" fontWeight="700" fill="#241c4f" fontFamily="Plus Jakarta Sans Variable, sans-serif">
          Possibilities
        </text>
        <text x="54" y="97" textAnchor="middle" fontSize="11" fill="#d6a33a">
          ✦
        </text>
      </g>

      {/* Floor glow under the platforms */}
      <ellipse cx="768" cy="930" rx="760" ry="90" fill="url(#violetGlow)" opacity="0.35" />
    </svg>
  );
}
