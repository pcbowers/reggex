import { state } from "@utils"
import { describe, expect, it } from "vitest"
import {
  anyChar,
  capture,
  controlChar,
  group,
  hexCode,
  Input,
  match,
  namedCapture,
  unicodeChar,
  wordChar,
} from "./Input"

describe("Input", () => {
  describe("match", () => {
    it("allows any input", () => {
      expect(match["state"]).toEqual(Input.create()["state"])
    })
  })

  describe("anyChar", () => {
    it("works", () => {
      const test = anyChar
      expect(test["state"]).toMatchObject(state({ curExp: "." }))
    })
  })

  describe("append", () => {
    it("works", () => {
      const test = match.append(match.anyChar.and.wordChar)
      expect(test["state"]).toMatchObject(state({ curExp: "\\w", prvExp: "." }))
    })
  })

  describe("backreferenceTo", () => {
    it("works with a numbered reference", () => {
      const test = capture(match.anyChar).and.backreferenceTo(1)
      expect(test["state"]).toMatchObject(state({ curExp: "\\1", prvExp: "(.)", groups: ["(.)"] }))
    })

    it("works with a named reference", () => {
      const test = namedCapture("test", match.anyChar).and.backreferenceTo("test")
      expect(test["state"]).toMatchObject(
        state({
          curExp: "\\k<test>",
          prvExp: "(?<test>.)",
          names: ["test"],
          groups: ["(?<test>.)"],
        })
      )
    })
  })

  describe("capture", () => {
    it("works", () => {
      const test = capture(match.anyChar.and.wordChar)
      expect(test["state"]).toMatchObject(state({ curExp: "(.\\w)", groups: ["(.\\w)"] }))
    })
  })

  describe("controlChar", () => {
    it("works with an upper case letter", () => {
      const test = controlChar("A")
      expect(test["state"]).toMatchObject(state({ curExp: "\\cA" }))
    })
    it("works with a lower case letter", () => {
      const test = controlChar("a")
      expect(test["state"]).toMatchObject(state({ curExp: "\\ca" }))
    })
  })

  describe("group", () => {
    it("works", () => {
      const test = group(match.anyChar.and.wordChar)
      expect(test["state"]).toMatchObject(state({ curExp: "(?:.\\w)" }))
    })
  })

  describe("hexCode", () => {
    it("works with 2 characters", () => {
      const test = hexCode("aa")
      expect(test["state"]).toMatchObject(state({ curExp: "\\xaa" }))
    })

    it("works with 4 characters", () => {
      const test = hexCode("a0a0")
      expect(test["state"]).toMatchObject(state({ curExp: "\\ua0a0" }))
    })
  })

  describe("namedCapture", () => {
    it("works with high complexity", () => {
      const test = namedCapture(
        "test",
        match.anyChar.and.wordChar.thatRepeats.greedily.oneOrMore.groupedAs.namedCapture("asdf")
      ).and.anyChar.as.captureGroup.and.group(match.anyChar.and.wordChar)
      expect(test["state"]).toMatchObject(
        state({
          curExp: "(?:.\\w)",
          prvExp: "(?<test>.(?<asdf>\\w+))(.)",
          names: ["test", "asdf"],
          groups: ["(?<test>.(?<asdf>\\w+))", "(?<asdf>\\w+)", "(.)"],
        })
      )
    })
  })

  describe("unicodeChar", () => {
    it("works with 4 characters", () => {
      const test = unicodeChar("aaaa")
      expect(test["state"]).toMatchObject(state({ curExp: "\\u{aaaa}" }))
    })

    it("works with 5 characters", () => {
      const test = unicodeChar("a0a0a")
      expect(test["state"]).toMatchObject(state({ curExp: "\\u{a0a0a}" }))
    })
  })

  describe("wordChar", () => {
    it("works", () => {
      const test = wordChar
      expect(test["state"]).toMatchObject(state({ curExp: "\\w" }))
    })
  })
})
