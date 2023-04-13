import { describe, expect, it } from "vitest";
import { convertNumberSidc2LetterSidc } from "../lib/convert";

describe("Convert from number to letters", function () {
  it("conversion function is exported", () => {
    expect(convertNumberSidc2LetterSidc).toBeDefined();
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

  it("returns match=exact if exact", () => {
    const { success, match, sidc } = convertNumberSidc2LetterSidc(
      "10031000111211000002"
    );
    expect(success).toBe(true);
    expect(match).toBe("exact");
    expect(sidc.length).toBe(15);
  });

  it("returns match=failed if complete failure", () => {
    const { success, match } = convertNumberSidc2LetterSidc(
      "10032700001101010500"
    );
    expect(success).toBe(false);
    expect(match).toBe("failed");
  });

  it("returns match=partial if partial", () => {
    const { sidc, success, match } = convertNumberSidc2LetterSidc(
      "10031000001211002004"
    );
    expect(sidc).toBe("SFGPUCI--------");
    expect(sidc.length).toBe(15);
    expect(success).toBe(false);
    expect(match).toBe("partial");
  });

  describe("Surface units", () => {
    it("frigate", () => {
      const { sidc, success } = convertNumberSidc2LetterSidc(
        "10033000001202040000"
      );
      expect(sidc.length).toBe(15);
      expect(sidc).toBe("SFSPCLFF-------");
      expect(success).toBe(true);
    });

    it("unknown sid should be U", () => {
      const { sidc, success } = convertNumberSidc2LetterSidc(
        "10073000001202040000"
      );
      expect(sidc.length).toBe(15);
      expect(sidc).toBe("SUSPCLFF-------");
      expect(success).toBe(true);
    });

    it("patrol boat general with helicopter", () => {
      const { sidc, match } = convertNumberSidc2LetterSidc(
        "10033000001205001900"
      );
      expect(sidc).toBe("SFSPCP---------");
      expect(sidc.length).toBe(15);
      expect(match).toBe("partial");
    });

    it("Amphibious Command Ship", () => {
      const { sidc, match } = convertNumberSidc2LetterSidc(
        "10033000001203010000"
      );
      expect(sidc).toBe("SFSPCA---------");
      expect(sidc.length).toBe(15);
      expect(match).toBe("partial");
    });

    it("Aux Ship Oiler", () => {
      const { sidc, match } = convertNumberSidc2LetterSidc(
        "10033000001301100000"
      );
      expect(sidc).toBe("SFSPNR---------");
      expect(sidc.length).toBe(15);
      expect(match).toBe("partial");
    });
  });

  describe("tactical graphics", () => {
    it("TACGRP.TSK.FLWASS", () => {
      const { sidc, match } = convertNumberSidc2LetterSidc(
        "10032500003412000000"
      );
      expect(sidc).toBe("GFTPA----------");
      expect(match).toBe("exact");
    });

    it("TACGRP.TSK.WDR", () => {
      const { sidc, match } = convertNumberSidc2LetterSidc(
        "10032500003424000000"
      );
      expect(sidc).toBe("GFTPW----------");
      expect(match).toBe("exact");
    });
  });
});
