# Convert symbology

Convert between letter based symbol identification codes (SIDC) and number based SIDCs (MILSTD 2525C ↔ 2525D / APP-6 C ↔
D ). The mappings from 2525C to 2525D are based on data from
the [Joint Military Symbology Markup Language (JMSML)](https://github.com/Esri/joint-military-symbology-xml)
project.

**Limitations**

Please note that it is not possible to convert every symbol identification code. Most symbols from 2525C/APP-6C are
available in 2525D/APP-6D. However, many symbol variants from 2525D/APP-6D does not exist in older versions.

Most of the available mappings are for symbols that are ment to be drawn. Some symbol codes exists only for hierarchical
purposes and the conversion process may fail for these symbol codes. In these cases, the conversion process will try to
pick the closest matching symbol code.

Feel free to [open an issue](https://github.com/orbat-mapper/convert-symbology/issues)
or [start a discussion](https://github.com/orbat-mapper/convert-symbology/discussions) if you find a symbol that is not
converted correctly.

## Installation

```bash
# or pnpm or yarn
npm install @orbat-mapper/convert-symbology
```

## Usage

```javascript
import { convertLetterSidc2NumberSidc } from "@orbat-mapper/convert-symbology";

const { sidc } = convertLetterSidc2NumberSidc("SFGPUCIC---E---");
console.log(sidc); // "10031000151211000002"
```

You can also convert from a number based SIDC to a letter based SIDC:

```javascript
import { convertNumberSidc2LetterSidc } from "@orbat-mapper/convert-symbology";

const { sidc } = convertNumberSidc2LetterSidc("10031000151211000002");
console.log(sidc); // "SFGPUCIC---E---"
```

The conversion functions return an object with the following properties:

- `sidc` - a string with the converted number or letter based SIDC. If the conversion failed, the `sidc` property will
  be an empty string.
- `match` - a string indicating the type of match found during the conversion process. Possible values
  are `exact`, `partial`, `closest` and `failed`
- `success` - a boolean flag indicating if the conversion was successful. If `true` the `match` property will be
  `exact`. If `false` the `match` property will be eiter `partial`, `closest` or `failed`.

Examples:

```javascript
import { convertLetterSidc2NumberSidc } from "@orbat-mapper/convert-symbology";

// convert TACGRP.MOBSU.OBST.AVN (a hierarchical symbol with no graphic representation)
const { sidc, match, success } =
  convertLetterSidc2NumberSidc("G-M-OH---------");
// Protection Points - Vertical Obstructions
console.log(sidc); // "10032500002820000000"
console.log(match); // "exact";
console.log(success); // true;

// convert TACGRP.MOBSU.OBST.AVN.TWR (a hierarchical symbol with no graphic representation)
const { sidc, match, success } =
  convertLetterSidc2NumberSidc("G-M-OHT--------");
// Does not exist in 2525D. Picking closest Protection Points - Vertical Obstructions - Tower High
console.log(sidc); // "10032500002820020000"
console.log(match); // "closest";
console.log(success); // false;
```

```javascript
import { convertNumberSidc2LetterSidc } from "@orbat-mapper/convert-symbology";

const { sidc, match, success } = convertNumberSidc2LetterSidc(
  "10031000151211000002"
);
console.log(sidc); // "SFGPUCIC---E---"
console.log(match); // "exact";
console.log(success); // true;

// Convert "Bicyle equipped infantry with dog".
const { sidc, match, success } = convertNumberSidc2LetterSidc(
  "10031000001211002004"
);
// This symbol does not exist in 2525C. Picking partial match Unit - Combat . Infantry
console.log(sidc); // "SFGPUCI--------"
console.log(match); // "partial";
console.log(success); // false;
```

## API

### `convertLetterSidc2NumberSidc()`

Type declarations

```typescript
function convertLetterSidc2NumberSidc(
  letterSidc: string,
  options?: Letter2NumberOptions
): Letter2NumberResult;

interface Letter2NumberOptions {}

interface Letter2NumberResult {
  sidc: string;
  success: boolean;
  match: MatchType;
}

type MatchType = "exact" | "partial" | "closest" | "failed";
```

### `convertNumberSidc2LetterSidc()`

Type declarations

```typescript
function convertNumberSidc2LetterSidc(
  numberSidc: string,
  options?: Number2LetterOptions
): Number2LetterResult;

interface Number2LetterOptions {}

interface Number2LetterResult {
  sidc: string;
  success: boolean;
  match: MatchType;
}

type MatchType = "exact" | "partial" | "closest" | "failed";
```

## Credits

The mappings from 2525C to 2525D are based on data from
the [Joint Military Symbology Markup Language (JMSML)](https://github.com/Esri/joint-military-symbology-xml)
project. Thank you ESRI for making this data available!
