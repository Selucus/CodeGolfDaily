import { TestCase, TestResult, ExecutionResult, Language } from "./types";

const TIMEOUT_MS = 5000;

function runInWorker(code: string, input: string, language: Language): Promise<string> {
  return new Promise((resolve, reject) => {
    const workerPath = language === "javascript" ? "/workers/js-worker.js" : "/workers/py-worker.js";
    const worker = new Worker(workerPath);
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error("Execution timed out (5s limit)"));
    }, TIMEOUT_MS);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      if (e.data.error) {
        reject(new Error(e.data.error));
      } else {
        resolve(e.data.result);
      }
    };

    worker.onerror = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      reject(new Error(e.message || "Worker error"));
    };

    worker.postMessage({ code, input });
  });
}

export async function executeCode(
  code: string,
  testCases: TestCase[],
  language: Language,
  visibleOnly: boolean = false
): Promise<ExecutionResult> {
  const cases = visibleOnly ? testCases.filter((tc) => tc.visible) : testCases;
  const results: TestResult[] = [];
  let allPassed = true;

  for (const tc of cases) {
    try {
      const actual = await runInWorker(code, tc.input, language);
      const normalizedActual = actual.trim();
      const normalizedExpected = tc.expected.trim();
      const passed = normalizedActual === normalizedExpected;
      if (!passed) allPassed = false;
      results.push({
        input: tc.input,
        expected: tc.expected,
        actual: normalizedActual,
        passed,
        visible: tc.visible,
      });
    } catch (err) {
      allPassed = false;
      results.push({
        input: tc.input,
        expected: tc.expected,
        actual: "",
        passed: false,
        visible: tc.visible,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return { results, allPassed };
}
