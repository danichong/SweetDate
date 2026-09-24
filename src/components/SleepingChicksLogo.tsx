import React from 'react';

interface SleepingChicksLogoProps {
  className?: string;
}

export const SleepingChicksLogo: React.FC<SleepingChicksLogoProps> = ({ className = 'w-10 h-8' }) => {
  return (
    <svg
      viewBox="0 0 54 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Dos pollitos dormidos"
    >
      <defs>
        {/* Soft shadow under the chicks */}
        <filter id="chick-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Floating sleep Z's (lilac) */}
      <g className="animate-pulse" style={{ animationDuration: '3s' }}>
        <path
          d="M 37 9 L 41 9 L 37 13 L 41 13"
          stroke="#b892ff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 43 4 L 48 4 L 43 9 L 48 9"
          stroke="#b892ff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Tiny floating love sparkle between them */}
        <path
          d="M 26 6 C 26 4.5 24.5 4 23.5 5 C 22.5 4 21 4.5 21 6 C 21 7.8 23.5 9.5 23.5 9.5 C 23.5 9.5 26 7.8 26 6 Z"
          fill="#f472b6"
          opacity="0.85"
        />
      </g>

      {/* Ground soft shadow */}
      <ellipse cx="27" cy="34" rx="22" ry="3" fill="#030712" opacity="0.4" />

      {/* ================= CHICK 1 (LEFT, slightly larger, snuggling) ================= */}
      <g id="chick-left" filter="url(#chick-shadow)">
        {/* Tuft feather on top of head */}
        <path
          d="M 16 12 C 15 8 18 8 18 12 C 19 9 22 10 20 13"
          stroke="#eab308"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Chick 1 Body */}
        <ellipse cx="18" cy="23" rx="12" ry="11" fill="#FDE047" />

        {/* Wing resting on side */}
        <path
          d="M 8 23 C 7 26 9 30 14 29 C 11 29 9 27 9 23"
          fill="#FACC15"
        />
        <path
          d="M 8 23 C 7 26 10 30 14 29"
          stroke="#CA8A04"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left Sleeping Eye (peaceful closed curve) */}
        <path
          d="M 11 21 Q 13.5 23.5 16 21"
          stroke="#334155"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Sleeping Eye */}
        <path
          d="M 18 21 Q 20.5 23.5 23 21"
          stroke="#334155"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy blush cheeks */}
        <ellipse cx="10" cy="23.5" rx="2" ry="1.4" fill="#fb7185" opacity="0.65" />
        <ellipse cx="23.5" cy="23.5" rx="2" ry="1.4" fill="#fb7185" opacity="0.65" />

        {/* Beak (peaceful sleeping little orange beak) */}
        <polygon points="15.5,22 18.5,22 17,25" fill="#FB923C" stroke="#EA580C" strokeWidth="0.6" strokeLinejoin="round" />

        {/* Little sleeping breath / smile line */}
        <path d="M 16.5 25 Q 17 26 17.5 25" stroke="#EA580C" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      </g>

      {/* ================= CHICK 2 (RIGHT, head leaning warmly on Chick 1) ================= */}
      <g id="chick-right" filter="url(#chick-shadow)">
        {/* Tuft feather on head */}
        <path
          d="M 35 13 C 35 9 38 10 37 14 C 38 11 41 12 39 15"
          stroke="#eab308"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Chick 2 Body (leaning at slight angle) */}
        <ellipse cx="34" cy="24" rx="11.5" ry="10.5" fill="#FEF08A" />

        {/* Wing resting on outer side */}
        <path
          d="M 43 24 C 44 27 42 31 37 30 C 40 30 43 28 43 24"
          fill="#FDE047"
        />
        <path
          d="M 43 24 C 44 27 41 31 37 30"
          stroke="#CA8A04"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left Sleeping Eye */}
        <path
          d="M 28.5 22.5 Q 31 24.8 33.5 22.5"
          stroke="#334155"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Sleeping Eye */}
        <path
          d="M 35.5 22.5 Q 38 24.8 40.5 22.5"
          stroke="#334155"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy blush cheeks */}
        <ellipse cx="27.5" cy="24.5" rx="1.8" ry="1.3" fill="#fb7185" opacity="0.65" />
        <ellipse cx="41.5" cy="24.5" rx="1.8" ry="1.3" fill="#fb7185" opacity="0.65" />

        {/* Beak */}
        <polygon points="33,23.5 36,23.5 34.5,26.5" fill="#FB923C" stroke="#EA580C" strokeWidth="0.6" strokeLinejoin="round" />

        {/* Little sleeping smile */}
        <path d="M 34 26.5 Q 34.5 27.2 35 26.5" stroke="#EA580C" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
};
