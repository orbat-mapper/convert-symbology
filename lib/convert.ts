import {
  INVERTED_SID_MAP,
  INVERTED_STATUS_MAP,
  INVERTED_SYMBOL_MODIFIER_MAP,
  SID_MAP,
  STATUS_MAP,
  SYMBOL_MODIFIER_MAP,
} from "./mappings";

import {
  formatLetterSidc,
  formatNumberSidc,
  normalizeLetterCode,
  parseLetterSidc,
  parseNumberSidc,
} from "./helpers";
import { findByNumeric, findClosest, findExact } from "./lookupTable";
import type {
  Letter2NumberOptions,
  Letter2NumberResult,
  MatchType,
  Number2LetterOptions,
  Number2LetterResult,
} from "./types";

export function convertLetterSidc2NumberSidc(
  letterSidc: string,
  options: Letter2NumberOptions = {},
): Letter2NumberResult {
  const { standardIdentity, status, symbolModifier } = parseLetterSidc(
    letterSidc.replaceAll("*", "-"),
  );

  const normalizedSidc = normalizeLetterCode(letterSidc).slice(0, 10);
  let sidc = "";
  let match: MatchType = "failed";
  let hit = findExact(normalizedSidc);
  if (hit) {
    match = "exact";
  } else {
    hit = findClosest(normalizedSidc);
    if (hit) {
      match = "closest";
    }
  }

  if (hit) {
    sidc = formatNumberSidc({
      standardIdentity:
        SID_MAP[standardIdentity === "-" ? "F" : standardIdentity],
      symbolSet: hit.symbolSet,
      status: STATUS_MAP[status === "-" ? "P" : status],
      amplifier: SYMBOL_MODIFIER_MAP[symbolModifier] || "000",
      numericCode: hit.numericCode,
    });
  }
  return { sidc, success: match === "exact", match };
}

export function convertLetterCode2NumberCode(
  letterSidc: string,
  options: Letter2NumberOptions = {},
): string {
  const { sidc } = convertLetterSidc2NumberSidc(letterSidc, options);
  return sidc;
}

export function convertNumberSidc2LetterSidc(
  numberSidc: string,
  options: Number2LetterOptions = {},
): Number2LetterResult {
  const parts = parseNumberSidc(numberSidc);
  const status = INVERTED_STATUS_MAP[parts.status];
  const standardIdentity =
    INVERTED_SID_MAP[parts.context + parts.standardIdentity] || "U";

  const symbolModifier =
    parts.hqemt === "000"
      ? "--"
      : INVERTED_SYMBOL_MODIFIER_MAP[parts.hqemt] || "--";
  const found = findByNumeric(parts);
  const sic = found ? found.entry.letterCode : "";
  const match: MatchType = found ? found.match : "failed";

  return {
    sidc: formatLetterSidc({
      letterCode: sic,
      standardIdentity,
      status,
      symbolModifier,
    }),
    success: match === "exact",
    match,
  };
}
