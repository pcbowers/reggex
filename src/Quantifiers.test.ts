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

  describe("optionally", () => {
    it("resolves", () => {
      const test = match.anyChar[name].optionally

      expect(test.getState()).toMatchObject(createState({ curExp: ".?" }))
    })

    it("greedily resolves", () => {
      const test = match.anyChar[name].greedily.optionally

      expect(test.getState()).toMatchObject(createState({ curExp: ".?" }))
    })

    it("lazily resolves", () => {
      const test = match.anyChar[name].lazily.optionally

      expect(test.getState()).toMatchObject(createState({ curExp: ".??" }))
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

  describe("atLeast", () => {
    it("resolves", () => {
      const test = match.anyChar[name].atLeast(3)

      expect(test.getState()).toMatchObject(createState({ curExp: ".{3,}" }))
    })

    it("greedily resolves", () => {
      const test = match.anyChar[name].greedily.atLeast(3)

      expect(test.getState()).toMatchObject(createState({ curExp: ".{3,}" }))
    })

    it("lazily resolves", () => {
      const test = match.anyChar[name].lazily.atLeast(3)

      expect(test.getState()).toMatchObject(createState({ curExp: ".{3,}?" }))
    })
  })

  describe("atMost", () => {
    it("resolves", () => {
      const test = match.anyChar[name].atMost(3)

      expect(test.getState()).toMatchObject(createState({ curExp: ".{,3}" }))
    })

    it("greedily resolves", () => {
      const test = match.anyChar[name].greedily.atMost(3)

      expect(test.getState()).toMatchObject(createState({ curExp: ".{,3}" }))
    })

    it("lazily resolves", () => {
      const test = match.anyChar[name].lazily.atMost(3)

      expect(test.getState()).toMatchObject(createState({ curExp: ".{,3}?" }))
    })
  })

  describe("exactly", () => {
    it("resolves", () => {
      const test = match.anyChar[name].exactly(3)

      expect(test.getState()).toMatchObject(createState({ curExp: ".{3}" }))
    })

    it("greedily resolves", () => {
      const test = match.anyChar[name].greedily.exactly(3).times

      expect(test.getState()).toMatchObject(createState({ curExp: ".{3}" }))
    })

    it("lazily resolves", () => {
      const test = match.anyChar[name].lazily.exactly(3)

      expect(test.getState()).toMatchObject(createState({ curExp: ".{3}?" }))
    })
  })

  describe("between", () => {
    it("resolves", () => {
      const test = match.anyChar[name].between(2, 3)

      expect(test.getState()).toMatchObject(createState({ curExp: ".{2,3}" }))
    })

    it("greedily resolves", () => {
      const test = match.anyChar[name].greedily.between(2, 3).times

      expect(test.getState()).toMatchObject(createState({ curExp: ".{2,3}" }))
    })

    it("lazily resolves", () => {
      const test = match.anyChar[name].lazily.between(2, 3).times

      expect(test.getState()).toMatchObject(createState({ curExp: ".{2,3}?" }))
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
