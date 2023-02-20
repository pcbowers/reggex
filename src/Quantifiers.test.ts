import { createState } from "@utils"
import { describe, expect, it } from "vitest"
import { match } from "./index"

const tests = (name: "thatRepeats" | "thatOccurs") => {
  describe("oneOrMore", () => {
    it("resolves", () => {
      const test = match.anyChar[name].oneOrMore
      expect(test.getState()).toMatchObject(createState({ curExp: ".+" }))
    })

    it("greedily resolves", () => {
      const test = match.anyChar[name].greedily.oneOrMore
      expect(test.getState()).toMatchObject(createState({ curExp: ".+" }))
    })

    it("lazily resolves", () => {
      const test = match.anyChar.thatRepeats.lazily.oneOrMore
      expect(test.getState()).toMatchObject(createState({ curExp: ".+?" }))
    })
  })

  describe("zeroOrMore", () => {
    it("resolves", () => {
      const test = match.anyChar[name].zeroOrMore
      expect(test.getState()).toMatchObject(createState({ curExp: ".*" }))
    })

    it("greedily resolves", () => {
      const test = match.anyChar[name].greedily.zeroOrMore
      expect(test.getState()).toMatchObject(createState({ curExp: ".*" }))
    })

    it("lazily resolves", () => {
      const test = match.anyChar[name].lazily.zeroOrMore
      expect(test.getState()).toMatchObject(createState({ curExp: ".*?" }))
    })
  })
}

describe("Quantifiers", () => {
  describe("thatOccurs", () => {
    tests("thatOccurs")
  })

  describe("thatRepeats", () => {
    tests("thatRepeats")
  })
})
