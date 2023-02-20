import { createState, DEFAULT_MESSAGE } from "@utils"
import { describe, expect, it } from "vitest"
import { match } from "./index"

describe("TypedRegExp", () => {
  describe("DEFAULT_MESSAGE", () => {
    it("is a string", () => {
      expect(typeof DEFAULT_MESSAGE).toBe("string")
    })
  })

  describe("and", () => {
    it("starts a new expression", () => {
      const test = match.anyChar.and.wordChar.and.anyChar
      expect(test.getState()).toEqual(createState({ curExp: ".", prvExp: ".\\w" }))
    })
  })
})
