"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Header from "../components/Header";
import HowToPlay from "../components/HowToPlay";
import PuzzleCard from "../components/PuzzleCard";
import CodeEditor from "../components/CodeEditor";
import TestResults from "../components/TestResults";
import ShareCard from "../components/ShareCard";
import Countdown from "../components/Countdown";
import { getDailyPuzzle, getPuzzleNumber } from "../lib/puzzles";
import { executeCode } from "../lib/executor";
import { getDisplayCharCount } from "../lib/scoring";
import { Language, ExecutionResult } from "../lib/types";

const STARTER_CODE = {
  javascript: `function solve(input) {\n  // Your code here\n  return "";\n}`,
  python: `def solve(input):\n    # Your code here\n    return ""`,
};

interface Submission {
  code: string;
  result: ExecutionResult;
}

function storageKey(puzzleId: number, lang: Language) {
  return `cgd-${puzzleId}-${lang}`;
}

export default function Home() {
  const puzzle = getDailyPuzzle();
  const puzzleNumber = getPuzzleNumber();

  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);
  const [loadingPython, setLoadingPython] = useState(false);
  const [playground, setPlayground] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Show help on first visit
  useEffect(() => {
    if (!localStorage.getItem("cgd-seen-help")) {
      setShowHelp(true);
      localStorage.setItem("cgd-seen-help", "1");
    }
  }, []);

  // Per-language submissions
  const [submissions, setSubmissions] = useState<
    Partial<Record<Language, Submission>>
  >({});

  // Track in-progress code per language so switching doesn't lose work
  const drafts = useRef<Partial<Record<Language, string>>>({});

  // Load saved submissions on mount
  useEffect(() => {
    const loaded: Partial<Record<Language, Submission>> = {};
    for (const lang of ["javascript", "python"] as Language[]) {
      const stored = localStorage.getItem(storageKey(puzzle.id, lang));
      if (stored) {
        loaded[lang] = JSON.parse(stored);
      }
    }
    setSubmissions(loaded);

    // If there's a JS submission, show it; otherwise if Python, show that
    if (loaded.javascript) {
      setLanguage("javascript");
      setCode(loaded.javascript.code);
      setResult(loaded.javascript.result);
    } else if (loaded.python) {
      setLanguage("python");
      setCode(loaded.python.code);
      setResult(loaded.python.result);
    }
  }, [puzzle.id]);

  const currentSubmission = submissions[language];
  const isSubmitted = !!currentSubmission;
  const editorReadOnly = isSubmitted && !playground;
  const showActionButtons = !isSubmitted || playground;

  const switchLanguage = useCallback(
    (lang: Language) => {
      if (lang === language) return;

      // Save current draft if we're editing (not submitted or in playground)
      if (!submissions[language] || playground) {
        drafts.current[language] = code;
      }

      setLanguage(lang);
      setPlayground(false);

      const sub = submissions[lang];
      if (sub) {
        // This language has a submission — show it locked
        setCode(sub.code);
        setResult(sub.result);
      } else {
        // No submission — restore draft or use starter code
        setCode(drafts.current[lang] ?? STARTER_CODE[lang]);
        setResult(null);
      }
    },
    [language, code, submissions, playground]
  );

  const handleRun = useCallback(async () => {
    setRunning(true);
    if (language === "python") setLoadingPython(true);
    try {
      const res = await executeCode(code, puzzle.testCases, language, true);
      setResult(res);
    } catch {
      setResult({
        results: [],
        allPassed: false,
        error: "Execution failed",
      });
    } finally {
      setRunning(false);
      setLoadingPython(false);
    }
  }, [code, puzzle.testCases, language]);

  const handleRunAll = useCallback(async () => {
    setRunning(true);
    if (language === "python") setLoadingPython(true);
    try {
      const res = await executeCode(code, puzzle.testCases, language, false);
      setResult(res);
    } catch {
      setResult({
        results: [],
        allPassed: false,
        error: "Execution failed",
      });
    } finally {
      setRunning(false);
      setLoadingPython(false);
    }
  }, [code, puzzle.testCases, language]);

  const handleSubmit = useCallback(async () => {
    setRunning(true);
    if (language === "python") setLoadingPython(true);
    try {
      const res = await executeCode(code, puzzle.testCases, language, false);
      setResult(res);
      if (res.allPassed) {
        const sub: Submission = { code, result: res };
        setSubmissions((prev) => ({ ...prev, [language]: sub }));
        localStorage.setItem(
          storageKey(puzzle.id, language),
          JSON.stringify(sub)
        );
        // Clear draft for this language
        delete drafts.current[language];

        // Update streak (only once per day, on first submission of either language)
        const hadAnySubmission = Object.keys(submissions).length > 0;
        if (!hadAnySubmission) {
          const today = new Date().toISOString().slice(0, 10);
          const lastDate = localStorage.getItem("cgd-last-date");
          const currentStreak = parseInt(
            localStorage.getItem("cgd-streak") || "0",
            10
          );
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .slice(0, 10);
          if (lastDate === yesterday) {
            localStorage.setItem("cgd-streak", String(currentStreak + 1));
          } else if (lastDate !== today) {
            localStorage.setItem("cgd-streak", "1");
          }
          localStorage.setItem("cgd-last-date", today);
        }
      }
    } catch {
      setResult({
        results: [],
        allPassed: false,
        error: "Execution failed",
      });
    } finally {
      setRunning(false);
      setLoadingPython(false);
    }
  }, [code, puzzle, language, submissions]);

  const enterPlayground = useCallback(() => {
    setPlayground(true);
    // Start playground with the submitted code
    if (submissions[language]) {
      setCode(submissions[language].code);
    }
    setResult(null);
  }, [submissions, language]);

  const exitPlayground = useCallback(() => {
    setPlayground(false);
    const sub = submissions[language];
    if (sub) {
      setCode(sub.code);
      setResult(sub.result);
    }
  }, [submissions, language]);

  const charCount = getDisplayCharCount(code);
  const par = puzzle.par[language === "javascript" ? "js" : "python"];

  // For share card, use the submitted code's stats
  const submittedCharCount = currentSubmission
    ? getDisplayCharCount(currentSubmission.code)
    : charCount;

  return (
    <div className="flex flex-col min-h-screen">
      <Header onHelp={() => setShowHelp(true)} />
      <HowToPlay open={showHelp} onClose={() => setShowHelp(false)} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-5">
        <PuzzleCard puzzle={puzzle} puzzleNumber={puzzleNumber} />

        {/* Playground banner */}
        {playground && (
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5">
            <span className="text-sm text-amber-400">
              Playground mode - this won&apos;t affect your daily score
            </span>
            <button
              onClick={exitPlayground}
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Back to submission
            </button>
          </div>
        )}

        {/* Language Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchLanguage("javascript")}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              language === "javascript"
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            JavaScript
            {submissions.javascript && (
              <span className="ml-1.5 text-emerald-400">&#10003;</span>
            )}
          </button>
          <button
            onClick={() => switchLanguage("python")}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              language === "python"
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Python
            {submissions.python && (
              <span className="ml-1.5 text-emerald-400">&#10003;</span>
            )}
          </button>
          <div className="ml-auto text-sm font-mono text-zinc-400">
            <span
              className={
                charCount > par ? "text-yellow-400" : "text-emerald-400"
              }
            >
              {charCount}
            </span>{" "}
            chars (par: {par})
          </div>
        </div>

        {/* Editor */}
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          readOnly={editorReadOnly}
          onRun={handleRun}
        />

        {/* Action Buttons */}
        {showActionButtons && (
          <div className="flex gap-3">
            <button
              onClick={handleRun}
              disabled={running}
              className="flex-1 py-2.5 px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {running && !loadingPython
                ? "Running..."
                : loadingPython
                ? "Loading Python..."
                : "Run Tests (visible)"}
            </button>
            {playground ? (
              <button
                onClick={handleRunAll}
                disabled={running}
                className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {running ? "Running..." : "Run All Tests"}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={running}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {running ? "Running..." : "Submit"}
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <TestResults results={result.results} allPassed={result.allPassed} />
        )}
        {result?.error && !result.results.length && (
          <div className="text-red-400 text-sm bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            {result.error}
          </div>
        )}

        {/* Share Card (after successful submit, not in playground) */}
        {isSubmitted && !playground && currentSubmission.result.allPassed && (
          <ShareCard
            puzzleNumber={puzzleNumber}
            puzzleTitle={puzzle.title}
            charCount={submittedCharCount}
            par={par}
            language={language}
            code={currentSubmission.code}
            onPlayground={enterPlayground}
          />
        )}

        {/* Countdown */}
        <Countdown />
      </main>

      <footer className="text-center py-4 text-xs text-zinc-600 border-t border-zinc-800">
        CodeGolfDaily - A new challenge every day
      </footer>
    </div>
  );
}
