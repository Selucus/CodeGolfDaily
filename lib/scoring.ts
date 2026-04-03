import { Language } from "./types";

export function getCharCount(code: string): number {
  return code.replace(/\s+/g, "").length;
}

export function getDisplayCharCount(code: string): number {
  return code.length;
}

export function getStarRating(
  charCount: number,
  par: number
): 1 | 2 | 3 | 4 | 5 {
  const ratio = charCount / par;
  if (ratio <= 0.7) return 5;
  if (ratio <= 0.9) return 4;
  if (ratio <= 1.15) return 3;
  if (ratio <= 1.5) return 2;
  return 1;
}

export function getStarEmoji(stars: number): string {
  return "⭐".repeat(stars) + "☆".repeat(5 - stars);
}

export function getRatingLabel(stars: number): string {
  switch (stars) {
    case 5:
      return "Hole in One!";
    case 4:
      return "Birdie!";
    case 3:
      return "Par";
    case 2:
      return "Bogey";
    default:
      return "Double Bogey";
  }
}
