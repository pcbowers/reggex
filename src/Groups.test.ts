import { createState } from "@utils"
import { describe, expect, it } from "vitest"
import { match } from "./index"

describe("Groups", () => {
  function tests(name: "groupedAs" | "as") {
    describe("namedCapture", () => {
      it("works", () => {
        const test = match.anyChar[name].namedCapture("test")
        expect(test.getState()).toMatchObject(
          createState({ curExp: "(?<test>.)", names: ["test"], groups: ["(?<test>.)"] })
        )
      })
    })
    describe("capture", () => {
      it("works", () => {
        const test = match.anyChar[name].capture
        expect(test.getState()).toMatchObject(createState({ curExp: "(.)", groups: ["(.)"] }))
      })
    })
    describe("nonCapture", () => {
      it("works", () => {
        const test = match.anyChar[name].nonCapture
        expect(test.getState()).toMatchObject(createState({ curExp: "(?:.)" }))
      })
    })
  }

  describe("groupedAs", () => {
    tests("groupedAs")
  })
  describe("as", () => {
    tests("as")
  })
})
