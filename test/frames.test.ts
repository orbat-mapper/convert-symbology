import { describe, expect, it } from "vitest";
import {
  convertLetterSidc2NumberSidc,
  convertNumberSidc2LetterSidc,
} from "../lib";

describe("Frames without an icon", () => {
  it.each([
    ["SFZP-----------", "10030000000000000000"],
    ["SFAP-----------", "10030100000000000000"],
    ["SFPP-----------", "10030500000000000000"],
    ["SFGP-----------", "10031000000000000000"],
    ["SFGPE----------", "10031500000000000000"],
    ["SFGPI----------", "10032000000000000000"],
    ["SFSP-----------", "10033000000000000000"],
    ["SFUP-----------", "10033500000000000000"],
    ["IFPP-----------", "10035000000000000000"],
    ["IFAP-----------", "10035100000000000000"],
    ["IFGP-----------", "10035200000000000000"],
    ["IFSP-----------", "10035300000000000000"],
    ["IFUP-----------", "10035400000000000000"],
  ])("%s <-> %s", (letterSidc, numberSidc) => {
    expect(convertLetterSidc2NumberSidc(letterSidc)).toEqual({
      sidc: numberSidc,
      success: true,
      match: "exact",
    });
    expect(convertNumberSidc2LetterSidc(numberSidc)).toEqual({
      sidc: letterSidc,
      success: true,
      match: "exact",
    });
  });

  it("keeps the symbol modifier", () => {
    // land unit frame, HQ brigade
    expect(convertLetterSidc2NumberSidc("SFGP------AH---").sidc).toBe(
      "10031002180000000000",
    );
    expect(convertNumberSidc2LetterSidc("10031002180000000000").sidc).toBe(
      "SFGP------AH---",
    );
  });

  it("falls back to the frame when no function ID prefix matches", () => {
    const { sidc, match } = convertLetterSidc2NumberSidc("SFGPZ----------");
    expect(sidc).toBe("10031000000000000000");
    expect(match).toBe("closest");
  });

  it("falls back to the frame when no icon matches", () => {
    // Military (Space) : Reconnaissance Satellite has no 2525C equivalent
    const { sidc, match } = convertNumberSidc2LetterSidc(
      "10030500001115000000",
    );
    expect(sidc).toBe("SFPP-----------");
    expect(match).toBe("partial");
  });

  it.each([
    ["10030200001200000000", "SFAP-----------"],
    ["10030600001100000000", "SFPP-----------"],
    ["10031100001199000000", "SFGP-----------"],
    ["10033600000000000000", "SFUP-----------"],
  ])(
    "%s falls back to the frame of a related symbol set",
    (numberSidc, letterSidc) => {
      const { sidc, match } = convertNumberSidc2LetterSidc(numberSidc);
      expect(sidc).toBe(letterSidc);
      expect(match).toBe("partial");
    },
  );
});
