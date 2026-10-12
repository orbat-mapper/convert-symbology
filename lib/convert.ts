import {
  INVERTED_SID_MAP,
  INVERTED_STATUS_MAP,
  INVERTED_SYMBOL_MODIFIER_MAP,
  SID_MAP,
  STATUS_MAP,
  SYMBOL_MODIFIER_MAP,
  SYMBOL_SET_FRAME_FALLBACK,
} from "./mappings";

import letter2numberTable from "./legacydata.json";
import {
  normalizeLetterCode,
  parseLetterSidc,
  parseNumberSidc,
  replaceCharAt,
} from "./helpers";
import type {
  Letter2NumberOptions,
  Letter2NumberResult,
  MatchType,
  Number2LetterOptions,
  Number2LetterResult,
} from "./types";

const NO_ICON = "0000000000";

// search for the symbol in the array using binary search
function findSymbol(digits: string): string[] | undefined {
  let beginning = 0,
    end = letter2numberTable.length,
    target;
  if (!end) {
    return;
  }
  while (true) {
    target = (beginning + end) >> 1;
    if (
      (target === end || target === beginning) &&
      letter2numberTable[target][0] !== digits
    ) {
      return;
    }
    if (letter2numberTable[target][0] > digits) {
      end = target;
    } else if (letter2numberTable[target][0] < digits) {
      beginning = target;
    } else {
      // several rows can share a letter code: return the first one
      while (target > 0 && letter2numberTable[target - 1][0] === digits) {
        target--;
      }
      return letter2numberTable[target];
    }
  }
}

function findClosestSymbol(digits: string): string[] | undefined {
  const prefix = digits.slice(0, 4);
  const functionId = digits.slice(4);
  let partialFunctionId = functionId.split("-")[0];
  while (partialFunctionId.length >= 1) {
    const match = letter2numberTable.find(([letters]) =>
      letters.startsWith(prefix + partialFunctionId),
    );
    if (match) return match;
    partialFunctionId = partialFunctionId.slice(0, -1);
  }

  // nothing left of the function ID: fall back to the bare frame, if any
  return findSymbol(prefix + "------");
}

function findLetterCode(
  symbolSet: string,
  numericCode: string,
): string | undefined {
  return letter2numberTable.find(
    ([, ss, code]) => ss === symbolSet && code === numericCode,
  )?.[0];
}

export function convertLetterSidc2NumberSidc(
  letterSidc: string,
  options: Letter2NumberOptions = {},
): Letter2NumberResult {
  const { standardIdentity, status } = parseLetterSidc(
    letterSidc.replaceAll("*", "-"),
  );
  const symbolModifier = letterSidc.substring(10, 12).replaceAll("*", "-");

  const normalizedSidc = normalizeLetterCode(letterSidc).slice(0, 10);
  let sidc = "";
  let success = false;
  let match: MatchType = "failed";
  let hit = findSymbol(normalizedSidc);
  if (hit) {
    match = "exact";
    success = true;
  } else {
    hit = findClosestSymbol(normalizedSidc);
    if (hit) {
      match = "closest";
    }
  }

  if (hit) {
    sidc = [
      "10",
      SID_MAP[standardIdentity === "-" ? "F" : standardIdentity],
      hit[1],
      STATUS_MAP[status === "-" ? "P" : status],
      SYMBOL_MODIFIER_MAP[symbolModifier] || "000",
      hit[2],
    ].join("");
  }
  return { sidc, success, match };
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
  const nCode = parts.mainIcon + parts.modifierOne + parts.modifierTwo;

  // from the most to the least specific numeric code; anything but the
  // first one is a partial match
  const candidateCodes = [
    nCode,
    parts.mainIcon + parts.modifierOne + "00",
    parts.mainIcon + "0000",
    parts.entity + parts.entityType + "000000",
    parts.entity + "00000000",
    NO_ICON,
  ];

  let sic = "";
  let match: MatchType = "failed";
  for (const [index, code] of candidateCodes.entries()) {
    const hit = findLetterCode(parts.symbolSet, code);
    if (hit) {
      sic = hit;
      match = index === 0 ? "exact" : "partial";
      break;
    }
  }

  const fallbackSymbolSet = SYMBOL_SET_FRAME_FALLBACK[parts.symbolSet];
  if (match === "failed" && fallbackSymbolSet) {
    const hit = findLetterCode(fallbackSymbolSet, NO_ICON);
    if (hit) {
      sic = hit;
      match = "partial";
    }
  }

  return {
    sidc:
      replaceCharAt(replaceCharAt(sic, 1, standardIdentity), 3, status) +
      symbolModifier +
      "---",
    success: match === "exact",
    match,
  };
}
