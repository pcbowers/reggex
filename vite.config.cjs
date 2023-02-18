/// <reference types="vitest" />

import { resolve } from "path"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reporter: process.env.CI ? ["text", "text-summary", "cobertura"] : ["text", "text-summary"],
    },
    reporters: process.env.CI ? ["junit"] : ["verbose"],
    outputFile: process.env.CI ? "junit.xml" : undefined,
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "regexp-ts",
      fileName: "regexp-ts",
    },
  },
  plugins: [tsconfigPaths()],
})
