import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { "convert-symbology": "./lib/index.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
});
