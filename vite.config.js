import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "queueeventemitter",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: { },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [dts()],
});