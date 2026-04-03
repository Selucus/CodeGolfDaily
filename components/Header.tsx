"use client";

import { useState, useEffect } from "react";

export default function Header({ onHelp }: { onHelp: () => void }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("cgd-streak");
    if (stored) setStreak(parseInt(stored, 10) || 0);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-zinc-100">CodeGolfDaily</span>
        <span className="text-xs text-zinc-500 font-mono">{"</>"}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-zinc-400">
        {streak > 0 && (
          <span className="font-mono">
            {streak} day streak
          </span>
        )}
        <button
          onClick={onHelp}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="How to play"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
