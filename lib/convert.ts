import {
  INVERTED_SID_MAP,
  INVERTED_STATUS_MAP,
  INVERTED_SYMBOL_MODIFIER_MAP,
  SID_MAP,
  STATUS_MAP,
  SYMBOL_MODIFIER_MAP,
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
      return letter2numberTable[target];
    }
  }
}

function findClosestSymbol(digits: string): string[] | undefined {
  const rest = digits.slice(0, 4);
  const functionId = digits.slice(4);
  let prefix = functionId.split("-")[0];
  while (prefix.length >= 1) {
    const match = letter2numberTable.find((a) =>
      a[0].startsWith(rest + prefix)
    );
    if (match) return match;
    prefix = prefix.slice(0, -1);
  }
  return undefined;
}

export function convertLetterSidc2NumberSidc(
  letterSidc: string,
  options: Letter2NumberOptions = {}
): Letter2NumberResult {
  const { standardIdentity, status } = parseLetterSidc(
    letterSidc.replaceAll("*", "-")
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
  options: Letter2NumberOptions = {}
): string {
  const { sidc } = convertLetterSidc2NumberSidc(letterSidc, options);
  return sidc;
}

export function convertNumberSidc2LetterSidc(
  numberSidc: string,
  options: Number2LetterOptions = {}
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

  const hit = letter2numberTable.find(
    ([letterCode, symbolSet, numericCode]) => {
      return symbolSet === parts.symbolSet && numericCode === nCode;
    }
  );
  let sic = "";
  let match: MatchType = "failed";

  if (hit) {
    sic = hit[0];
    match = "exact";
  } else {
    const partialCode = parts.mainIcon + parts.modifierOne + "00";
    const secondHit = letter2numberTable.find(
      ([letterCode, symbolSet, numericCode]) => {
        return symbolSet === parts.symbolSet && numericCode === partialCode;
      }
    );
    if (secondHit) {
      sic = secondHit[0];
      match = "partial";
    } else {
      const partialCode = parts.mainIcon + "0000";
      const thirdHit = letter2numberTable.find(
        ([letterCode, symbolSet, numericCode]) => {
          return symbolSet === parts.symbolSet && numericCode === partialCode;
        }
      );
      if (thirdHit) {
        sic = thirdHit[0];
        match = "partial";
      } else {
        const partialCode = parts.entity + parts.entityType + "000000";
        const fourthHit = letter2numberTable.find(
          ([letterCode, symbolSet, numericCode]) => {
            return symbolSet === parts.symbolSet && numericCode === partialCode;
          }
        );
        if (fourthHit) {
          sic = fourthHit[0];
          match = "partial";
        } else {
          const partialCode = parts.entity + "00000000";
          const fifthHit = letter2numberTable.find(
            ([letterCode, symbolSet, numericCode]) => {
              return (
                symbolSet === parts.symbolSet && numericCode === partialCode
              );
            }
          );
          if (fifthHit) {
            sic = fifthHit[0];
            match = "partial";
          }
        }
      }
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
