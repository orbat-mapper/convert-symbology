# Convert symbology

Convert between letter based symbol identification codes (SIDC) and number based SIDCs (MILSTD 2525C ↔ 2525D).

The mappings from 2525C to 2525D are based on data from
the [Joint Military Symbology Markup Language (JMSML)](https://github.com/Esri/joint-military-symbology-xml)
project.

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

## Limitations

Most symbols from 2525C/APP-6C are available in 2525D/APP-6D. However, many symbol variants from 2525D/APP-6D does not
exist in older versions.

