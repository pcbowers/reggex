import { createState } from "@utils"
import { describe, expect, it } from "vitest"
import { capture, group, match, namedCapture } from "./index"

describe("Appenders", () => {
  describe("group", () => {
    it("works", () => {
      const test = group(match.anyChar.and.wordChar)
      expect(test.getState()).toMatchObject(createState({ curExp: "(?:.\\w)" }))
    })
  })

  describe("capture", () => {
    it("works", () => {
      const test = capture(match.anyChar.and.wordChar)
      expect(test.getState()).toMatchObject(createState({ curExp: "(.\\w)", groups: ["(.\\w)"] }))
    })
  })

  describe("namedCapture", () => {
    it("works with high complexity", () => {
      const test = namedCapture(
        "test",
        match.anyChar.and.wordChar.thatRepeats.greedily.oneOrMore.groupedAs.namedCapture("asdf")
      ).and.anyChar.as.capture.and.group(match.anyChar.and.wordChar)
      expect(test.getState()).toMatchObject(
        createState({
          curExp: "(?:.\\w)",
          prvExp: "(?<test>.(?<asdf>\\w+))(.)",
          names: ["test", "asdf"],
          groups: ["(?<test>.(?<asdf>\\w+))", "(?<asdf>\\w+)", "(.)"],
        })
      )
    })
  })

  describe("append", () => {
    it("works", () => {
      const test = match.anyChar.and.wordChar.and.append(match.anyChar.and.wordChar)
      expect(test.getState()).toMatchObject(createState({ curExp: "\\w", prvExp: ".\\w." }))
    })
  })
})
