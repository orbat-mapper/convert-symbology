# Convert symbology

Convert from letter based symbol identification codes to number based symbol identification codes (MILSTD 2525C to 2525D).

The mappings from 2525C to 2525D are based on data from the [Joint Military Symbology Markup Language (JMSML)](https://github.com/Esri/joint-military-symbology-xml)
project.

## Installation

```bash
# or pnpm or yarn
npm install @orbat-mapper/convert-symbology
```

## Usage

```javascript
import { convertLetterCode2NumberCode } from "@orbat-mapper/convert-symbology";

const numberCode = convertLetterCode2NumberCode("SFGPUCIC---E---");
console.log(numberCode); // "10031000151211000002"
```

## Limitations

Currently you can only convert from letter based codes to number based codes.
