import { describe, expect, it } from "vitest"
import { Input } from "./Input"
import { Quantifier } from "./Quantifier"

describe("Quantifier", () => {
  it("creates", () => {
    const test = Quantifier.create().oneOrMore
    expect(test["state"].curExpression).toEqual("+")
  })

  describe("oneOrMore", () => {
    it("greedily resolves", () => {
      const test = Input.create().anyChar.thatRepeats.oneOrMore
      expect(test["state"].curExpression).toEqual(".+")
    })

    it("lazily resolves", () => {
      const test = Input.create().anyChar.thatRepeats.lazily.oneOrMore
      expect(test["state"].curExpression).toEqual(".+?")
    })
  })

  describe("zeroOrMore", () => {
    it("greedily resolves", () => {
      const test = Input.create().anyChar.thatRepeats.zeroOrMore
      expect(test["state"].curExpression).toEqual(".*")
    })

    it("lazily resolves", () => {
      const test = Input.create().anyChar.thatRepeats.lazily.zeroOrMore
      expect(test["state"].curExpression).toEqual(".*?")
    })
  })
})
