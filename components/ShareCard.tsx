"use client";

import { useState } from "react";
import { Language } from "../lib/types";
import { getStarRating, getStarEmoji, getRatingLabel } from "../lib/scoring";
import { generateShareText, copyToClipboard } from "../lib/share";

interface ShareCardProps {
  puzzleNumber: number;
  puzzleTitle: string;
  charCount: number;
  par: number;
  language: Language;
  code: string;
  onPlayground: () => void;
}

export default function ShareCard({
  puzzleNumber,
  puzzleTitle,
  charCount,
  par,
  language,
  code,
  onPlayground,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const stars = getStarRating(charCount, par);
  const langLabel = language === "javascript" ? "JavaScript" : "Python";

  const shareText = generateShareText(
    puzzleNumber,
    puzzleTitle,
    charCount,
    stars,
    language,
    code
  );

  const handleShare = async () => {
    // Use native share on mobile if available
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }
    const success = await copyToClipboard(shareText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-zinc-800/80 rounded-xl p-5 border border-zinc-700 space-y-3">
      <div className="text-center space-y-1">
        <div className="text-2xl">{getStarEmoji(stars)}</div>
        <div className="text-lg font-bold text-zinc-100">
          {getRatingLabel(stars)}
        </div>
        <div className="text-sm text-zinc-400">
          {langLabel}: {charCount} chars (par: {par})
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors text-sm"
        >
          {copied ? "Copied!" : "Share Result"}
        </button>
        <button
          onClick={onPlayground}
          className="flex-1 py-2.5 px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-medium rounded-lg transition-colors text-sm"
        >
          Try Again in Playground
        </button>
      </div>
    </div>
  );
}
