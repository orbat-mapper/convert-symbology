# convert-symbology

Domain language for the library that converts military symbol identification
codes (SIDC) between the letter-based format (MIL-STD-2525C / APP-6C) and the
number-based format (MIL-STD-2525D / APP-6D).

## Language

**Letter SIDC**:
A 15-character letter-based symbol identification code (MIL-STD-2525C / APP-6C).
_Avoid_: charlie code, old code.

**Number SIDC**:
A 20-character digit-based symbol identification code (MIL-STD-2525D / APP-6D).
_Avoid_: delta code, new code.

**Legacy mapping table**:
The precomputed table that maps a normalized letter code to its symbol set and
numeric code. Owned by `lib/lookupTable.ts`, which is the only module that knows
the stored tuple shape and sort order; callers see `findExact`, `findClosest`,
and `findByNumeric` over `LegacyMappingEntry` records.
_Avoid_: lookup array, legacydata, the JSON.

**Normalized letter code**:
The first 10 characters of a letter SIDC with the standard-identity and status
characters replaced by `*`, used as the key into the legacy mapping table.

**Match**:
How close a conversion got: `exact`, `partial`, `closest`, or `failed`.
_Avoid_: result quality, confidence.

## Example dialogue

> **Dev:** When a number SIDC has no exact row, what comes back?
> **Expert:** `findByNumeric` walks the legacy mapping table from the full
> numeric code down to entity-only. The full code is an `exact` match; every
> broader fallback is a `partial` match. Nothing at all is `failed`.
> **Dev:** And going the other way, from a letter SIDC?
> **Expert:** Normalize it first, then `findExact` on the normalized letter
> code. Miss, and `findClosest` shortens the function-id suffix until a prefix
> exists — that's a `closest` match.
