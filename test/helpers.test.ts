import { describe, expect, it } from "vitest";
import { parseLetterSidc, parseNumberSidc } from "../lib/helpers";

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
