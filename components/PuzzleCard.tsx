import { Puzzle } from "../lib/types";

interface PuzzleCardProps {
  puzzle: Puzzle;
  puzzleNumber: number;
}

export default function PuzzleCard({ puzzle, puzzleNumber }: PuzzleCardProps) {
  const difficultyColor = {
    easy: "text-green-400 bg-green-400/10",
    medium: "text-yellow-400 bg-yellow-400/10",
    hard: "text-red-400 bg-red-400/10",
  }[puzzle.difficulty];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-zinc-100">
          #{puzzleNumber}: {puzzle.title}
        </h2>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor}`}
        >
          {puzzle.difficulty}
        </span>
      </div>
      <p className="text-zinc-300 text-sm leading-relaxed">
        {puzzle.description}
      </p>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-400">Examples:</h3>
        {puzzle.examples.map((ex, i) => (
          <div key={i} className="bg-zinc-800/50 rounded-lg p-3 font-mono text-sm">
            <div className="text-zinc-400">
              Input: <span className="text-zinc-200">{JSON.stringify(ex.input)}</span>
            </div>
            <div className="text-zinc-400">
              Output: <span className="text-emerald-400">{JSON.stringify(ex.output)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
