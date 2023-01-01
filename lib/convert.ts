import { SID_MAP, STATUS_MAP, SYMBOL_MODIFIER_MAP } from "./mappings";

import letter2number from "./legacydata.json";

export function replaceCharAt(
  text: string,
  index: number,
  replacementChar: string
) {
  return text.substring(0, index) + replacementChar + text.substring(index + 1);
}

function normalizeLetterCode(sidc: string) {
  return replaceCharAt(replaceCharAt(sidc, 3, "*"), 1, "*");
}

function findSymbol(digits: string): string[] | undefined {
  let beginning = 0,
    end = letter2number.length,
    target;
  if (!end) {
    return;
  }
  while (true) {
    target = (beginning + end) >> 1;
    if (
      (target === end || target === beginning) &&
      letter2number[target][0] !== digits
    ) {
      return;
    }
    if (letter2number[target][0] > digits) {
      end = target;
    } else if (letter2number[target][0] < digits) {
      beginning = target;
    } else {
      return letter2number[target];
    }
  }
}

export interface Letter2NumberOptions {
  fallbackSidc?: string;
}

export interface Letter2NumberResult {
  sidc: string;
  success: boolean;
}

export function convertLetterSidc2NumberSidc(
  letterSidc: string,
  options: Letter2NumberOptions = {}
): Letter2NumberResult {
  const standardIdentity = letterSidc[1];
  const status = letterSidc[3];
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
