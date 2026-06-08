import letter2numberTable from "./legacydata.json";

/**
 * One row of the legacy mapping table: a normalized letter SIDC and the
 * symbol-set / numeric code it maps to.
 */
export interface LegacyMappingEntry {
  letterCode: string;
  symbolSet: string;
  numericCode: string;
}

export type NumericMatch = "exact" | "partial";

export interface NumericLookupResult {
  entry: LegacyMappingEntry;
  match: NumericMatch;
}

/** The fields of a parsed number SIDC the numeric lookup needs. */
export interface NumericLookupKey {
  symbolSet: string;
  mainIcon: string;
  modifierOne: string;
  modifierTwo: string;
  entity: string;
  entityType: string;
}

// The raw JSON stores rows as `[letterCode, symbolSet, numericCode]` tuples
// sorted by `letterCode`. We map them to entries once here, so this `.map` is
// the only place that knows the stored tuple shape; everything below works
// against `LegacyMappingEntry` and preserves the sort order.
const entries: LegacyMappingEntry[] = letter2numberTable.map(
  ([letterCode, symbolSet, numericCode]) => ({
    letterCode,
    symbolSet,
    numericCode,
  }),
);

// Exact `(symbolSet, numericCode)` lookups, built once. Entries are iterated in
// their sorted-by-letterCode order and the first occurrence of each key wins,
// reproducing the previous `Array.find` semantics for ambiguous numeric codes.
const numericIndex = new Map<string, LegacyMappingEntry>();
for (const entry of entries) {
  const key = entry.symbolSet + entry.numericCode;
  if (!numericIndex.has(key)) numericIndex.set(key, entry);
}

function lookupNumeric(
  symbolSet: string,
  numericCode: string,
): LegacyMappingEntry | undefined {
  return numericIndex.get(symbolSet + numericCode);
}

/** Exact match by normalized letter code. */
export function findExact(
  normalizedLetterCode: string,
): LegacyMappingEntry | undefined {
  let lo = 0;
  let hi = entries.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const { letterCode } = entries[mid];
    if (letterCode === normalizedLetterCode) return entries[mid];
    if (letterCode < normalizedLetterCode) lo = mid + 1;
    else hi = mid - 1;
  }
  return undefined;
}

/**
 * Closest match by progressively shortening the function-id suffix of a
 * normalized letter code, returning the first prefix that exists.
 */
export function findClosest(
  normalizedLetterCode: string,
): LegacyMappingEntry | undefined {
  const prefix = normalizedLetterCode.slice(0, 4);
  let partialFunctionId = normalizedLetterCode.slice(4).split("-")[0];
  while (partialFunctionId.length >= 1) {
    const entry = entries.find((e) =>
      e.letterCode.startsWith(prefix + partialFunctionId),
    );
    if (entry) return entry;
    partialFunctionId = partialFunctionId.slice(0, -1);
  }
  return undefined;
}

/**
 * Best match for a parsed number SIDC. The numeric code is probed from most to
 * least specific — the full code (`exact`), then progressively broader codes
 * (`partial`): icon+modifier1, icon-only, entity+entityType, entity-only. The
 * first probe that exists wins, carrying its own match verdict.
 */
export function findByNumeric(
  key: NumericLookupKey,
): NumericLookupResult | undefined {
  const { symbolSet, mainIcon, modifierOne, modifierTwo, entity, entityType } =
    key;

  const probes: { code: string; match: NumericMatch }[] = [
    { code: mainIcon + modifierOne + modifierTwo, match: "exact" },
    { code: mainIcon + modifierOne + "00", match: "partial" },
    { code: mainIcon + "0000", match: "partial" },
    { code: entity + entityType + "000000", match: "partial" },
    { code: entity + "00000000", match: "partial" },
  ];
  for (const { code, match } of probes) {
    const entry = lookupNumeric(symbolSet, code);
    if (entry) return { entry, match };
  }
  return undefined;
}
