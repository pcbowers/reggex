/// <reference types="vitest" />
import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reporter: process.env.CI
        ? ["text", "text-summary", "cobertura"]
        : ["text", "text-summary", "html"],
    },
    reporters: process.env.CI ? ["junit"] : ["verbose"],
    outputFile: process.env.CI ? "junit.xml" : undefined,
  },
  resolve: {
    alias: {
      "@types": resolve(__dirname, "src/types/index"),
      "@utils": resolve(__dirname, "src/utils/index"),
    },
  },
})
