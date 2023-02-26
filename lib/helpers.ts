export function replaceCharAt(
  text: string,
  index: number,
  replacementChar: string
) {
  return text.substring(0, index) + replacementChar + text.substring(index + 1);
}

export function normalizeLetterCode(sidc: string) {
  return replaceCharAt(replaceCharAt(sidc, 3, "*"), 1, "*");
}

export function invertMap(
  objMap: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(Object.entries(objMap).map((a) => a.reverse()));
}

export function parseLetterSidc(letterSidc: string) {
  const codingScheme = letterSidc[0];
  const standardIdentity = letterSidc[1];
  const battleDimension = letterSidc[2];
  const status = letterSidc[3];
  const functionId = letterSidc.substring(4, 10);
  const symbolModifier = letterSidc.substring(10, 12);

  return {
    codingScheme,
    standardIdentity,
    battleDimension,
    status,
    functionId,
    symbolModifier,
  };
}

export function parseNumberSidc(sic: string) {
  const version = sic.substring(0, 2);
  const context = sic.substring(2, 3);
  const standardIdentity = sic.substring(3, 4);
  const symbolSet = sic.substring(4, 6);
  const status = sic.substring(6, 7);
  const hqtfd = sic.substring(7, 8);
  const amplifier = sic.substring(8, 9);
  const amplifierDescriptor = sic.substring(9, 10);
  const entity = sic.substring(10, 12);
  const entityType = sic.substring(12, 14);
  const entitySubType = sic.substring(14, 16);
  const modifierOne = sic.substring(16, 18);
  const modifierTwo = sic.substring(18, 20);

  const hqemt = hqtfd + amplifier + amplifierDescriptor;
  const mainIcon = entity + entityType + entitySubType;
  return {
    version,
    context,
    standardIdentity,
    symbolSet,
    status,
    hqtfd,
    amplifier,
    amplifierDescriptor,
    entity,
    entityType,
    entitySubType,
    modifierOne,
    modifierTwo,
    hqemt,
    mainIcon,
  };
}
