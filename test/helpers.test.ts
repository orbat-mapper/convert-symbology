import { describe, expect, it } from "vitest";
import {
  formatLetterSidc,
  formatNumberSidc,
  parseLetterSidc,
  parseNumberSidc,
} from "../lib/helpers";

describe("Parse letter SIDC", function () {
  const testSidc = "ABCDEFGHIJKLMNO";
  it("parses sidc", () => {
    const s = parseLetterSidc(testSidc);
    expect(s.codingScheme).toBe("A");
    expect(s.standardIdentity).toBe("B");
    expect(s.battleDimension).toBe("C");
    expect(s.status).toBe("D");
    expect(s.functionId).toBe("EFGHIJ");
    expect(s.symbolModifier).toBe("KL");
  });
});

describe("Parse numeric SIDC", function () {
  const testSidc = "11223344556677889900";

  it("parses sidc", () => {
    const s = parseNumberSidc(testSidc);
    expect(s.version).toBe("11");
    expect(s.context).toBe("2");
    expect(s.standardIdentity).toBe("2");
    expect(s.symbolSet).toBe("33");
    expect(s.status).toBe("4");
    expect(s.hqtfd).toBe("4");
    expect(s.amplifier).toBe("5");
    expect(s.amplifierDescriptor).toBe("5");
    expect(s.entity).toBe("66");
    expect(s.entityType).toBe("77");
    expect(s.entitySubType).toBe("88");
    expect(s.modifierOne).toBe("99");
    expect(s.modifierTwo).toBe("00");
  });

  it("gets main icon", () => {
    const s = parseNumberSidc(testSidc);
    expect(s.mainIcon).toBe("667788");
  });
});

describe("Format number SIDC", function () {
  it("inverts parseNumberSidc", () => {
    const sidc = "10033000001202040000";
    const p = parseNumberSidc(sidc);
    expect(
      formatNumberSidc({
        version: p.version,
        standardIdentity: p.context + p.standardIdentity,
        symbolSet: p.symbolSet,
        status: p.status,
        amplifier: p.hqemt,
        numericCode: p.mainIcon + p.modifierOne + p.modifierTwo,
      }),
    ).toBe(sidc);
  });

  it("defaults the version to 10", () => {
    const sidc = formatNumberSidc({
      standardIdentity: "03",
      symbolSet: "30",
      status: "0",
      amplifier: "000",
      numericCode: "1202040000",
    });
    expect(sidc).toBe("10033000001202040000");
    expect(sidc.length).toBe(20);
  });
});

describe("Format letter SIDC", function () {
  it("places fields by position", () => {
    const sidc = formatLetterSidc({
      letterCode: "S*S*CLFF--",
      standardIdentity: "F",
      status: "P",
      symbolModifier: "--",
    });
    expect(sidc).toBe("SFSPCLFF-------");
    expect(sidc.length).toBe(15);
  });
});
