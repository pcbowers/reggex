import { createState } from "@utils"
import { describe, expect, it } from "vitest"
import { anyChar, controlChar, hexCode, match, unicodeChar, wordChar } from "./index"

describe("Inputs", () => {
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

  describe("anyButWordChar", () => {
    it("works", () => {
      const test = match.anyButWordChar

      expect(test.getState()).toMatchObject(createState({ curExp: "\\W" }))
    })
  })

  describe("specificChar", () => {
    it("works", () => {
      const test = match.specificChar("a")

      expect(test.getState()).toMatchObject(createState({ curExp: "a" }))
    })
  })

  describe("unicodeProperty", () => {
    it("works", () => {
      const test = match.unicodeProperty("L")

      expect(test.getState()).toMatchObject(createState({ curExp: "\\p{L}" }))
    })
  })

  describe("anyButUnicodeProperty", () => {
    it("works", () => {
      const test = match.anyButUnicodeProperty("L")

      expect(test.getState()).toMatchObject(createState({ curExp: "\\P{L}" }))
    })
  })

  describe("whitespaceChar", () => {
    it("works", () => {
      const test = match.whitespaceChar

      expect(test.getState()).toMatchObject(createState({ curExp: "\\s" }))
    })
  })

  describe("anyButWhitespaceChar", () => {
    it("works", () => {
      const test = match.anyButWhitespaceChar

      expect(test.getState()).toMatchObject(createState({ curExp: "\\S" }))
    })
  })

  describe("anyDigit", () => {
    it("works", () => {
      const test = match.anyDigit

      expect(test.getState()).toMatchObject(createState({ curExp: "\\d" }))
    })
  })

  describe("anyButDigit", () => {
    it("works", () => {
      const test = match.anyButDigit

      expect(test.getState()).toMatchObject(createState({ curExp: "\\D" }))
    })
  })

  describe("nullByte", () => {
    it("works", () => {
      const test = match.nullByte

      expect(test.getState()).toMatchObject(createState({ curExp: "\\0" }))
    })
  })

  describe("tab", () => {
    it("works", () => {
      const test = match.tab

      expect(test.getState()).toMatchObject(createState({ curExp: "\\t" }))
    })
  })

  describe("verticalTab", () => {
    it("works", () => {
      const test = match.verticalTab

      expect(test.getState()).toMatchObject(createState({ curExp: "\\v" }))
    })
  })

  describe("newline", () => {
    it("works", () => {
      const test = match.newline

      expect(test.getState()).toMatchObject(createState({ curExp: "\\n" }))
    })
  })

  describe("carriageReturn", () => {
    it("works", () => {
      const test = match.carriageReturn

      expect(test.getState()).toMatchObject(createState({ curExp: "\\r" }))
    })
  })

  describe("formfeed", () => {
    it("works", () => {
      const test = match.formfeed

      expect(test.getState()).toMatchObject(createState({ curExp: "\\f" }))
    })
  })

  describe("backsapce", () => {
    it("works", () => {
      const test = match.backspace

      expect(test.getState()).toMatchObject(createState({ curExp: "[\\b]" }))
    })
  })

  describe("string", () => {
    it("works", () => {
      const test = match.string("test")

      expect(test.getState()).toMatchObject(createState({ curExp: "test" }))
    })
  })

  describe("anyButString", () => {
    it("works", () => {
      const test = match.anyButString("test")

      expect(test.getState()).toMatchObject(createState({ curExp: "[^t][^e][^s][^t]" }))
    })
  })

  const rangeTests = (name: "anyInRange" | "range") => {
    it("works", () => {
      const test = match[name]("a-z_-")

      expect(test.getState()).toMatchObject(createState({ curExp: "[a-z_-]" }))
    })
  }

  describe("anyInRange", () => {
    rangeTests("anyInRange")
  })
  describe("range", () => {
    rangeTests("range")
  })

  describe("anyNotInRange", () => {
    it("works", () => {
      const test = match.anyNotInRange("a-z_-")

      expect(test.getState()).toMatchObject(createState({ curExp: "[^a-z_-]" }))
    })
  })
})
