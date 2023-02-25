/// <reference types="vitest" />
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      enabled: true,
      reporter: process.env.CI
        ? ["text", "text-summary", "cobertura"]
        : ["text", "text-summary", "html"]
    },
    reporters: process.env.CI ? ["junit"] : ["verbose"],
    outputFile: process.env.CI ? "junit.xml" : undefined
  }
})
