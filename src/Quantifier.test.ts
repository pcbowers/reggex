import { state } from "@utils"
import { describe, expect, it } from "vitest"
import { match } from "./Input"

const tests = (name: "thatRepeats" | "thatOccurs") => {
  describe("oneOrMore", () => {
    it("resolves", () => {
      const test = match.anyChar[name].oneOrMore
      expect(test["state"]).toMatchObject(state({ curExp: ".+" }))
    })

    it("greedily resolves", () => {
      const test = match.anyChar[name].greedily.oneOrMore
      expect(test["state"]).toMatchObject(state({ curExp: ".+" }))
    })

    it("lazily resolves", () => {
      const test = match.anyChar.thatRepeats.lazily.oneOrMore
      expect(test["state"]).toMatchObject(state({ curExp: ".+?" }))
    })
  })

  describe("zeroOrMore", () => {
    it("resolves", () => {
      const test = match.anyChar[name].zeroOrMore
      expect(test["state"]).toMatchObject(state({ curExp: ".*" }))
    })

    it("greedily resolves", () => {
      const test = match.anyChar[name].greedily.zeroOrMore
      expect(test["state"]).toMatchObject(state({ curExp: ".*" }))
    })

    it("lazily resolves", () => {
      const test = match.anyChar[name].lazily.zeroOrMore
      expect(test["state"]).toMatchObject(state({ curExp: ".*?" }))
    })
  })
}

describe("Quantifier", () => {
  describe("thatOccurs", () => {
    tests("thatOccurs")
  })

  describe("thatRepeats", () => {
    tests("thatRepeats")
  })
})
