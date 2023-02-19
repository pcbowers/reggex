import { state } from "@utils"
import { describe, expect, it } from "vitest"
import { match } from "./Input"

describe("TypedRegExp", () => {
  describe("and", () => {
    it("starts a new expression", () => {
      const test = match.anyChar.and
      expect(test["state"]).toMatchObject(
        state({ curExp: "", prvExp: ".", msg: "⏳ Select Input..." })
      )
    })
  })
})
