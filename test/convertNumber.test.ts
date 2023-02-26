import { describe, expect, it } from "vitest";
import { convertNumberSidc2LetterSidc } from "../lib/convert";

describe("Convert from number to letters", function () {
  it("conversion function is exported", () => {
    expect(convertNumberSidc2LetterSidc).toBeDefined();
  });

  it("frigate", () => {
    const { sidc, success } = convertNumberSidc2LetterSidc(
      "10033000001202040000"
    );
    expect(sidc).toBe("SFSPCLFF--------");
    expect(success).toBe(true);
  });

  it("arctic infantry squad", () => {
    expect(convertNumberSidc2LetterSidc("10031000111211000002").sidc).toBe(
      "SFGPUCIC---A---"
    );
  });

  it("arctic infantry company", () => {
    expect(convertNumberSidc2LetterSidc("10031000151211000002").sidc).toBe(
      "SFGPUCIC---E---"
    );
  });
});
