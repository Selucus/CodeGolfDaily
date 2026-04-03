import { Puzzle } from "./types";

import puzzle1 from "../puzzles/001-reverse-string.json";
import puzzle2 from "../puzzles/002-fizzbuzz.json";
import puzzle3 from "../puzzles/003-sum-digits.json";
import puzzle4 from "../puzzles/004-palindrome.json";
import puzzle5 from "../puzzles/005-count-vowels.json";
import puzzle6 from "../puzzles/006-triangle-numbers.json";
import puzzle7 from "../puzzles/007-caesar-cipher.json";
import puzzle8 from "../puzzles/008-max-element.json";
import puzzle9 from "../puzzles/009-remove-duplicates.json";
import puzzle10 from "../puzzles/010-binary-convert.json";
import puzzle11 from "../puzzles/011-title-case.json";
import puzzle12 from "../puzzles/012-fibonacci.json";
import puzzle13 from "../puzzles/013-run-length-encode.json";
import puzzle14 from "../puzzles/014-prime-check.json";
import puzzle15 from "../puzzles/015-sort-string.json";
import puzzle16 from "../puzzles/016-collatz-steps.json";
import puzzle17 from "../puzzles/017-pig-latin.json";
import puzzle18 from "../puzzles/018-roman-numerals.json";
import puzzle19 from "../puzzles/019-balanced-brackets.json";
import puzzle20 from "../puzzles/020-diamond.json";

const allPuzzles: Puzzle[] = [
  puzzle1, puzzle2, puzzle3, puzzle4, puzzle5,
  puzzle6, puzzle7, puzzle8, puzzle9, puzzle10,
  puzzle11, puzzle12, puzzle13, puzzle14, puzzle15,
  puzzle16, puzzle17, puzzle18, puzzle19, puzzle20,
] as Puzzle[];

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
