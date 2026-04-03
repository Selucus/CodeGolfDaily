"use client";

import { useState, useEffect } from "react";
import { getTimeUntilNextPuzzle } from "../lib/puzzles";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextPuzzle());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextPuzzle());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="text-center text-sm text-zinc-500">
      Next puzzle in{" "}
      <span className="font-mono text-zinc-300">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  );
}
