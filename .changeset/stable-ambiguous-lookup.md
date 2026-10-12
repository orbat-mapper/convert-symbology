---
"@orbat-mapper/convert-symbology": patch
---

Letter codes that map to several numeric codes now always convert to the first
one in the lookup table. The result used to depend on where the binary search
landed, and could change whenever rows were added to the table. Affected codes:
`S*A*W-----` (now 01 Weapon instead of 02 Missile), `W*-*HHDK--`, `W*-*HPBA--`.