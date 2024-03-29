# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
