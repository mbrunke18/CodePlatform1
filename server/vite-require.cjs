'use strict';
// These wrapper functions are top-level static assignments, which Node.js
// ESM static analysis CAN detect and synthesize as named exports.
// The actual require("vite") call happens at invocation time, bypassing the
// issue where index.cjs assigns async functions inside a forEach loop (which
// Node.js static analysis cannot detect, so those exports appear as undefined
// when the CJS module is imported from ESM via dynamic import()).

exports.createViteServer = function createViteServer(...args) {
  return require('vite').createServer(...args);
};

exports.createViteLogger = function createViteLogger(...args) {
  return require('vite').createLogger(...args);
};

exports.makeReactPlugin = function makeReactPlugin(options) {
  const react = require('@vitejs/plugin-react');
  const fn = react.default ?? react;
  return fn(options);
};
