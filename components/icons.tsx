import React from 'react';

interface IconProps {
  className?: string;
}

export const LogoIcon: React.FC<IconProps> = ({ className = "h-8 w-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L15 12l-2.293-2.293a1 1 0 010-1.414L15 6m-5 16l2.293-2.293a1 1 0 000-1.414L10 12l2.293 2.293a1 1 0 000 1.414L10 18m7-3.293l-2.293 2.293a1 1 0 01-1.414 0L12 15l2.293 2.293a1 1 0 011.414 0L17 18.707" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const HomeIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 1200 500" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="1200" height="500" rx="16" fill="url(#bg-gradient)" />
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#eef2ff" />
        <stop offset="100%" stopColor="#f3e8ff" />
      </linearGradient>
    </defs>

    {/* Abstract shapes */}
    <path d="M-100 250 Q 150 50, 400 300 T 900 150 T 1300 400" stroke="#c7d2fe" strokeWidth="2" fill="none" opacity="0.5" />
    <path d="M-50 400 Q 200 450, 500 200 T 800 350 T 1250 100" stroke="#ddd6fe" strokeWidth="2" fill="none" opacity="0.5" />

    {/* Central element - graduation cap */}
    <g transform="translate(550 180) rotate(-10)">
      <path d="M20 50 L100 20 L180 50 L100 80 Z" fill="#4f46e5" />
      <rect x="95" y="10" width="10" height="20" fill="#4f46e5" />
      <path d="M105 30 L125 30 L125 45 Z" fill="#a5b4fc" />
    </g>

    {/* Book element */}
    <g transform="translate(250 300)">
      <rect x="0" y="0" width="120" height="80" rx="5" fill="#fef9c3" />
      <rect x="5" y="5" width="110" height="70" rx="2" fill="#fff" stroke="#fde047" strokeWidth="2" />
      <line x1="15" y1="20" x2="105" y2="20" stroke="#d1d5db" strokeWidth="2" />
      <line x1="15" y1="30" x2="105" y2="30" stroke="#d1d5db" strokeWidth="2" />
      <line x1="15" y1="40" x2="85" y2="40" stroke="#d1d5db" strokeWidth="2" />
    </g>

    {/* Lightbulb element */}
    <g transform="translate(850 320)">
      <circle cx="25" cy="25" r="20" fill="#fef08a" />
      <rect x="15" y="45" width="20" height="10" fill="#e2e8f0" />
      <path d="M 25 55 L 20 65 L 30 65 Z" fill="#94a3b8" />
      {/* rays */}
      <line x1="25" y1="-5" x2="25" y2="-15" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
      <line x1="55" y1="25" x2="65" y2="25" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
      <line x1="-5" y1="25" x2="-15" y2="25" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);
