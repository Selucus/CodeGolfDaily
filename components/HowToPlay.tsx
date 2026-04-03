"use client";

interface HowToPlayProps {
  open: boolean;
  onClose: () => void;
}

export default function HowToPlay({ open, onClose }: HowToPlayProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold text-zinc-100">How to Play</h2>
        <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
          <p>
            A new coding challenge appears every day. Your goal: <strong className="text-zinc-100">solve it in as few characters as possible</strong>.
          </p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start">
              <span className="text-emerald-400 font-mono font-bold shrink-0">1.</span>
              <span>Write a <code className="text-amber-400 bg-zinc-800 px-1 rounded">solve(input)</code> function that returns the correct output</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-emerald-400 font-mono font-bold shrink-0">2.</span>
              <span><strong>Run</strong> to test against visible cases, <strong>Submit</strong> to run all tests including hidden ones</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-emerald-400 font-mono font-bold shrink-0">3.</span>
              <span>Get stars based on how short your code is relative to par</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-emerald-400 font-mono font-bold shrink-0">4.</span>
              <span>Submit in both <strong>JavaScript</strong> and <strong>Python</strong> for extra challenge</span>
            </div>
          </div>
          <p className="text-zinc-500">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300">Cmd+Enter</kbd> to run tests quickly.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Let&apos;s Golf!
        </button>
      </div>
    </div>
  );
}
