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

export interface Letter2NumberOptions {
  fallbackSidc?: string;
}

export interface Number2LetterOptions {}

export interface Letter2NumberResult {
  sidc: string;
  success: boolean;
}

export interface Number2LetterResult {
  sidc: string;
  success: boolean;
}

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

export function convertLetterSidc2NumberSidc(
  letterSidc: string,
  options: Letter2NumberOptions = {}
): Letter2NumberResult {
  const { standardIdentity, status } = parseLetterSidc(letterSidc);
  const symbolModifier = letterSidc.substring(10, 12).replace("*", "-");

  const normalizedSidc = normalizeLetterCode(letterSidc).slice(0, 10);
  const hit = findSymbol(normalizedSidc);
  let sidc = "";
  let success = false;
  if (hit) {
    sidc = [
      "10",
      SID_MAP[standardIdentity],
      hit[1],
      STATUS_MAP[status],
      SYMBOL_MODIFIER_MAP[symbolModifier] || "000",
      hit[2],
    ].join("");
    success = true;
  }
  return { sidc, success };
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
): Letter2NumberResult {
  const parts = parseNumberSidc(numberSidc);
  const status = INVERTED_STATUS_MAP[parts.status];
  const standardIdentity =
    INVERTED_SID_MAP[parts.context + parts.standardIdentity];

  const symbolModifier =
    parts.hqemt === "000" ? "---" : INVERTED_SYMBOL_MODIFIER_MAP[parts.hqemt];
  const nCode = parts.mainIcon + parts.modifierOne + parts.modifierTwo;

  const match = letter2numberTable.find(
    ([letterCode, symbolSet, numericCode]) => {
      return symbolSet === parts.symbolSet && numericCode === nCode;
    }
  );
  let sic = "";

  if (match) {
    sic = match[0];
  }

  return {
    sidc:
      replaceCharAt(replaceCharAt(sic, 1, standardIdentity), 3, status) +
      symbolModifier +
      "---",
    success: Boolean(match),
  };
}
