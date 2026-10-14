# Changelog

## 2.0.0

### Major Changes

- [#17](https://github.com/orbat-mapper/convert-symbology/pull/17) [`ed0bc5e`](https://github.com/orbat-mapper/convert-symbology/commit/ed0bc5e3c46c8065273ee9fd8d3d4d265db70b6b) Thanks [@kjellmf](https://github.com/kjellmf)! - The package is now ESM-only.

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

### Minor Changes

- [#21](https://github.com/orbat-mapper/convert-symbology/pull/21) [`0976f7e`](https://github.com/orbat-mapper/convert-symbology/commit/0976f7eb93db3f57c1907817f366e97eaca3a5c6) Thanks [@lhapaipai](https://github.com/lhapaipai)! - Convert symbols drawn as a bare frame, without an icon, in both directions
  (e.g. `SFGP------AH---` <-> `10031002180000000000`). When no icon matches,
  conversion now falls back to the frame instead of failing: `closest` for
  letter -> number, `partial` for number -> letter.

### Patch Changes

- [#21](https://github.com/orbat-mapper/convert-symbology/pull/21) [`5e09d95`](https://github.com/orbat-mapper/convert-symbology/commit/5e09d95272f165d3b106827ddfbea92c6fffb1f6) Thanks [@lhapaipai](https://github.com/lhapaipai)! - Map crewed space vehicle `S*P*V-----` to `05/1101000000` (Space Vehicle) in both
  directions. It is listed upstream without a 2525D code and used to fail.

- [#21](https://github.com/orbat-mapper/convert-symbology/pull/21) [`3ca16c0`](https://github.com/orbat-mapper/convert-symbology/commit/3ca16c085922dc0ac826754b879a490b378994ec) Thanks [@lhapaipai](https://github.com/lhapaipai)! - Letter codes that map to several numeric codes now always convert to the first
  one in the lookup table. The result used to depend on where the binary search
  landed, and could change whenever rows were added to the table. Affected codes:
  `S*A*W-----` (now 01 Weapon instead of 02 Missile), `W*-*HHDK--`, `W*-*HPBA--`.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.2] - 2024-07-31

### Fixed

- Add a few missing legacy size/mobility mappings (reported by [@carlocorradin](https://github.com/carlocorradini)
  in [#12](https://github.com/orbat-mapper/convert-symbology/issues/12)
  and [#11](https://github.com/orbat-mapper/convert-symbology/issues/11)

## [1.0.1] - 2024-07-31

### Fixed

- Use correct code for MV (Pack Animals) (by [@carlocorradini](https://github.com/carlocorradini)
  in [#9](https://github.com/orbat-mapper/convert-symbology/issues/9))

## [1.0.0] - 2023-04-15

### Added

- Improved documentation.

### Fixed

- A standard identity value of '-' or '\*' is interpreted as 'F'.
- A status value of '-' or '\*' is interpreted as 'P'.

### Changed

- Added `closest` value to the `match` property of the return object from `convertLetterSidc2NumberSidc`. This value
  indicates that the conversion was not exact, but that the closest match was used.

## [0.3.0] - 2023-03-19

### Changed

- added `match` to the return object from `convertLetterSidc2NumberSidc`. Possible values are currently `exact`
  and `failed`.

### Fixed

- handle unknown numeric SID and HQMT values.

## [0.2.5] - 2023-03-19

### Fixed

- improve partial matching of symbols when converting from number SIDCs to letter SIDCs.

### Fixed

## [0.2.3] - 2023-03-04

### Fixed

- Convert SOF unit ground ranger correctly

## [0.2.2] - 2023-03-04

### Fixed

- Handle unspecified operational condition ( "-" is interpreted as P/Present ).

## [0.2.1] - 2023-02-27

### Fixed

- Added missing `convertNumberSidc2LetterSidc` export.

## [0.2.0] - 2023-02-26

### Added

- Added `convertNumberSidc2LetterSidc` function for converting from number based SIDCs to letter based SIDCs.
- Added CHANGELOG.md

### Changed

- Added new main conversion interface `convertLetterSidc2NumberSidc` function.

### Fixed

- Fix several symbol modifier mapping errors

## [0.1.3] - 2022-11-27

### Fixed

- Add manual override for unit / combat / field artillery / rocket.

## [0.1.2] - 2022-11-15

### Fixed

- Handle symbol modifiers containing '\*'s instead of '-'s.

## [0.1.0] - 2022-11-06

- First public release.
