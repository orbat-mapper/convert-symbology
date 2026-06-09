# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A small TypeScript library (`@orbat-mapper/convert-symbology`) that converts military symbol
identification codes (SIDC) between the letter-based format (MIL-STD-2525C / APP-6C) and the
number-based format (MIL-STD-2525D / APP-6D).

## Commands

- `pnpm build` — type-check and build the library bundle with tsdown
- `pnpm test` — run tests with Vitest
- `pnpm exec vitest run test/convertLetter.test.ts -t "test name"` — run a single test/file
- `pnpm lint-fix` — format with Prettier

## Architecture

### Conversion flow

The two public entry points, `convertLetterSidc2NumberSidc` and `convertNumberSidc2LetterSidc`
(`lib/convert.ts`, exported from `lib/index.ts`), both return `{ sidc, success, match }` where
`match` is `"exact" | "partial" | "closest" | "failed"`.

Conversion relies on a large precomputed lookup table, `lib/legacydata.json` — an array of
`[letterCode, symbolSet, numericCode]` tuples sorted by `letterCode` for binary search
(`findSymbol`). The key is the 10-character letter SIDC with the standard-identity and status
characters normalized to `*` (`normalizeLetterCode` in `lib/helpers.ts`).

Fields that don't round-trip through the lookup table (standard identity, status, symbol/echelon
modifier) are converted via static maps in `lib/mappings.ts` (`SID_MAP`, `STATUS_MAP`,
`SYMBOL_MODIFIER_MAP`, and their `INVERTED_*` counterparts). `lib/helpers.ts` also has the SIDC
parsers (`parseLetterSidc`, `parseNumberSidc`) that split a code string into fields by position.

### Matching strategy

- **Letter → Number**: exact lookup; if missing, `findClosestSymbol` progressively shortens the
  function-id suffix to find the closest matching prefix (`match: "closest"`).
- **Number → Letter**: exact lookup by `(symbolSet, numericCode)`; if missing, falls back through
  progressively broader partial-code matches (icon+modifier1 → icon-only → entity+entityType →
  entity-only), each yielding `match: "partial"`.

### Regenerating the lookup table

`scripts/createLegacyMappingTable.js` regenerates `lib/legacydata.json` from CSV mapping data in
the sibling [joint-military-symbology-xml](https://github.com/Esri/joint-military-symbology-xml)
project (expected at `../../joint-military-symbology-xml/...`). It applies manual overrides
(`ADDITIONAL_SYMBOLS`, `OVERRIDE_SYMBOLS`) for symbols missing or wrong upstream. Edit those
override lists rather than hand-editing the generated JSON.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`orbat-mapper/convert-symbology`). See `docs/agents/issue-tracker.md`.

### Triage labels

Using default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo — one `CONTEXT.md` + `docs/adr/` at the root. See `docs/agents/domain.md`.
