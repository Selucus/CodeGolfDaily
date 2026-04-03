// JavaScript execution Web Worker
// Runs user code in an isolated context with no DOM/network access

self.onmessage = function (e) {
  const { code, input } = e.data;
  try {
    // Create a restricted scope - no access to importScripts, fetch, etc.
    const restrictedGlobals = {
      self: undefined,
      importScripts: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
      WebSocket: undefined,
    };

    // Wrap user code to capture the solve function's return value
    const wrappedCode = `
      ${Object.keys(restrictedGlobals)
        .map((g) => `var ${g} = undefined;`)
        .join("\n")}
      ${code}
      if (typeof solve !== 'function') {
        throw new Error('You must define a solve(input) function');
      }
      return solve(${JSON.stringify(input)});
    `;

    const fn = new Function(wrappedCode);
    const result = fn();
    self.postMessage({ result: String(result) });
  } catch (err) {
    self.postMessage({ error: err.message || "Runtime error" });
  }
};
