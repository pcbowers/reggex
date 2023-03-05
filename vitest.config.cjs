/// <reference types="vitest" />
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      enabled: true,
      reporter: ["text", "text-summary", "cobertura"]
    },
    reporters: ["verbose", "junit"],
    outputFile: "junit.xml"
  }
})
