// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
export default defineConfig({
  build: {
    sourcemap: "true",
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "ConvertSymbology",
      fileName: "convert-symbology",
    },
    // minify:false
  },
  plugins: [dts({ rollupTypes: true })],
});
