---
"@orbat-mapper/convert-symbology": minor
---

Convert symbols drawn as a bare frame, without an icon, in both directions
(e.g. `SFGP------AH---` <-> `10031002180000000000`). When no icon matches,
conversion now falls back to the frame instead of failing: `closest` for
letter -> number, `partial` for number -> letter.