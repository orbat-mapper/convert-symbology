---
"@orbat-mapper/convert-symbology": major
---

The package is now ESM-only.

**What changed:** The build tooling was switched to tsdown (and the repo to pnpm),
and the package no longer ships a CommonJS build. Only the ESM entry point
(`dist/convert-symbology.mjs`) and its types (`dist/convert-symbology.d.mts`) are
published.

**Why:** The library is `"type": "module"` and the toolchain was modernized; maintaining
a dual CJS/ESM build added complexity for no real benefit to consumers.

**How to update:** Consume the package from an ESM context — use `import` rather than
`require()`. If you're on CommonJS, switch to ESM or load it via a dynamic
`await import("@orbat-mapper/convert-symbology")`. Bundlers and modern Node (with
`"type": "module"` or `.mjs`) work without changes.
