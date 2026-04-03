import { TestResult } from "../lib/types";

interface TestResultsProps {
  results: TestResult[];
  allPassed: boolean;
}

export default function TestResults({ results, allPassed }: TestResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-2">
      <div
        className={`text-sm font-semibold ${
          allPassed ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {allPassed
          ? `All ${results.length} tests passed!`
          : `${results.filter((r) => r.passed).length}/${results.length} tests passed`}
      </div>
      <div className="space-y-1.5">
        {results.map((result, i) => (
          <div
            key={i}
            className={`rounded-lg p-2.5 font-mono text-xs border ${
              result.passed
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/20 bg-red-500/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>{result.passed ? "✓" : "✗"}</span>
              <span className="text-zinc-400">
                {result.visible ? `Test ${i + 1}` : `Hidden Test`}
              </span>
            </div>
            {result.visible && (
              <>
                <div className="text-zinc-500">
                  Input: <span className="text-zinc-300">{JSON.stringify(result.input)}</span>
                </div>
                {!result.passed && (
                  <>
                    <div className="text-zinc-500">
                      Expected: <span className="text-emerald-400">{JSON.stringify(result.expected)}</span>
                    </div>
                    <div className="text-zinc-500">
                      Got: <span className="text-red-400">{result.error ? result.error : JSON.stringify(result.actual)}</span>
                    </div>
                  </>
                )}
              </>
            )}
            {!result.visible && !result.passed && result.error && (
              <div className="text-red-400">{result.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
