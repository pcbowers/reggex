import { createState } from "@utils"
import { describe, expect, it } from "vitest"
import {
  anyChar,
  capture,
  controlChar,
  hexCode,
  match,
  namedCapture,
  unicodeChar,
  wordChar,
} from "./index"

describe("characters", () => {
  describe("anyChar", () => {
    it("works", () => {
      const test = anyChar
      expect(test.getState()).toMatchObject(createState({ curExp: "." }))
    })
  })

  describe("controlChar", () => {
    it("works with an upper case letter", () => {
      const test = controlChar("A")
      expect(test.getState()).toMatchObject(createState({ curExp: "\\cA" }))
    })
    it("works with a lower case letter", () => {
      const test = controlChar("a")
      expect(test.getState()).toMatchObject(createState({ curExp: "\\ca" }))
    })
  })

  describe("hexCode", () => {
    it("works with 2 characters", () => {
      const test = hexCode("aa")
      expect(test.getState()).toMatchObject(createState({ curExp: "\\xaa" }))
    })

    it("works with 4 characters", () => {
      const test = hexCode("a0a0")
      expect(test.getState()).toMatchObject(createState({ curExp: "\\ua0a0" }))
    })
  })

  describe("unicodeChar", () => {
    it("works with 4 characters", () => {
      const test = unicodeChar("aaaa")
      expect(test.getState()).toMatchObject(createState({ curExp: "\\u{aaaa}" }))
    })

    it("works with 5 characters", () => {
      const test = unicodeChar("a0a0a")
      expect(test.getState()).toMatchObject(createState({ curExp: "\\u{a0a0a}" }))
    })
  })

  describe("wordChar", () => {
    it("works", () => {
      const test = wordChar
      expect(test.getState()).toMatchObject(createState({ curExp: "\\w" }))
    })
  })

  describe("backreferenceTo", () => {
    it("works with a numbered reference", () => {
      const test = capture(match.anyChar).and.backreferenceTo(1)
      expect(test.getState()).toMatchObject(
        createState({ curExp: "\\1", prvExp: "(.)", groups: ["(.)"] })
      )
    })

    it("works with a named reference", () => {
      const test = namedCapture("test", match.anyChar).and.backreferenceTo("test")
      expect(test.getState()).toMatchObject(
        createState({
          curExp: "\\k<test>",
          prvExp: "(?<test>.)",
          names: ["test"],
          groups: ["(?<test>.)"],
        })
      )
    })
  })
})
