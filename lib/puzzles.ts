import { Puzzle } from "./types";

import puzzle1 from "../puzzles/001-reverse-string.json";
import puzzle2 from "../puzzles/002-fizzbuzz.json";
import puzzle3 from "../puzzles/003-sum-digits.json";
import puzzle4 from "../puzzles/004-palindrome.json";
import puzzle5 from "../puzzles/005-count-vowels.json";

const allPuzzles: Puzzle[] = [puzzle1, puzzle2, puzzle3, puzzle4, puzzle5] as Puzzle[];

const EPOCH = new Date("2026-04-02T00:00:00Z").getTime();

export function getDailyPuzzle(): Puzzle {
  const now = new Date();
  const daysSinceEpoch = Math.floor(
    (now.getTime() - EPOCH) / (1000 * 60 * 60 * 24)
  );
  const index = ((daysSinceEpoch % allPuzzles.length) + allPuzzles.length) % allPuzzles.length;
  return allPuzzles[index];
}

export function getPuzzleNumber(): number {
  const now = new Date();
  const daysSinceEpoch = Math.floor(
    (now.getTime() - EPOCH) / (1000 * 60 * 60 * 24)
  );
  return daysSinceEpoch + 1;
}

export function getTimeUntilNextPuzzle(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
}
