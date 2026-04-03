import { Language } from "./types";
import { getStarEmoji, getRatingLabel } from "./scoring";

export function generateShareText(
  puzzleNumber: number,
  puzzleTitle: string,
  charCount: number,
  stars: number,
  language: Language,
  code: string
): string {
  const langLabel = language === "javascript" ? "JavaScript" : "Python";
  const langTag = language === "javascript" ? "js" : "python";
  return [
    `CodeGolfDaily #${puzzleNumber} - "${puzzleTitle}"`,
    `${langLabel}: ${charCount} chars ${getStarEmoji(stars)}`,
    getRatingLabel(stars),
    "",
    "```" + langTag,
    code,
    "```",
    "",
    "codegolfdaily.com",
  ].join("\n");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
