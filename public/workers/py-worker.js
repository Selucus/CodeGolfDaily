// Python execution Web Worker using Pyodide
// Lazily loads Pyodide WASM runtime on first use

let pyodide = null;

async function loadPyodideRuntime() {
  if (pyodide) return pyodide;
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js");
  pyodide = await loadPyodide();
  return pyodide;
}

self.onmessage = async function (e) {
  const { code, input } = e.data;
  try {
    const py = await loadPyodideRuntime();

    // Wrap user code to capture the solve function's return value
    const wrappedCode = `
import sys
from io import StringIO

${code}

if 'solve' not in dir():
    raise Exception('You must define a solve(input) function')

__result__ = str(solve(${JSON.stringify(input)}))
__result__
`;

    const result = await py.runPythonAsync(wrappedCode);
    self.postMessage({ result: String(result) });
  } catch (err) {
    self.postMessage({ error: err.message || "Runtime error" });
  }
};
