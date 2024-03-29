import { expect, describe, it } from "vitest";

import {
  convertLetterCode2NumberCode,
  convertLetterSidc2NumberSidc,
} from "../lib";
import { SID_MAP, STATUS_MAP } from "../lib/mappings";
import { replaceCharAt } from "../lib/helpers";

describe("Convert from letters to number", function () {
  it("is exported", () => {
    expect(convertLetterCode2NumberCode).toBeDefined();
  });

  it("invalid SIDC should return empty string", () => {
    expect(convertLetterCode2NumberCode("ILLEGALVALUE")).toBe("");
  });

  describe("surface units", () => {
    it("frigate", () => {
      expect(convertLetterCode2NumberCode("SFSPCLFF----")).toBe(
        "10033000001202040000"
      );
    });

    it("littoral combatant towed array (short", () => {
      expect(convertLetterCode2NumberCode("SFSPCLLL--NS")).toBe(
        "10033000611202060000"
      );
    });
  });

  describe("installations", () => {
    it("dam", () => {
      expect(convertLetterCode2NumberCode("EFFPMB----H****")).toBe(
        "10032000001214020000"
      );
    });
  });

  describe("tactical graphics", () => {
    it("TACGRP.TSK.FLWASS", () => {
      expect(convertLetterCode2NumberCode("GFTPA-----****X")).toBe(
        "10032500003412000000"
      );
    });
    it("TACGRP.TSK.WDR", () => {
      expect(convertLetterCode2NumberCode("GFTPW-----****X")).toBe(
        "10032500003424000000"
      );
    });

    it("TACGRP.MOBSU.OBST.WREOBS.USP", () => {
      expect(convertLetterCode2NumberCode("G-M-OWU-------X")).toBe(
        "10032500002903010000"
      );
    });

    it("TACGRP.MOBSU.OBST.WREOBS", () => {
      const { sidc, match } = convertLetterSidc2NumberSidc("G-M-OW--------X");
      expect(match).toBe("exact");
      expect(sidc).toBe("10032500002903000000");
    });

    it("TACGRP.MOBSU.OBSTBP", () => {
      const { sidc, match } = convertLetterSidc2NumberSidc("G-M-B----------");
      expect(match).toBe("exact");
      expect(sidc).toBe("10032500002706000000");
    });

    it("TACGRP.MOBSU.OBST.AVN", () => {
      const { sidc, match } = convertLetterSidc2NumberSidc("G-M-OH---------");
      expect(sidc).toBe("10032500002820000000");
      expect(match).toBe("exact");
    });

    it("TACGRP.MOBSU.OBST.AVN.TWR", () => {
      const { sidc, match } = convertLetterSidc2NumberSidc("G-M-OHT--------");
      expect(match).toBe("closest");
      expect(["10032500002820010000", "10032500002820020000"]).toContain(sidc);
    });
  });

  it("infantry", () => {
    expect(convertLetterCode2NumberCode("SFGPUCI-----")).toBe(
      "10031000001211000000"
    );
  });

  it("arctic infantry company", () => {
    expect(convertLetterCode2NumberCode("SFGPUCIC---E---")).toBe(
      "10031000151211000002"
    );
  });

  it("arctic infantry squad", () => {
    expect(convertLetterCode2NumberCode("SFGPUCIC---A-")).toBe(
      "10031000111211000002"
    );
  });

  it("pumping station", () => {
    // EFFPME----H****
    expect(convertLetterCode2NumberCode("EFFPME----")).toBe(
      "10032000001214050000"
    );
  });

  it("converts status", () => {
    const convertStatus = (letterStatus: string): string => {
      return convertLetterCode2NumberCode(
        replaceCharAt("SFGPUCI-----", 3, letterStatus)
      )[6];
    };

    for (const [key, value] of Object.entries(STATUS_MAP)) {
      expect(convertStatus(key)).toBe(value);
    }
  });

  it("converts standard identity", () => {
    const convertSID = (letterSid: string): string => {
      return convertLetterCode2NumberCode(
        replaceCharAt("SFGPUCI-----", 1, letterSid)
      ).substring(2, 4);
    };

    for (const [key, value] of Object.entries(SID_MAP)) {
      expect(convertSID(key)).toBe(value);
    }
  });

  it("should handle echelons with * instead of -", () => {
    expect(convertLetterCode2NumberCode("SFGPUCIC--*E---")).toBe(
      "10031000151211000002"
    );
  });

  it("should handle standard identities with - or *", () => {
    expect(convertLetterCode2NumberCode("S-GPUCIC---E---")).toBe(
      "10031000151211000002"
    );

    expect(convertLetterCode2NumberCode("S*GPUCIC---E---")).toBe(
      "10031000151211000002"
    );
  });

  it("should handle status with - or *", () => {
    expect(convertLetterCode2NumberCode("SFG-UCIC---E---")).toBe(
      "10031000151211000002"
    );

    expect(convertLetterCode2NumberCode("SFG*UCIC---E---")).toBe(
      "10031000151211000002"
    );
  });

  describe("edge cases", () => {
    it("ground / unit / combat / field artillery / rocket", () => {
      // This symbol is ambiguous
      expect(convertLetterCode2NumberCode("SFGPUCFR-------")).toBe(
        "10031000001303004100"
      );
    });
  });

  describe("new interface", () => {
    it("frigate", () => {
      const { sidc, success, match } =
        convertLetterSidc2NumberSidc("SFSPCLFF----");
      expect(sidc).toBe("10033000001202040000");
      expect(success).toBe(true);
      expect(match).toBe("exact");
    });
    it("invalid SIDC should return success=false", () => {
      const { sidc, success, match } =
        convertLetterSidc2NumberSidc("ILLEGALVALUE");
      expect(sidc).toBe("");
      expect(success).toBe(false);
      expect(match).toBe("failed");
    });
  });

  describe("regressions", () => {
    it("handles unspecified operational condition", () => {
      const { sidc } = convertLetterSidc2NumberSidc("SFG-UCI----J---");
      expect(sidc).toBe("10031000221211000000");
    });

    it("SOF unit ground ranger", () => {
      const { sidc } = convertLetterSidc2NumberSidc("SFFPGR---------");
      expect(sidc).toBe("10031000001211007601");
    });
  });
});
