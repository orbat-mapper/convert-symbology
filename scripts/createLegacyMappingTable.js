import fs from "fs/promises";
import { csvParse } from "d3-dsv";

const INPUT_FILE =
  "../../../../joint-military-symbology-xml/samples/legacy_support/LegacyMappingTableCtoD.csv";
const INPUT_FILE2 =
  "../../joint-military-symbology-xml/samples/legacy_support/All_ID_Mapping_Latest.csv";

const ADDITIONAL_SYMBOLS = [
  ["S*G*UCFR--", "10", "1303004100"],
  ["S*F*GR----", "10", "1211007601"],
  ["G*M*OH----", "25", "2820000000"],
  ["G*M*OW----", "25", "2903000000"],
  ["G*M*B-----", "25", "2706000000"],

  // Frames without an icon.
  ["S*Z*------", "00", "0000000000"],
  ["S*A*------", "01", "0000000000"],
  ["S*P*------", "05", "0000000000"],
  ["S*G*------", "10", "0000000000"],
  ["S*G*E-----", "15", "0000000000"],
  ["S*G*I-----", "20", "0000000000"],
  ["S*S*------", "30", "0000000000"],
  ["S*U*------", "35", "0000000000"],

  // SIGINT frames: upstream maps them to 01/05/15/30/35, but SIGINT icons
  // are mapped to the dedicated 50-54 symbol sets, so keep frames consistent.
  ["I*P*------", "50", "0000000000"],
  ["I*A*------", "51", "0000000000"],
  ["I*G*------", "52", "0000000000"],
  ["I*S*------", "53", "0000000000"],
  ["I*U*------", "54", "0000000000"],

  // Crewed space vehicle: listed upstream without a 2525D code
  ["S*P*V-----", "05", "1101000000"],
];

const OVERRIDE_SYMBOLS = [["S*F*GR----", "10", "1211007601"]];
const overrideKeys = OVERRIDE_SYMBOLS.map((e) => e[0]);

async function loadData() {
  try {
    const data = await fs.readFile(INPUT_FILE2, { encoding: "utf8" });
    return csvParse(data);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const data = await loadData();

function replaceCharAt(text, index, replacementChar) {
  return text.substring(0, index) + replacementChar + text.substring(index + 1);
}

function uniqByKeepLast(a, key) {
  return [...new Map(a.map((x) => [key(x), x])).values()];
}

const d = data
  .map((line) => {
    const { MainIcon, Modifier1, Modifier2, ExtraIcon, LegacyKey } = line;
    const letters = normalizeLetterCode(LegacyKey);
    // const b = line["DeltaToCharlie"];
    if (MainIcon.includes("_") || LegacyKey.length !== 10) return;

    const symbolSet = MainIcon.slice(0, 2);
    if (isNaN(symbolSet) || symbolSet.length !== 2) return;
    const mod1 = (Modifier1 && Modifier1.slice(2, 4)) || "00";
    const mod2 = (Modifier2 && Modifier2.slice(2, 4)) || "00";
    // Is symbol retired?
    if (symbolSet === "98") return;
    // const rev = normalizeLetterCode(b).slice(0, 10);
    const numbers = `${MainIcon.slice(2)}${mod1}${mod2}`;

    return [letters, symbolSet, numbers];
  })
  .filter((e) => e && !overrideKeys.includes(e[0])) // remove empty entries
  .concat(ADDITIONAL_SYMBOLS)
  .concat(OVERRIDE_SYMBOLS);

const c = uniqByKeepLast(d, (e) => JSON.stringify(e)).sort((aa, bb) => {
  // sort by letter SIDC
  const a = aa[0];
  const b = bb[0];
  return a < b ? -1 : a > b ? 1 : 0;
});

function normalizeLetterCode(sidc) {
  return replaceCharAt(replaceCharAt(sidc, 3, "*"), 1, "*");
}

await fs.writeFile("./test.json", JSON.stringify(c));
// console.log(JSON.stringify(c, null, 2));
console.log(c);
