// src/setupPolyfills.js
// 1) Provide `global` for libraries that expect Node-like env
if (typeof global === "undefined") {
  // eslint-disable-next-line no-undef
  window.global = window;
}

// 2) Provide minimal `process` if not present (we already fixed process in other file,
// but add here to be safe for libs that expect process.env)
if (typeof process === "undefined") {
  window.process = { env: {} };
} else if (!process.env) {
  process.env = {};
}

// 3) Some older libs expect Buffer
if (typeof window.Buffer === "undefined") {
  // lightweight shim using globalThis if Buffer available via bundler; otherwise skip
  try {
    // Try to use browser's Buffer if provided by a polyfill package
    // If not provided, don't crash — many libs don't need Buffer at runtime in browser.
    // You can install 'buffer' package and uncomment the next lines if needed:
    // import { Buffer } from 'buffer';
    // window.Buffer = Buffer;
  } catch (e) {
    // noop
  }
}
